from functools import wraps

from django.db.models import Prefetch

from rest_framework import status
from rest_framework import generics
from rest_framework import mixins
from rest_framework import views
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

# from store.permissions import IsSuperUser
from store.pagination import PageSizePagination
from store.serializers import (
    ProductSerializer,
    ProductCategorySerializer,
    ProductVariationSerializer,
    ProductWithVariationsSerializer,
    PickupOrderSerializer,
    OrderLineSerializer,
    PickupAddressSerializer,
    VariationQuantity,
)
from store.models import (
    Product,
    ProductCategory,
    ProductVariation,
    Order,
    OrderLine,
    OrderStatus,
    PickupAddress,
)


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
        ).select_related(
            'variation__size',
            'variation__product'
        )


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Display list of categories.
    """
    queryset = ProductCategory.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = ProductCategorySerializer
    lookup_field = 'slug'


class PickupAddressList(generics.ListAPIView):
    """
    Display list of pickup addresses.
    """
    queryset = PickupAddress.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = PickupAddressSerializer


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


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for retrieving and manupulation products.
    """
    queryset = Product.objects.order_by('id')
    pagination_class = PageSizePagination
    lookup_field = 'slug'

    def get_serializer_class(self):
        """
        Return serializer class depending on request's action.
        """
        # if self.action in ('retrieve', 'with_variations'):
        if self.action == 'retrieve':
            serializer_class = ProductWithVariationsSerializer
        else:
            serializer_class = ProductSerializer
        return serializer_class

    def get_permissions(self):
        """
        Return the list of permissions required by this view
        depending on request's action.
        """
        # if self.action in ('list', 'retrieve', 'with_variations'):
        if self.action in ('list', 'retrieve'):
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Return queryset depending on query paramerters.
        """
        queryset = self.queryset

        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category__slug=category)

        tag = self.request.query_params.get('tag', None)
        if tag is not None:
            queryset = queryset.filter(tags__slug=tag)

        return queryset.select_related(
            'manufacturer',
            'material',
            'unit'
        ).prefetch_related(
            'images',
            'variations__size',
            Prefetch(
                'variations__quantities',
                queryset=VariationQuantity.objects.select_related('address')
            )
        )


def is_product_in_cart(func):
    """
    Decorator to check if product exists in cart.
    """
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        variation = self.get_object()
        queryset = OrderLine.objects.filter(
            order__user=request.user,
            order__status=OrderStatus.NEW,
            variation=variation
        )

        if not queryset.exists():
            content = {'error': 'This item is not in your cart.'}
            return Response(content, status=status.HTTP_403_FORBIDDEN)

        kwargs['orderline'] = queryset[0]
        return func(self, request, *args, **kwargs)

    return wrapper


class ProductVariationViewSet(mixins.RetrieveModelMixin,
                              viewsets.GenericViewSet):
    """
    Viewset for retrieving and manupulation products variations.
    Contain custom action to add products to user's cart and
    remove from cart.
    """
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @action(detail=True, methods=['post'])
    def add_to_cart(self, request, *args, **kwargs):
        """
        Add product to cart or icrease quantity if it's already in cart.
        """
        variation = self.get_object()
        order, created = Order.objects.get_or_create(
            user=request.user,
            status=OrderStatus.NEW,
        )
        orderline, created = OrderLine.objects.get_or_create(
            order=order,
            variation=variation
        )
        serializer = OrderLineSerializer(orderline)

        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        orderline.quantity += 1
        orderline.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
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

    @action(detail=True, methods=['post'])
    @is_product_in_cart
    def remove_from_cart(self, request, *args, **kwargs):
        """
        Remove product out of cart.
        """
        orderline = kwargs.get('orderline')
        orderline.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
