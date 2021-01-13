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

class ThumbnailDisplay:

    def render_thumbnail(self, obj):
        """
        Return HTML for 'thumbnail_tag'.
        """
        if obj.thumbnail:
            return format_html(
                '<img src={}/>'.format(obj.thumbnail.url)
            )
        return '-'

    render_thumbnail.short_description = 'Thumbnail'


class ProductImageInline(ThumbnailDisplay, admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'render_thumbnail')
    readonly_fields = ('render_thumbnail',)


class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'slug',
        'manufacturer',
        'material',
        'in_stock',
    )
    list_filter = ('in_stock', 'date_updated')
    list_editable = ('in_stock',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    inlines = (ProductImageInline,)


class ProductImageAdmin(ThumbnailDisplay, admin.ModelAdmin):
    list_display = ('render_thumbnail', 'product_name')
    readonly_fields = ('thumbnail',)
    search_fields = ('product__name',)

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
