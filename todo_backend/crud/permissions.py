from rest_framework.permissions import BasePermission

class IsRole1(BasePermission):
    message = "No autorizado: se requiere rol = 1."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and getattr(user, "rol", None) == 1)
