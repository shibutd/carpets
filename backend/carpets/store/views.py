from rest_framework.generics import ListAPIView, RetrieveAPIView

from store.serializers import ProductSerializer
from store.models import Product


class ProductList(ListAPIView):
    queryset = Product.objects.in_stock()
    serializer_class = ProductSerializer


class ProductDetail(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
