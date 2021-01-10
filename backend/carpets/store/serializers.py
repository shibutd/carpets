from rest_framework import serializers

from store.models import (
    Product,
    ProductCategory,
    ProductQuantity,
    PickupOrder,
    Order,
    OrderStatus,
    OrderLine,
    PickupAddress,
)


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for product.
    """

    class Meta:
        model = Product
        fields = (
            'name',
            'size',
            'price',
            'slug',
        )


class ProductQuantitySerializer(serializers.ModelSerializer):
    """
    Serializer for product's quantities.
    """
    address = serializers.ReadOnlyField(
        source='address.name'
    )

    class Meta:
        model = ProductQuantity
        fields = ('address', 'amount')


class ProductWithQuantitiesSerializer(serializers.ModelSerializer):
    """
    Serializer for product with quantities.
    """
    manufacturer = serializers.ReadOnlyField(
        source='manufacturer.name'
    )
    material = serializers.ReadOnlyField(
        source='material.name'
    )
    quantities = ProductQuantitySerializer(many=True)

    class Meta:
        model = Product
        fields = (
            'name',
            'size',
            'manufacturer',
            'material',
            'price',
            'slug',
            'quantities',
        )


class ProductCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for orderline.
    """

    class Meta:
        model = ProductCategory
        fields = ('name', 'image')


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
    product = ProductSerializer()

    class Meta:
        model = OrderLine
        fields = ('product', 'quantity')


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
