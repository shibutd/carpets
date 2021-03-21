from django.contrib import admin
from polymorphic.admin import (
    PolymorphicParentModelAdmin,
    PolymorphicChildModelAdmin,
)

from authentication.admin import RestrictAddChangeDeleteMixin
from orders.filters import PolymorphicModelFilter, StatusFilter
from orders.models import (
    Order,
    PickupOrder,
    DeliveryOrder,
    OrderLine,
)


class OrderParentAdmin(
    RestrictAddChangeDeleteMixin,
    PolymorphicParentModelAdmin
):
    base_model = Order
    child_models = (PickupOrder, DeliveryOrder)
    list_display = ('custom_date_added', 'user_name')
    list_filter = (PolymorphicModelFilter, StatusFilter, 'date_added')
    search_fields = ('user__name',)
    ordering = ('date_added', 'date_updated')

    def custom_date_added(self, obj):
        return obj.date_added.strftime('%d-%m-%y - %a %H:%M')

    def user_name(self, obj):
        return obj.user.email

    custom_date_added.short_description = "Время создания заказа"
    user_name.short_description = "Пользователь"


class OrderLineInline(admin.TabularInline):
    model = OrderLine
    fields = (
        'variation',
        'quantity'
    )


class OrderChildAdmin(
    RestrictAddChangeDeleteMixin,
    PolymorphicChildModelAdmin
):
    base_model = Order
    inlines = (OrderLineInline,)


class PickupOrderAdmin(OrderChildAdmin):
    base_model = PickupOrder


class DeliveryOrderAdmin(OrderChildAdmin):
    base_model = DeliveryOrder


admin.site.register(Order, OrderParentAdmin)
admin.site.register(PickupOrder, PickupOrderAdmin)
admin.site.register(DeliveryOrder, DeliveryOrderAdmin)
