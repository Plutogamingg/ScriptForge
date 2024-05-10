from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.viewsets import ModelViewSet
from django.db import transaction
from django.db.models import Prefetch
from rest_framework.permissions import IsAuthenticated
from .models import Character, Relationship, Script, Story, GeneratedScript, Trait
from .serializers import CharacterSerializer, RelationshipSerializer, ScriptSerializer, StorySerializer
from .choices import *
from django.http import JsonResponse
import openai
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.core.exceptions import ValidationError
from pinecone import Pinecone, ServerlessSpec
from pinecone import pinecone
from sentence_transformers import SentenceTransformer
import json
import numpy as np



class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def characters(self, request, pk=None):
        story = self.get_object()
        characters = story.characters.all()
        serializer = CharacterSerializer(characters, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def scripts(self, request, pk=None):
        story = self.get_object()
        scripts = story.scripts.all()
        serializer = ScriptSerializer(scripts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='add_characters')
    def add_characters(self, request, pk=None):
        story = self.get_object()
        character_ids = request.data.get('character_ids')  # This should always be a list of IDs

        if not character_ids:
            return Response({'error': 'Character IDs are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure character_ids is always a list
        if isinstance(character_ids, int):
            character_ids = [character_ids]

        try:
            characters = Character.objects.filter(id__in=character_ids)
            if characters.exists():
                story.characters.add(*characters)
                return Response({'status': 'characters added'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No characters found with the provided IDs'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['get'], url_path='available_characters')
    def available_characters(self, request, pk=None):
        story = self.get_object()
        script_id = request.query_params.get('script_id')  # Optional script ID to exclude characters

        # Fetch characters associated with the story but not with the specified script
        if script_id:
            characters = story.characters.exclude(scripts__id=script_id)
        else:
            characters = story.characters.all()

        serializer = CharacterSerializer(characters, many=True)

        return Response(serializer.data)
    def destroy(self, request, *args, **kwargs):
        story = self.get_object()
        with transaction.atomic():
            # Disassociate characters from the story and its scripts
            characters = Character.objects.filter(stories=story)
            for character in characters:
                character.stories.remove(story)
                for script in story.scripts.all():
                    character.scripts.remove(script)

            # Delete scripts associated with the story
            story.scripts.all().delete()

            # Finally, delete the story
            story.delete()

        return Response({'status': 'story and related data deleted'}, status=status.HTTP_204_NO_CONTENT)

class StoryCharacterListView(ListAPIView):
    serializer_class = CharacterSerializer

    def get_queryset(self):
        story_id = self.kwargs.get('story_id')
        return Character.objects.filter(stories__id=story_id)

class StoryScriptListView(ListAPIView):
    serializer_class = ScriptSerializer

    def get_queryset(self):
        story_id = self.kwargs.get('story_id')
        return Script.objects.filter(story__id=story_id)

class ScriptViewSet(ModelViewSet):
    queryset = Script.objects.all()
    serializer_class = ScriptSerializer

    @action(detail=True, methods=['post'], url_path='add_characters')
    def add_characters(self, request, pk=None):
        script = self.get_object()
        character_ids = request.data.get('character_ids')

        if not character_ids:
            return Response({'error': 'Character IDs are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                characters = Character.objects.filter(id__in=character_ids, stories=script.story).distinct()
                if len(characters) != len(character_ids):
                    missing_ids = set(character_ids) - set(characters.values_list('id', flat=True))
                    return Response({'error': 'Characters not found in this story: {}'.format(missing_ids)}, status=status.HTTP_404_NOT_FOUND)

                script.characters.set(characters)
                return Response({'status': 'Characters added to script'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned characters to those not linked to the given story,
        by filtering against a `exclude_story` query parameter in the URL.
        """
        queryset = Character.objects.all()
        exclude_story = self.request.query_params.get('exclude_story')
        if exclude_story is not None:
            queryset = queryset.exclude(stories__id=exclude_story)
        return queryset

class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer
    permission_classes = [permissions.IsAuthenticated]

class DropdownChoicesAPIView(APIView):
    def get(self, request):
        choices = {
            'genre_choices': GENRE_CHOICES,
            'setting_choices': SETTING_CHOICES,
            'time_period_choices': TIME_PERIOD_CHOICES,
            'story_type_choices': STORY_TYPE_CHOICES,
            'pace_choices': PACE_CHOICES,
            'story_tone_choices': STORY_TONE_CHOICES,
            'writing_style_choices': WRITING_STYLE_CHOICES,
            'character_traits_choices': CHARACTER_TRAITS_CHOICES,
            'character_type_choices':CHARACTER_TYPE_CHOICES,
            'character_backstory_choices': CHARACTER_BACKSTORY_CHOICES,
            'character_relationship_choices': CHARACTER_RELATIONSHIP_CHOICES,
        }

        formatted_choices = {key: [{'key': choice[0], 'value': choice[1]} for choice in value] for key, value in choices.items()}
        return Response(formatted_choices)


def script_details(request, script_id):
    try:
        # Fetch the script and its related data
        script = Script.objects.select_related('story').prefetch_related(
            Prefetch('characters', queryset=Character.objects.all())
        ).get(id=script_id)

        # Compile script information, including new attributes
        script_info = {
            "script_title": script.title,
            "script_genre": script.script_genre,
            "story_title": script.story.title,
            "story_description": script.story.description,
            "script_setting": script.script_setting,
            "script_period": script.script_period,
            "script_type": script.script_type,
            "script_pace": script.script_pace,
            "script_tone": script.script_tone,
            "script_style": script.script_style,
            "script_context": script.script_context,
            "characters": []
        }

        # Compile character information related to the script
        for character in script.characters.all():
            character_info = {
                "name": character.name,
                "backstory": character.backstory,
                "character_type": character.character_type  # Including character type
            }
            script_info["characters"].append(character_info)

        return JsonResponse(script_info)

    except Script.DoesNotExist:
        return JsonResponse({'error': 'Script not found'}, status=404)



# Load the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

def chat_with_openai(request, script_id):
    context_info = ""

    try:
        script = Script.objects.select_related('story').prefetch_related(
            Prefetch('characters', queryset=Character.objects.prefetch_related(
                Prefetch('traits', queryset=Trait.objects.all())
            ))
        ).get(id=script_id)

        print("Script fetched successfully:", script.title)

        pc = pinecone.Pinecone(api_key="2a189a32-205c-4922-b6f7-c2c0f1716663")
        print("Pinecone client initialized:", pc)

        # Pass the Pinecone client instance to the function
        index_name = get_or_create_index(script.story_id, pc)
        print("Index name retrieved:", index_name)

        index = pc.Index(index_name)
        print("Pinecone index accessed:", index)

        context_vector = generate_vector(script.script_context)
        print("Context vector generated:", context_vector)

        context_vector = generate_vector(script.story.description)

       
        query_result = index.query(
        vector=context_vector,
        top_k=1,
        include_values=True,
        include_metadata=True
        )
        print("query_result:", query_result)

        if query_result['matches']:
            past_context = query_result['matches'][0]['metadata'].get('content', '')
            context_info = f"Buildi on previous narratives take into account how named charcters interact with each other whle makeing the new script, here is the previous script: {past_context[:3000]}..."
            print("Past context:", past_context)
        else:
            context_info = "Starting fresh without prior context."
            print("No past context found.")

    except Script.DoesNotExist:
        return JsonResponse({'error': 'Script not found'}, status=404)
    except Exception as e:
        print("Error:", str(e))
        return JsonResponse({'error': str(e)}, status=500)

    # Proceed only if script was successfully fetched
    if 'script' in locals():  # Check if script is defined
        introduction = (
            f"Create a screenplay for '{script.title}', a {script.script_genre} set in {script.script_setting} during {script.script_period}. "
            f"The script tone should be {script.script_tone}, paced as {script.script_pace}, with a writing style focused on {script.script_style}. "
            f"it is extremely important that the script is based on the above while following this narrative {script.script_context}"
            f"Now i willl give you added information that you should consider as to keep the script in line with the rest of the story Here's the overarching story: Description: {script.story.description}. and past story information: {context_info}. now with this information you can see past interactiosn with characters and events "
            f"Each character's dialogue should clearly indicate their name, like 'Tom: [What's happening here?]'. "
            f"Detail each scene and character interaction to develop a rich narrative, written as a script for a cutscene."
        )
        print("the prompt:", introduction)

        messages = [
            {"role": "system", "content": introduction}
        ]

        for character in script.characters.all():
            character_description = (
                f"Character {character.name}, a {character.character_type}, known for traits such as {', '.join([trait.description for trait in character.traits.all()])}. "
                f"Backstory: {character.backstory}."
            )
            messages.append({"role": "user", "content": character_description})

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                max_tokens=4000
            )
            return JsonResponse({'generated_script': response.choices[0].message['content']})
        except Exception as e:
            return JsonResponse({'error': 'Failed to generate script with OpenAI.'}, status=500)
    else:
        return JsonResponse({'error': context_info}, status=500)





openai.api_key = 'sk-proj-a1fG9KkpKQLPGRVShEKpT3BlbkFJbNwamJoi8bRus1ppcqQg'

@require_http_methods(["POST"])  # Restrict this view to only POST method
def save_generated_script(request, script_id):
    try:
        import json
        data = json.loads(request.body)
        content = data.get('content', '')
        
        script = Script.objects.get(id=script_id)
        generated_script = GeneratedScript(script=script, content=content)
        generated_script.save()
        return JsonResponse({'status': 'success', 'message': 'Generated script saved successfully'})
    except Script.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Script not found'})
    except ValidationError as ve:
        return JsonResponse({'status': 'error', 'message': str(ve)})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
    

@require_http_methods(["DELETE"])
def delete_generated_script(request, generated_script_id):
    try:
        generated_script = GeneratedScript.objects.get(id=generated_script_id)
        generated_script.delete()
        return JsonResponse({'status': 'success', 'message': 'Generated script deleted successfully'})
    except GeneratedScript.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Generated script not found'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

def get_generated_scripts(request, script_id):
    try:
        script = Script.objects.get(id=script_id)
        generated_scripts = script.generated_scripts.all()  # Assuming reverse relation name from Script to GeneratedScript
        data = [{
            'id': gen_script.id,
            'content': gen_script.content,
            'created_at': gen_script.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for gen_script in generated_scripts]
        return JsonResponse({'status': 'success', 'data': data})
    except Script.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Script not found'})
    

@require_http_methods(["DELETE"])
def delete_script(request, script_id):
    try:
        script = Script.objects.get(id=script_id)
        script.delete()  # Deleting the script will also delete all related GeneratedScript instances due to the CASCADE option.
        return JsonResponse({'status': 'success', 'message': 'Script and all related drafts deleted successfully'})
    except Script.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Script not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# Initialize Pinecone client
pc = Pinecone(api_key="2a189a32-205c-4922-b6f7-c2c0f1716663")

def get_pinecone_client():
    # Assuming the Pinecone API key is set in your environment variables
    api_key = "2a189a32-205c-4922-b6f7-c2c0f1716663"
    if not api_key:
        raise ValueError("Pinecone API key is not set in environment variables")
    return Pinecone(api_key=api_key)


import logging

# Set up logging
logger = logging.getLogger(__name__)

def get_or_create_index(story_id, pc):
    """
    Ensures a Pinecone index exists for the given story_id, creating one if necessary.

    Args:
    story_id (int): Unique identifier for the story.
    pc (Pinecone): Pinecone client instance.

    Returns:
    str: The name of the Pinecone index.
    """
    index_name = f'story-{story_id}-index'
    try:
        # Fetch existing indexes and check if the required index exists
        indexes = pc.list_indexes()
        logger.debug(f"Indexes list response: {indexes}")

        existing_index_names = [index['name'] for index in indexes.get('indexes', [])]  # Add .get 

        logger.debug(f"Existing index names: {existing_index_names}")
        
        if index_name not in existing_index_names:
            pc.create_index(
                name=index_name,
                dimension=384,  # Ensure this matches the dimensions of your model's embeddings
                metric='cosine',
                spec=ServerlessSpec(cloud='aws', region='us-west-1')
            )
            logger.info(f"Index created: {index_name}")
        else:
            logger.info(f"Index already exists: {index_name}")

        return index_name

    except Exception as e:
        logger.error(f"Failed to create or retrieve index: {e}")
        raise  # Consider raising an exception or handling it as appropriate for your application







def generate_vector(text):
    """Generate a vector from the text using the pre-loaded transformer model."""
    vector = model.encode([text])[0]
    if isinstance(vector, np.ndarray):
        vector = vector.tolist()  # Convert numpy array to a list if necessary
    return vector

def commit_script_to_pinecone(index_name, script_id, content):
    """Commit script content as a vector to the specified Pinecone index."""
    pc = get_pinecone_client()  # Get the Pinecone client
    index = pc.Index(name=index_name)  # Access the specific Pinecone index
    vector = generate_vector(content)  # Generate a vector from the script content
    response = index.upsert(vectors=[(str(script_id), vector)])  # Upsert the vector into the index
    print("Pinecone upsert response:", response)  # Print or log the response from Pinecone


@require_http_methods(["POST"])
def commit_script(request, generated_script_id):
    try:
        # Retrieve the GeneratedScript instance to access the linked Script
        generated_script = GeneratedScript.objects.get(id=generated_script_id)
        script = generated_script.script
        index_name = script.story.get_index_name()

        # Parse JSON data from the request
        data = json.loads(request.body)
        content = data.get('content')
        if not content:
            return JsonResponse({'status': 'error', 'message': 'No content provided for committing.'})

        # Generate a vector from the content and upsert into Pinecone
        vector = generate_vector(content)
        pc = get_pinecone_client()
        index = pc.Index(name=index_name)
        index.upsert([
                    {
                        "id": str(script.id),
                        "values": vector, 
                        "metadata": {"content": content}  # Store current content as metadata
                    }
                ]) 
        return JsonResponse({'status': 'success', 'message': 'Script committed and vector stored in Pinecone'})
    except GeneratedScript.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Generated Script not found for ID {generated_script_id}'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})