from rest_framework import serializers

from store.models import (
    Product,
    ProductCategory,
    ProductImage,
    ProductTag,
    PickupOrder,
    Order,
    OrderStatus,
    OrderLine,
    PickupAddress,
    ProductVariation,
    VariationQuantity,
    Promotion,
    ProductSize,
)


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `exclude_fields` argument that
    exclude fields from being displayed.
    """

    def __init__(self, *args, **kwargs):
        exclude_fields = kwargs.pop('exclude_fields', None)

        super().__init__(*args, **kwargs)

        if exclude_fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            not_allowed = set(exclude_fields)
            existing = set(self.fields)
            for field_name in existing.intersection(not_allowed):
                self.fields.pop(field_name)


class ProductImageSerializer(serializers.ModelSerializer):
    """
    Serializer for product's image.
    """
    class Meta:
        model = ProductImage
        fields = ('image', 'thumbnail')


class ProductSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for product.
    """
    images = ProductImageSerializer(many=True)
    minimum_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'name',
            'slug',
            'images',
            'minimum_price',
        )

    def get_minimum_price(self, obj):
        all_variations = obj.variations.all()
        if all_variations.count() > 0:
            minimum_price = min([
                variation.price for variation in obj.variations.all()
            ])
        else:
            minimum_price = None
        return minimum_price


class VariationQuantitySerializer(serializers.ModelSerializer):
    """
    Serializer for variation's quantities.
    """
    address = serializers.ReadOnlyField(
        source='address.name'
    )

    class Meta:
        model = VariationQuantity
        fields = ('address', 'amount')


class ProductVariationSerializer(DynamicFieldsModelSerializer):
    size = serializers.ReadOnlyField(
        source='size.value'
    )
    quantities = VariationQuantitySerializer(many=True)
    product = ProductSerializer(exclude_fields=('minimum_price',))

    class Meta:
        model = ProductVariation
        fields = ('id', 'size', 'price', 'quantities', 'product')


# class ProductVariationWithProductsSerializer(serializers.ModelSerializer):
#     """
#     Serializer for variation with quantities.
#     """
#     size = serializers.ReadOnlyField(
#         source='size.value'
#     )
#     quantities = VariationQuantitySerializer(many=True)

#     class Meta:
#         model = ProductVariation
#         fields = ('id', 'size', 'price', 'quantities')


# class ProductVariationWithQuantitiesSerializer(serializers.ModelSerializer):
#     """
#     Serializer for variation with quantities.
#     """
#     size = serializers.ReadOnlyField(
#         source='size.value'
#     )
#     quantities = VariationQuantitySerializer(many=True)

#     class Meta:
#         model = ProductVariation
#         fields = ('id', 'size', 'price', 'quantities')


class ProductTagSerializer(serializers.ModelSerializer):
    """
    Serializer for product's tag.
    """

    class Meta:
        model = ProductTag
        fields = ('name', 'slug')


class ProductWithVariationsSerializer(serializers.ModelSerializer):
    """
    Serializer for product with variations.
    """
    manufacturer = serializers.ReadOnlyField(
        source='manufacturer.name'
    )
    material = serializers.ReadOnlyField(
        source='material.name'
    )
    unit = serializers.ReadOnlyField(
        source='unit.name'
    )
    images = ProductImageSerializer(many=True)
    variations = ProductVariationSerializer(
        many=True,
        exclude_fields=('product',)
    )
    tags = ProductTagSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            'name',
            'manufacturer',
            'material',
            'unit',
            'images',
            'description',
            'slug',
            'variations',
            'tags',
        )


class ProductCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for product category.
    """

    class Meta:
        model = ProductCategory
        fields = ('name', 'slug', 'image')


class ProductCategoryWithPropertiesSerializer(serializers.ModelSerializer):
    """
    Serializer for product category with properties:
    manufacturers, materials, sizes.
    """
    properties = serializers.SerializerMethodField()

    class Meta:
        model = ProductCategory
        fields = ('name', 'slug', 'properties')

    def get_properties(self, obj):
        category_query = ProductCategory.objects.filter(slug=obj.slug)
        manufacturers = category_query.values_list(
            'product__manufacturer__name', flat=True
        ).distinct()

        materials = category_query.values_list(
            'product__material__name', flat=True
        ).distinct()

        sizes = category_query.values_list(
            'product__variations__size__value', flat=True
        ).distinct()

        return {
            'manufacturers': list(manufacturers),
            'materials': list(materials),
            'sizes': list(sizes)
        }


class PickupAddressSerializer(serializers.ModelSerializer):
    """
    Serializer for pickup address.
    """

    class Meta:
        model = PickupAddress
        fields = ('name',)


class OrderLineSerializer(serializers.ModelSerializer):
    """
    Serializer for orderline.
    """
    product = serializers.SerializerMethodField()

    class Meta:
        model = OrderLine
        fields = ('product', 'quantity')

    def get_product(self, obj):
        obj = OrderLine.objects.filter(id=obj.id).select_related(
            'variation__size', 'variation__product')
        variation = obj[0].variation
        return {
            'name': variation.product.name,
            'slug': variation.product.slug,
            'size': variation.size.value,
            'price': variation.price,
            'id': variation.id,
        }


class PickupOrderSerializer(serializers.ModelSerializer):
    lines = OrderLineSerializer(many=True)

    class Meta:
        model = PickupOrder
        fields = ('pickup_address', 'lines')

    def validate_lines(self, value):
        if len(value) == 0:
            raise serializers.ValidationError(
                'Order must contain products to be created.'
            )
        return value

    def create(self, validated_data):
        user = self.context.get('user')
        lines = validated_data.pop('lines')

        pickup_order = PickupOrder.objects.create(
            user=user,
            **validated_data
        )

        for line in lines:
            product_slug = line['product']['slug']
            quantity = line['quantity']
            OrderLine.objects.create(
                order=pickup_order,
                product=Product.objects.get(slug=product_slug),
                quantity=quantity,
            )

        return pickup_order


class PromotionSerializer(serializers.ModelSerializer):
    """
    Serializer for promotion.
    """

    class Meta:
        model = Promotion
        fields = ('title', 'description')


class ProductSizeSerializer(serializers.ModelSerializer):
    """
    Serializer for promotion.
    """

    class Meta:
        model = ProductSize
        fields = ('value',)
