from django.urls import path
from .api.viewsets import (
    TaskViewSet,
)

task_list = TaskViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

task_detail = TaskViewSet.as_view({
    'get': 'retrieve',
    'patch': 'partial_update',
})

urlpatterns = [
    path('tasks/', task_list, name='tasks-list'),
    path('tasks/<int:pk>/', task_detail, name='tasks-detail'),
]
