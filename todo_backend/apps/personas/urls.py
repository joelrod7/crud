from django.urls import path
from .api.viewsets import (
    CreatePersona,
    Login,
    PersonasList,
)

urlpatterns = [
    path('register/', CreatePersona.as_view()),
    path('token/', Login.as_view()),
    path('personas/', PersonasList.as_view()),
]
