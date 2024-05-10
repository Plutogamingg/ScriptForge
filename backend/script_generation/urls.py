from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from . import views


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
    path('api/scripts/<int:script_id>/', views.script_details, name='script_details'),
    path('api/chat-with-openai/<int:script_id>/generate', chat_with_openai, name='generate_script'),
    path('scripts/<int:script_id>/save-generated-script/', views.save_generated_script, name='save_generated_script'),
    path('generated-scripts/<int:generated_script_id>/delete/', views.delete_generated_script, name='delete_generated_script'),
    path('scripts/<int:script_id>/generated-scripts/', views.get_generated_scripts, name='get_generated_scripts'),
    path('api/scripts/<int:script_id>/delete/', views.delete_script, name='delete_script'),
    path('api/commit-script/<int:generated_script_id>/', views.commit_script, name='commit_script'),
]
