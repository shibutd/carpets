from functools import wraps

from django.db.models import Prefetch
from django.db.models.functions import Greatest
from django.contrib.postgres.search import (
    SearchVector,
    SearchQuery,
    SearchRank,
    TrigramSimilarity,
)
from rest_framework import status
from rest_framework import generics
from rest_framework import mixins
from rest_framework import views
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as filters

from store.pagination import PageSizePagination
from store.serializers import (
    ProductSerializer,
    ProductCategorySerializer,
    ProductVariationSerializer,
    ProductWithVariationsSerializer,
    PickupOrderSerializer,
    OrderLineSerializer,
    PickupAddressSerializer,
    PromotionSerializer,
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


class ProductFilter(filters.FilterSet):
    """
    Filter class from filtering and searching products.
    """
    category = filters.AllValuesFilter(field_name='category__slug')
    manufacturer = filters.AllValuesFilter(field_name='manufacturer__name')
    material = filters.AllValuesFilter(field_name='material__name')
    tag = filters.AllValuesFilter(field_name='tags__slug')
    search = filters.CharFilter(method='filter_search')

    class Meta:
        model = Product
        fields = (
            'category',
            'manufacturer',
            'material',
            'search',
            'tag',
        )

    def filter_search(self, queryset, name, value):
        """
        Search products. Full-text search using PostgreSQL's
        full text search engine.
        """
        search_vector = (SearchVector('name', 'description')
            + SearchVector('manufacturer__name')
            + SearchVector('material__name'))
        search_query = SearchQuery(value)

        results = queryset.annotate(
            search=search_vector,
            rank=SearchRank(search_vector, search_query),
        ).filter(search=search_query).order_by('-rank')
        # If search return no results, use trigram similarity
        if results.count() == 0:
            search_similarity = Greatest(
                TrigramSimilarity('name', value),
                TrigramSimilarity('description', value),
                TrigramSimilarity('manufacturer__name', value),
                TrigramSimilarity('material__name', value),
            )
            results = queryset.annotate(
                similarity=search_similarity
            ).filter(similarity__gt=0.2).order_by('-similarity')

        return results


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


class PromotionListView(generics.ListAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = (AllowAny,)
