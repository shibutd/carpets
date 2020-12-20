from rest_framework import serializers

from store.models import Product, PickupOrder, OrderLine


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for product.
    """
    manufacturer = serializers.ReadOnlyField(
        source='get_manufacturer_display'
    )
    material = serializers.ReadOnlyField(
        source='get_material_display'
    )

    class Meta:
        model = Product
        fields = (
            'name',
            'size',
            'manufacturer',
            'material',
            'price',
            'slug',
        )


class OrderLineSerializer(serializers.ModelSerializer):
    product = serializers.CharField(source='product.slug')

    class Meta:
        model = OrderLine
        fields = ('product', 'quantity')

    def validate_product(self, value):
        check_query = Product.objects.filter(slug=value)
        if not check_query.exists():
            raise serializers.ValidationError(
                'Product "{}" does not exist.'.format(value)
            )
        return value


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
