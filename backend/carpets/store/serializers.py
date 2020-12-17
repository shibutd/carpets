from rest_framework.serializers import ModelSerializer, ReadOnlyField

from store.models import Product


class ProductSerializer(ModelSerializer):
    """
    Serializer for product.
    """
    manufacturer = ReadOnlyField(
        source='get_manufacturer_display'
    )
    material = ReadOnlyField(
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
