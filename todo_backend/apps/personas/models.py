from django.db import models

# Create your models here.
class Persona(models.Model):
    ident = models.IntegerField(null= False, unique= True, blank=False)
    nombre = models.CharField(max_length=20, null= False, blank=False)
    apellido = models.CharField(max_length=20, null= False, blank=False)
    correo = models.EmailField(max_length=20, null= False, blank=False, unique=True)
    password = models.CharField(max_length=10, null=False, blank=False)
    rol = models.IntegerField(null=True, blank=True)
    
    class Meta:
        db_table="personas"