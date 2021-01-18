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

from store.pagination import PageSizePagination
from store.filters import ProductFilter
from store.serializers import (
    ProductSerializer,
    ProductCategorySerializer,
    ProductCategoryWithPropertiesSerializer,
    ProductVariationSerializer,
    ProductWithVariationsSerializer,
    PickupOrderSerializer,
    OrderLineSerializer,
    PickupAddressSerializer,
    PromotionSerializer,
    ProductSizeSerializer,
)
from store.models import (
    Product,
    ProductCategory,
    ProductVariation,
    VariationQuantity,
    Order,
    OrderLine,
    OrderStatus,
    PickupAddress,
    Promotion,
    ProductSize,
)


class OrderLineList(generics.ListAPIView):
    """
    Display list of order lines.
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
    Display list or instance of categories.
    """
    queryset = ProductCategory.objects.all()
    permission_classes = (AllowAny,)
    lookup_field = 'slug'

    def get_serializer_class(self):
        """
        Return serializer class depending on request's action.
        """
        if self.action == 'retrieve':
            serializer_class = ProductCategoryWithPropertiesSerializer
        else:
            serializer_class = ProductCategorySerializer
        return serializer_class


class PickupAddressList(generics.ListAPIView):
    """
    Display list of pickup addresses.
    """
    queryset = PickupAddress.objects.all()
    serializer_class = PickupAddressSerializer
    permission_classes = (AllowAny,)


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
    filterset_class = ProductFilter
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
        if self.action in ('list', 'retrieve'):
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Return queryset prefetching required fields.
        """
        queryset = self.queryset

        select_related_fields = (
            'manufacturer',
            'material',
            'unit',
        )
        prefetch_related_fields = (
            'images',
            'variations__size',
            Prefetch(
                'variations__quantities',
                queryset=VariationQuantity.objects.select_related('address')
            )
        )

        return queryset.select_related(
            *select_related_fields
        ).prefetch_related(
            *prefetch_related_fields
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


class PromotionList(generics.ListAPIView):
    """
    Display list of promotions.
    """
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = (AllowAny,)


class ProductSizeList(generics.ListAPIView):
    """
    Display list of product variations' sizes.
    """
    queryset = ProductSize.objects.all()
    serializer_class = ProductSizeSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        queryset = self.queryset

        category = self.request.query_params.get('category')

        if category is not None:
            queryset = queryset.filter(
                variations__product__category__slug=category
            ).prefetch_related(
                'variations__product__category'
            ).distinct()

        return queryset

    def list(self, request, *args, **kwargs):
        category = self.request.query_params.get('category')

        if category is None:
            return Response(
                {'category': 'Required field not found.'},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().list(request, *args, **kwargs)
