from django.db import models
from django.contrib.auth.models import (AbstractUser)

# Create your models here.
class Persona(AbstractUser):
    ident = models.IntegerField(null= False, unique= True, blank=False)
    nombre = models.CharField(max_length=20, null= False, blank=False)
    apellido = models.CharField(max_length=20, null= False, blank=False)
    correo = models.EmailField(max_length=20, null= False, blank=False, unique=True)
    password = models.CharField(max_length=10, null=False, blank=False)
    rol = models.IntegerField(null=True, blank=True)
    username = models.CharField(unique=False, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'correo'
    first_name = None
    last_name = None
    email = None
    is_staff = None
    # is_active = None
    date_joined = None
    last_login = None
    is_superuser = None
    
    class Meta:
        db_table="personas"