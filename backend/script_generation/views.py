from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Character, Relationship, Script, Story
from .serializers import CharacterSerializer, RelationshipSerializer, ScriptSerializer, StorySerializer
from .choices import *

class StoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Story.objects.all()
    serializer_class = StorySerializer

class ScriptViewSet(viewsets.ModelViewSet):
    queryset = Script.objects.all()
    serializer_class = ScriptSerializer
    permission_classes = [permissions.IsAuthenticated]  # Adjust permissions as needed


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [permissions.IsAuthenticated]  # Adjust permissions as needed

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

