from django.contrib import admin
from polymorphic.admin import (
    PolymorphicParentModelAdmin,
    PolymorphicChildModelAdmin,
)

from store.models import (
    Product,
    ProductCategory,
    ProductImage,
    ProductVariation,
    VariationQuantity,
    VariationTag,
    PickupAddress,
    Order,
    PickupOrder,
    DeliveryOrder,
    OrderLine,
    Promotion,
)
from store.filters import PolymorphicModelFilter, StatusFilter
from authentication.admin import RestrictAddChangeDeleteMixin


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image',)


class ProductVariationProductsInline(admin.TabularInline):
    model = ProductVariation
    extra = 3
    fields = ('size', 'price')


class VariationQuantityInline(admin.StackedInline):
    model = VariationQuantity
    extra = 1
    fields = ('address', 'amount')


class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'manufacturer',
        'material',
        'has_image',
    )
    list_filter = ('category', 'date_updated',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    inlines = (ProductImageInline, ProductVariationProductsInline)

    def has_image(self, obj):
        return obj.images.count() > 0

    has_image.boolean = True
    has_image.short_description = "Изображение"


class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'slug',
        'has_image',
    )
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

    def has_image(self, obj):
        return bool(obj.image)

    has_image.boolean = True
    has_image.short_description = "Изображение"


class ProductVariationAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'size', 'price', 'in_stock')
    list_filter = ('product__category',)
    search_fields = ('product__name',)
    ordering = ('product__category__name', 'product__name')
    inlines = (VariationQuantityInline,)

    def product_name(self, obj):
        return obj.product.name


class ProductVariationTagsInline(admin.TabularInline):
    model = VariationTag.productvariation_set.through
    extra = 3


class VariationTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ('productvariation',)
    inlines = (ProductVariationTagsInline,)


class PickupAddressAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', '_longitude', '_latitude')

    def _longitude(self, obj):
        return obj.longitude

    def _latitude(self, obj):
        return obj.latitude

    _longitude.short_description = 'Долгота'
    _latitude.short_description = 'Широта'


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

    custom_date_added.short_description = "Время создания заказа"

    def user_name(self, obj):
        return obj.user.email

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


class PromotionAdmin(admin.ModelAdmin):
    list_display = ('_title', '_description')

    def _title(self, obj):
        return obj.title

    def _description(self, obj):
        return obj.description

    _title.short_description = 'Название'
    _description.short_description = 'Описание'


admin.site.register(Product, ProductAdmin)
admin.site.register(ProductCategory, ProductCategoryAdmin)
admin.site.register(ProductVariation, ProductVariationAdmin)
admin.site.register(VariationTag, VariationTagAdmin)
admin.site.register(PickupAddress, PickupAddressAdmin)
admin.site.register(Order, OrderParentAdmin)
admin.site.register(PickupOrder, PickupOrderAdmin)
admin.site.register(DeliveryOrder, DeliveryOrderAdmin)
admin.site.register(Promotion, PromotionAdmin)
