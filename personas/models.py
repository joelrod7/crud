from django.db import models

# Create your models here.
class Persona(models.Model):
    ident = models.IntegerField(max_length=15, null= False, unique= True, blank=False)
    nombre = models.CharField(max_length=20, null= False, blank=False)
    apellido = models.CharField(max_length=20, null= False, blank=False)
    correo = models.CharField(max_length=20, null= False, blank=False, unique=False)
    password = models.CharField(max_length=10, null=False, blank=False)
    rol = models.IntegerField(max_length=1, null=True, blank=True)
    
    class Meta:
        db_table="personas"