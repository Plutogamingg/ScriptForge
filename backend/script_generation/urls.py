from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CharacterViewSet, RelationshipViewSet, ScriptViewSet, StoryViewSet, DropdownChoicesAPIView

# Setup router for ViewSets
router = DefaultRouter()
router.register(r'character', CharacterViewSet, basename='character')
router.register(r'relationships', RelationshipViewSet, basename='relationship')
router.register(r'scripts', ScriptViewSet, basename='script')
router.register(r'stories', StoryViewSet, basename='story')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path('dropdown-choices', DropdownChoicesAPIView.as_view(), name='dropdown-choices'),  # Direct path for APIView
]
