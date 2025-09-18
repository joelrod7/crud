from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from ..models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-fecha_creacion')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Tarea creada correctamente",
            # "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "message": "Tarea actualizada correctamente",
            # "data": serializer.data
        }, status=status.HTTP_200_OK)
