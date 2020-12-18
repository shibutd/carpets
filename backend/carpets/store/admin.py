from django.contrib import admin
from django.utils.html import format_html
from polymorphic.admin import (
    PolymorphicParentModelAdmin,
    PolymorphicChildModelAdmin,
    PolymorphicChildModelFilter,
)

from store.models import (
    Product,
    ProductImage,
    Order,
    PickupOrder,
    DeliveryOrder,
)


class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'slug',
        'manufacturer',
        'material',
        'in_stock',
        'price',
    )
    list_filter = ('in_stock', 'date_updated')
    list_editable = ('in_stock',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('thumbnail_tag', 'product_name')
    readonly_fields = ('thumbnail',)
    search_fields = ('product__name',)

    def thumbnail_tag(self, obj):
        """
        Return HTML for 'thumbnail_tag'.
        """
        if obj.thumbnail:
            return format_html(
                '<img src={}/>'.format(obj.thumbnail.url)
            )
        return '-'

    thumbnail_tag.short_description = 'Thumbnail'

    def product_name(self, obj):
        return obj.product.name


class OrderParentAdmin(PolymorphicParentModelAdmin):
    base_model = Order
    child_models = (PickupOrder, DeliveryOrder)
    list_filter = (PolymorphicChildModelFilter,)


class OrderChildAdmin(PolymorphicChildModelAdmin):
    base_model = Order


class PickupOrderAdmin(OrderChildAdmin):
    base_model = PickupOrder


class DeliveryOrderAdmin(OrderChildAdmin):
    base_model = DeliveryOrder


admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(Order, OrderParentAdmin)
admin.site.register(PickupOrder, PickupOrderAdmin)
admin.site.register(DeliveryOrder, DeliveryOrderAdmin)
