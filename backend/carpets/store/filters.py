from django.apps import apps
from django.contrib import admin
from django.utils.translation import gettext as _
from django.db.models import Q
from django.db.models.functions import Greatest
from django.contrib.postgres.search import (
    SearchVector,
    SearchQuery,
    SearchRank,
    TrigramSimilarity,
)
from django_filters import rest_framework as filters

from store.models import (
    OrderStatus,
    Product,
    ProductCategory,
    ProductManufacturer,
    ProductMaterial,
    ProductVariation,
    VariationSize,
    VariationTag,
)


# VIEW FILTERS

class ProductFilter(filters.FilterSet):
    """
    Сlass from filtering and searching products.
    """
    category = filters.ModelMultipleChoiceFilter(
        queryset=ProductCategory.objects.all(),
        field_name='category__slug',
        to_field_name='slug',
    )
    manufacturer = filters.ModelMultipleChoiceFilter(
        queryset=ProductManufacturer.objects.all(),
        field_name='manufacturer__name',
        to_field_name='name',
    )
    material = filters.ModelMultipleChoiceFilter(
        queryset=ProductMaterial.objects.all(),
        field_name='material__name',
        to_field_name='name',
    )
    size = filters.ModelMultipleChoiceFilter(
        queryset=VariationSize.objects.all(),
        field_name='variations__size__value',
        to_field_name='value',
    )
    width = filters.CharFilter(method='filter_size')
    length = filters.CharFilter(method='filter_size')
    search = filters.CharFilter(method='filter_search')

    class Meta:
        model = Product
        fields = (
            'category',
            'manufacturer',
            'material',
            'size',
            'width',
            'length',
            'search',
        )

    def filter_size(self, queryset, name, value):
        """
        Allow filter product sizes string with range:
        'width', 'length'.
        """
        category = self.request.query_params.get('category')
        if category is None:
            return queryset

        sizes = list(
            VariationSize.objects.filter(
                variations__product__category__slug=category
            ).values_list(
                'value',
                flat=True,
            ).distinct()
        )
        minimum, maximum = value.split('%')
        index = 0 if name == 'width' else 1
        sizes = filter(
            lambda x: minimum <= x.split('*')[index] <= maximum,
            sizes,
        )
        sizes = set(sizes)

        queryset = queryset.filter(variations__size__value__in=sizes)
        return queryset

    def filter_search(self, queryset, name, value):
        """
        Search products on fields: name, description,
        manufacturer__name, material__name.
        Search is usuing PostgreSQL's full-text search engine.
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


class ProductVariationFilter(filters.FilterSet):
    tag = filters.ModelMultipleChoiceFilter(
        queryset=VariationTag.objects.all(),
        field_name='tags__slug',
        to_field_name='slug',
    )

    class Meta:
        model = ProductVariation
        fields = ('tag',)


# ADMIN FILTERS

class PolymorphicModelFilter(admin.SimpleListFilter):
    title = _('Type')

    parameter_name = 'polymorphic_ctype'

    def lookups(self, request, model_admin):
        return (
            (None, _('Все')),
            ('pickuporder', _('Самовывоз')),
            ('deliveryorder', _('Доставка')),
        )

    def choices(self, cl):
        for lookup, title in self.lookup_choices:
            yield {
                'selected': self.value() == lookup,
                'query_string': cl.get_query_string({
                    self.parameter_name: lookup,
                }, []),
                'display': title,
            }

    def queryset(self, request, queryset):
        if self.value() is not None:
            model = apps.get_model('store', self.value())
            return queryset.filter(Q(instance_of=model))
        return queryset


class StatusFilter(admin.SimpleListFilter):
    title = _('Status')

    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return (
            (None, _('Все')),
            (str(OrderStatus.PAID), _('Оплачен')),
            (str(OrderStatus.COMPLETED), _('Завершен')),
        )

    def choices(self, cl):
        for lookup, title in self.lookup_choices:
            yield {
                'selected': self.value() == lookup,
                'query_string': cl.get_query_string({
                    self.parameter_name: lookup,
                }, []),
                'display': title,
            }

    def queryset(self, request, queryset):
        if self.value() in map(str, (OrderStatus.PAID, OrderStatus.COMPLETED)):
            return queryset.filter(status=self.value())
        return queryset.filter(~Q(status=OrderStatus.NEW))
