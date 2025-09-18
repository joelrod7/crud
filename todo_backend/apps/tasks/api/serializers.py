from rest_framework import serializers
from ..models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'titulo', 'descripcion', 'fecha_creacion', 'fecha_inicio', 'fecha_fin', 'estado')
        read_only_fields = ('id', 'fecha_creacion')
