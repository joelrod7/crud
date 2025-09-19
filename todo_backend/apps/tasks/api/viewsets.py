from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from ..models import Task
from .serializers import TaskSerializer
from crud.permissions import IsRole1

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.filter(activo=1).order_by('-fecha_creacion')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsRole1]
    
    def perform_create(self, serializer):
        serializer.save(usuario_registro=self.request.user)

    def create(self, request):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Tarea creada correctamente",
            # "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={"request": request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "message": "Tarea actualizada correctamente",
            # "data": serializer.data
        }, status=status.HTTP_200_OK)
