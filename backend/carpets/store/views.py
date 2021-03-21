from functools import wraps

from django.db.models import Prefetch
from rest_framework import status, generics, viewsets, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from store.pagination import PageSizePagination
from store.filters import ProductFilter, ProductVariationFilter
from store.serializers import (
    ProductSerializer,
    ProductCategorySerializer,
    ProductCategoryWithPropertiesSerializer,
    ProductVariationSerializer,
    ProductWithVariationsSerializer,
    OrderLineSerializer,
    PickupAddressSerializer,
    PromotionSerializer,
    OrderPolymorphicSerializer,
)
from authentication.models import UserFavorite
from store.models import (
    Product,
    ProductCategory,
    ProductVariation,
    VariationQuantity,
    PickupAddress,
    Promotion,
)
from orders.models import (
    Order,
    OrderLine,
    OrderStatus,
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


class ProductVariationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for retrieving and manupulation products variations.
    Contain custom action to add products to user's cart and
    remove from cart.
    """
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer
    filterset_class = ProductVariationFilter
    lookup_field = 'id'

    def get_permissions(self):
        """
        Return the list of permissions required by this view
        depending on request's action.
        """
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Return queryset prefetching required fields.
        """
        queryset = self.queryset

        queryset = queryset.select_related(
            'size'
        ).prefetch_related(
            'product__images'
        )
        return queryset

    def get_serializer(self, *args, **kwargs):
        """
        Eclude fields from serializer depending on action type.
        """
        if self.action == 'list':
            kwargs['exclude_fields'] = ('quantities',)

        return super().get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        """
        Ensure request contain tag filter query parameters.
        """
        tag = self.request.query_params.get('tag')

        if tag is None:
            return Response(
                {'tag': 'Required field not found.'},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def add_to_cart(self, request, *args, **kwargs):
        """
        Add product's variation to cart
        or icrease quantity if it's already in cart.
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
        Remove one instance of product's variation out of cart.
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
        Remove product's variation out of cart.
        """
        orderline = kwargs.get('orderline')
        orderline.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False)
    def favorites(self, request, *args, **kwargs):
        """
        Display list of user's favories variations.
        """
        user = request.user
        if not hasattr(user, 'userfavorite'):
            return Response(status=status.HTTP_404_NOT_FOUND)

        favorite = user.userfavorite
        serializer_class = self.get_serializer_class()

        serializer = serializer_class(
            favorite.variations.select_related(
                'size', 'product',
            ).prefetch_related(
                Prefetch('product__images'),
                Prefetch('quantities__address'),
            ),
            many=True,
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def add_to_favorites(self, request, *args, **kwargs):
        """
        Add product's variation user's list of favories.
        """
        variation = self.get_object()
        favorite, created = UserFavorite.objects.get_or_create(
            user=request.user
        )
        if not created:
            if favorite.variations.count() >= 5:
                return Response(
                    {'error': 'В избранное можно добавить не больше 5 товаров.'},
                    status=status.HTTP_403_FORBIDDEN,
                )

            variations = favorite.variations.filter(id=variation.id)
            if variations.exists():
                return Response(
                    {'error': 'Этот товар уже у Вас в избранном.'},
                    status=status.HTTP_403_FORBIDDEN,
                )

        favorite.variations.add(variation)
        favorite.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def remove_from_favorites(self, request, *args, **kwargs):
        """
        Remove product's variation out of favorites.
        """
        user = request.user
        if not hasattr(user, 'userfavorite'):
            return Response(status=status.HTTP_404_NOT_FOUND)

        favorite = user.userfavorite
        variation = self.get_object()

        variations = favorite.variations.filter(id=variation.id)
        if not variations.exists():
            return Response(
                {'error': 'Этого товара нет у Вас в избранном.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        favorite.variations.remove(variation)
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderLineViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Display list of order lines and update new order with products
    existing in cart.
    """
    queryset = OrderLine.objects.all()
    serializer_class = OrderLineSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset

        return queryset.filter(
            order__user=user,
            order__status=OrderStatus.NEW,
        ).select_related(
            'variation__size',
            'variation__product'
        )

    @action(detail=False, methods=['post'])
    def update_orderlines(self, request, *args, **kwargs):
        """
        Update user's orderlines with new variations.
        """
        orderlines = self.get_queryset()
        orderlines_variation_ids = set(
            map(str, orderlines.values_list(
                'variation__id',
                flat=True,
            ))
        )
        order, created = Order.objects.get_or_create(
            user=request.user,
            status=OrderStatus.NEW,
        )

        serializer_class = self.get_serializer_class()
        serializer = serializer_class(
            data=request.data,
            many=True,
            context={'ids': orderlines_variation_ids, 'order': order}
        )

        serializer.is_valid()
        created_orderlines = serializer.save()

        created_orderlines_serialized = serializer_class(
            created_orderlines, many=True).data

        return Response(
            created_orderlines_serialized,
            status=status.HTTP_201_CREATED
        )


class OrderCreateView(generics.CreateAPIView):
    """
    Create Paid order (pickup or delivery depending
    on sent param 'ordertype').
    """
    queryset = Order.objects.all()
    serializer_class = OrderPolymorphicSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        order, created = Order.objects.get_or_create(
            user=self.request.user,
            status=OrderStatus.NEW,
        )
        created_order = serializer.save(
            user=self.request.user,
            status=OrderStatus.PAID,
        )

        orderlines = []
        for orderline in order.lines.all():
            orderlines.append(
                OrderLine(
                    order=created_order,
                    variation=orderline.variation,
                    quantity=orderline.quantity
                )
            )
            # orderline.order = created_order
        OrderLine.objects.bulk_create(orderlines)

        # created_order.save()
        order.delete()


class PromotionList(generics.ListAPIView):
    """
    Display list of promotions.
    """
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = (AllowAny,)
