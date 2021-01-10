from django.contrib import admin

from authentication.models import CustomUser, UserAddress


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_staff', 'is_superuser')
    search_fields = ('email',)
    ordering = ('email',)


class UserAddressAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'city',
        'street',
        'house_number',
        'appartment_number'
    )
    list_filter = ('city',)
    search_fields = ('user__email', 'city', 'street')


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserAddress, UserAddressAdmin)
