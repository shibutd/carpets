from django.contrib import admin
from django.contrib.auth.models import Group

from authentication.models import CustomUser, UserAddress


class RestrictAddChangeDeleteMixin:

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class CustomUserAdmin(RestrictAddChangeDeleteMixin, admin.ModelAdmin):
    list_display = ('email', 'is_staff', 'is_superuser')
    search_fields = ('email',)
    ordering = ('email',)


class UserAddressAdmin(RestrictAddChangeDeleteMixin, admin.ModelAdmin):
    list_display = (
        'user',
        'city',
        'street',
        'house_number',
        'appartment_number'
    )
    list_filter = ('city',)
    search_fields = ('user__email', 'city', 'street')


admin.site.unregister(Group)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserAddress, UserAddressAdmin)
