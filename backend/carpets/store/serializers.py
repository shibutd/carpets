from django.db.models import Min, FloatField
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer

from authentication.models import UserAddress
from store.models import (
    Product,
    ProductCategory,
    ProductImage,
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
        fields = ('image',)


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
        extra_kwargs = {
            'slug': {'validators': []},
        }

    def get_minimum_price(self, obj):
        minimum_price = obj.variations.aggregate(
            Min('price', output_field=FloatField())
        )
        return minimum_price['price__min']


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


class ProductVariationWithoutImagesSerializer(DynamicFieldsModelSerializer):
    id = serializers.UUIDField(format='hex_verbose')
    size = serializers.ReadOnlyField(
        source='size.value'
    )
    product = ProductSerializer(
        exclude_fields=('images', 'minimum_price'),
        required=False
    )

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
        fields = ('id', 'name', 'phone_number', 'longitude', 'latitude')


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
    """
    Serializer for order model class.
    """
    class Meta:
        model = Order
        fields = ('status', 'date_added')


class PickupOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for pickup order model class.
    """
    status = serializers.ReadOnlyField(
        source='get_status_display'
    )
    pickup_address = serializers.PrimaryKeyRelatedField(
        queryset=PickupAddress.objects.all()
    )
    date_added = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = PickupOrder
        fields = ('status', 'pickup_address', 'date_added')


class DeliveryOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for delivery order model class.
    """
    status = serializers.ReadOnlyField(
        source='get_status_display'
    )
    delivery_address = serializers.PrimaryKeyRelatedField(
        queryset=UserAddress.objects.all()
    )
    date_added = serializers.DateTimeField(
        format="%d-%m-%Y %H:%M", read_only=True)

    class Meta:
        model = DeliveryOrder
        fields = ('status', 'delivery_address', 'date_added')


class OrderPolymorphicSerializer(PolymorphicSerializer):
    """
    Polymorphic serializer to determine type of serializer to use.
    """
    resource_type_field_name = 'ordertype'
    model_serializer_mapping = {
        Order: OrderSerializer,
        PickupOrder: PickupOrderSerializer,
        DeliveryOrder: DeliveryOrderSerializer,
    }


class PromotionSerializer(serializers.ModelSerializer):
    """
    Serializer for promotion.
    """

    class Meta:
        model = Promotion
        fields = ('id', 'title', 'description')
