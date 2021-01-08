from rest_framework import permissions


class IsStaffUser(permissions.BasePermission):
    """
    Deny access if user is not staff.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        return user.is_staff


class IsSuperUser(permissions.BasePermission):
    """
    Deny access if user is not staff.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        return user.is_superuser
