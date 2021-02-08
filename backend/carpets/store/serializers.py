from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer

from store.models import (
    Product,
    ProductCategory,
    ProductImage,
    PickupOrder,
    OrderStatus,
    ProductVariation,
    VariationTag,
    VariationQuantity,
    Order,
    PickupOrder,
    PickupAddress,
    DeliveryOrder,
    OrderLine,
    Promotion,
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

    class Meta:
        model = Product
        fields = (
            'name',
            'slug',
            'images',
        )
        extra_kwargs = {
            'slug': {'validators': []},
        }


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
    product = ProductSerializer()

    class Meta:
        model = ProductVariation
        fields = ('id', 'size', 'price', 'quantities', 'product')


class ProductVariationWithoutImagesSerializer(DynamicFieldsModelSerializer):
    id = serializers.UUIDField(format='hex_verbose')
    size = serializers.ReadOnlyField(
        source='size.value'
    )
    product = ProductSerializer(exclude_fields=('images',), required=False)

    class Meta:
        model = ProductVariation
        fields = ('id', 'size', 'price', 'product')


class VariationTagSerializer(serializers.ModelSerializer):
    """
    Serializer for product's tag.
    """

    class Meta:
        model = VariationTag
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
            'manufacturer': list(manufacturers),
            'material': list(materials),
            'size': list(sizes)
        }


class PickupAddressSerializer(serializers.ModelSerializer):
    """
    Serializer for pickup address.
    """

    class Meta:
        model = PickupAddress
        fields = ('name', 'phone_number')


class OrderLineListSerializer(serializers.ListSerializer):
    """
    Serializer for multiple orderline instances.
    """

    def create(self, validated_data):
        ids = self.context.get('ids', [])
        order = self.context.get('order')

        orderlines = []

        for item in validated_data:
            variation = item.get('variation')
            id = variation.pop('id')
            if not id or str(id) in ids:
                continue

            quantity = item.pop('quantity')

            try:
                variation = ProductVariation.objects.get(id=id)
            except ObjectDoesNotExist:
                continue

            orderlines.append(
                OrderLine(
                    order=order,
                    variation=variation,
                    quantity=(quantity or 1),
                )
            )
        return OrderLine.objects.bulk_create(orderlines)


class OrderLineSerializer(serializers.ModelSerializer):
    """
    Serializer for single orderline instance.
    """
    variation = ProductVariationWithoutImagesSerializer()

    class Meta:
        model = OrderLine
        list_serializer_class = OrderLineListSerializer
        fields = ('variation', 'quantity')


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('status', 'date_added')


class PickupOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupOrder
        fields = ('status', 'pickup_address', 'date_added')


class DeliveryOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryOrder
        fields = ('status', 'delivery_address', 'date_added')


class OrderPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Order: OrderSerializer,
        PickupOrder: PickupOrderSerializer,
        DeliveryOrder: DeliveryOrderSerializer
    }


    # lines = OrderLineSerializer(many=True)

    # class Meta:
    #     model = PickupOrder
    #     fields = ('pickup_address', 'lines')

    # def validate_lines(self, value):
    #     if len(value) == 0:
    #         raise serializers.ValidationError(
    #             'Order must contain products to be created.'
    #         )
    #     return value

    # def create(self, validated_data):
    #     user = self.context.get('user')
    #     lines = validated_data.pop('lines')

    #     pickup_order = PickupOrder.objects.create(
    #         user=user,
    #         **validated_data
    #     )

    #     for line in lines:
    #         product_slug = line['product']['slug']
    #         quantity = line['quantity']
    #         OrderLine.objects.create(
    #             order=pickup_order,
    #             product=Product.objects.get(slug=product_slug),
    #             quantity=quantity,
    #         )

    #     return pickup_order


class PromotionSerializer(serializers.ModelSerializer):
    """
    Serializer for promotion.
    """

    class Meta:
        model = Promotion
        fields = ('id', 'title', 'description')
