from django.urls import path
from .views import CharacterViewSet, RelationshipViewSet, ScriptViewSet

urlpatterns = [
    path('character', CharacterViewSet.as_view()),
    path('relationship', RelationshipViewSet.as_view()),
    path('Script', ScriptViewSet.as_view()),

]