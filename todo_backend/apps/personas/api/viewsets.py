from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import PersonaSerializer
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import Persona

class CreatePersona(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = PersonaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Usuario creado correctamente",
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Login(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        data = request.data
        try:
            persona = Persona.objects.get(correo=data['correo'])
            if check_password(data['password'], persona.password):
                refresh = RefreshToken.for_user(persona)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)

        except Persona.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
class PersonasList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Persona.objects.all().order_by('id')
        data = PersonaSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)