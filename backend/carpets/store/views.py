from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from store.serializers import ProductSerializer, PickupOrderSerializer
from store.models import Product


class ProductList(ListAPIView):
    queryset = Product.objects.in_stock()
    serializer_class = ProductSerializer


class ProductDetail(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'


class PickupOrderCreate(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        serializer = PickupOrderSerializer(
            data=request.data,
            context={'user': request.user}
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
