from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CharacterViewSet, RelationshipViewSet, ScriptViewSet, StoryViewSet

router = DefaultRouter()
router.register(r'characters', CharacterViewSet, basename='character')
router.register(r'relationships', RelationshipViewSet, basename='relationship')
router.register(r'scripts', ScriptViewSet, basename='script')
router.register(r'stories', StoryViewSet, basename='story')

urlpatterns = [
    path('', include(router.urls)),
]
