from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.viewsets import ModelViewSet
from django.db import transaction
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from .models import Character, Relationship, Script, Story, Trait
from .serializers import CharacterSerializer, RelationshipSerializer, ScriptSerializer, StorySerializer
from .choices import *

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

