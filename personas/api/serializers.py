from rest_framework import serializers
from ..models import Persona

class PersonaDetalle(serializers.serializers):
    class Meta:
        model = Persona
        fields = ('ident', 'nombre', 'apellido', 'correo', 'password', 'rol')
        