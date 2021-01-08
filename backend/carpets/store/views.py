from functools import wraps

from rest_framework import status
from rest_framework import generics
from rest_framework import views
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from store.serializers import (
    ProductSerializer,
    PickupOrderSerializer,
    OrderLineSerializer
)
from store.permissions import IsSuperUser
from store.models import Product, Order, OrderLine, OrderStatus


class OrderLineList(generics.ListAPIView):
    """
    Create order line.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = OrderLineSerializer

    def get_queryset(self):
        user = self.request.user
        return OrderLine.objects.filter(
            order__user=user,
            order__status=OrderStatus.NEW,
        ).select_related('product')


# class OrderLineDetail(RetrieveAPIView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = OrderLineSerializer
#     lookup_field = 'product'

#     def get_queryset(self):
#         user = self.request.user
#         return OrderLine.objects.filter(
#             order__user=user,
#             order__status=OrderStatus.NEW,
#         ).select_related('product')

def is_product_in_cart(func):
    """
    Decorator to check if product exists in cart.
    """
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        product = self.get_object()
        queryset = OrderLine.objects.filter(
            order__user=request.user,
            order__status=OrderStatus.NEW,
            product=product
        )

        if not queryset.exists():
            content = {'error': 'This item is not in your cart.'}
            return Response(content, status=status.HTTP_403_FORBIDDEN)

        kwargs['orderline'] = queryset[0]
        return func(self, request, *args, **kwargs)

    return wrapper


class ProductViewSet(viewsets.ModelViewSet):
    """
    Viewset for retrieving and manupulation products.
    Contain custom action to add products to user's cart and
    remove from cart.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions
        that this view requires.
        """
        if self.action in ('list', 'retrieve', 'in_stock'):
            permission_classes = [AllowAny]
        elif self.action in ('create', 'update', 'partial_update', 'destroy'):
            permission_classes = [IsSuperUser]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    @action(detail=False, url_path='in-stock', url_name='list-in-stock')
    def in_stock(self, request, *args, **kwargs):
        """
        Display list of products in stock.
        """
        queryset = self.get_queryset()
        in_stock_queryset = queryset.filter(in_stock=True)
        serializer = self.get_serializer(in_stock_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='add-to-cart')
    def add_to_cart(self, request, *args, **kwargs):
        """
        Add product to cart or icrease quantity if it's already in cart.
        """
        product = self.get_object()
        order, created = Order.objects.get_or_create(
            user=request.user,
            status=OrderStatus.NEW,
        )
        orderline, created = OrderLine.objects.get_or_create(
            order=order, product=product)
        serializer = OrderLineSerializer(orderline)

        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        orderline.quantity += 1
        orderline.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='remove-single-from-cart')
    @is_product_in_cart
    def remove_single_from_cart(self, request, *args, **kwargs):
        """
        Remove one instance of product out of cart.
        """
        orderline = kwargs.get('orderline')
        if orderline.quantity > 1:
            orderline.quantity -= 1
            orderline.save()

        serializer = OrderLineSerializer(orderline)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='remove-from-cart')
    @is_product_in_cart
    def remove_from_cart(self, request, *args, **kwargs):
        """
        Remove product out of cart.
        """
        orderline = kwargs.get('orderline')
        orderline.delete()
        return Response(status=status.HTTP_200_OK)


class PickupOrderCreate(views.APIView):
    pass
    # queryset = User.objects.all()

    # permission_classes = (IsAuthenticated,)

    # def post(self, request, format=None):
    #     serializer = PickupOrderSerializer(
    #         data=request.data,
    #         context={'user': request.user}
    #     )

    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()

    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
