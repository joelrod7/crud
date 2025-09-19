from django.db import models

# Create your models here.
class Task(models.Model):
    # codigo = models.CharField(max_length=10, null=False)
    titulo = models.CharField(max_length=20, null=False)
    descripcion = models.CharField(max_length=100, null=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_inicio = models.DateTimeField(null=False)
    fecha_fin = models.DateTimeField(null=False)
    estado = models.IntegerField(null=False)
    asignado = models.ForeignKey('personas.Persona', null=True, on_delete=models.SET_NULL, related_name='usuario_task')
    usuario_registro = models.ForeignKey('personas.Persona', on_delete=models.PROTECT, related_name='usuario_add_persona', null=False)
    
    class Meta:
        db_table = 'task'