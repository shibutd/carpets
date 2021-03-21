from django.contrib import admin

from store.models import (
    Product,
    ProductCategory,
    ProductImage,
    ProductVariation,
    VariationQuantity,
    VariationTag,
    PickupAddress,
    Promotion,
)


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
        'image_tag',
    )
    list_filter = ('category', 'date_updated',)
    readonly_fields = ('image_tag',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    inlines = (ProductImageInline, ProductVariationProductsInline)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related(
            'category',
            'manufacturer',
            'material'
        ).prefetch_related('images')


class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'image_tag',
    )
    search_fields = ('name',)
    readonly_fields = ('image_tag',)
    prepopulated_fields = {'slug': ('name',)}


class ProductVariationAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'size', 'price', 'in_stock')
    list_filter = ('product__category',)
    search_fields = ('product__name',)
    ordering = ('product__category__name', 'product__name')
    inlines = (VariationQuantityInline,)

    def product_name(self, obj):
        return obj.product.name

    product_name.short_description = 'Название'


class ProductVariationTagsInline(admin.TabularInline):
    model = VariationTag.productvariation_set.through
    extra = 3


class VariationTagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ('productvariation',)
    inlines = (ProductVariationTagsInline,)


class PickupAddressAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'latitude', 'longitude')


class PromotionAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')


admin.site.register(Product, ProductAdmin)
admin.site.register(ProductCategory, ProductCategoryAdmin)
admin.site.register(ProductVariation, ProductVariationAdmin)
admin.site.register(VariationTag, VariationTagAdmin)
admin.site.register(PickupAddress, PickupAddressAdmin)
admin.site.register(Promotion, PromotionAdmin)
