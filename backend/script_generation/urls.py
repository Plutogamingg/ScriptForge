from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Setup router for ViewSets
router = DefaultRouter()
router.register(r'character', CharacterViewSet, basename='character')
router.register(r'relationships', RelationshipViewSet, basename='relationship')
router.register(r'script', ScriptViewSet, basename='script')
router.register(r'stories', StoryViewSet, basename='story')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path('dropdown-choices', DropdownChoicesAPIView.as_view(), name='dropdown-choices'),  # Direct path for APIView
    path('stories/<int:story_id>/character', StoryCharacterListView.as_view(), name='story-characters'),
    path('stories/<int:story_id>/script', StoryScriptListView.as_view(), name='story-scripts'),
]
