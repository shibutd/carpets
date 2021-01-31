import random

import factory
import factory.fuzzy

from authentication.factories import UserFactory
from store.models import (
    Product,
    ProductCategory,
    ProductVariation,
    VariationSize,
    Order,
    OrderLine,
)


class ProductCategoryFactory(factory.django.DjangoModelFactory):
    """
    Factory for category model class.
    """

    class Meta:
        model = ProductCategory

    name = factory.Sequence(lambda n: 'Category {}'.format(n))
    slug = factory.Sequence(lambda n: 'category-{}'.format(n))


class ProductFactory(factory.django.DjangoModelFactory):
    """
    Factory for product model class.
    """

    class Meta:
        model = Product

    name = factory.Sequence(lambda n: 'Product {}'.format(n))
    slug = factory.Sequence(lambda n: 'product-{}'.format(n))
    category = factory.SubFactory(ProductCategoryFactory)


class VariationSizeFactory(factory.django.DjangoModelFactory):
    """
    Factory for variation's size model class.
    """

    class Meta:
        model = VariationSize

    @factory.lazy_attribute
    def value(self):
        sizes = []

        for _ in range(2):
            number = str(random.randrange(10, 99))
            sizes.append('{0},{1}0'.format(number[:1], number[1:]))

        width, length = sizes
        return '{}x{}'.format(width, length)


class ProductVariationFactory(factory.django.DjangoModelFactory):
    """
    Factory for product's variation model class.
    """

    class Meta:
        model = ProductVariation

    product = factory.SubFactory(ProductFactory)
    size = factory.SubFactory(VariationSizeFactory)
    price = factory.fuzzy.FuzzyDecimal(10.0, 100.0, 2)


class OrderFactory(factory.django.DjangoModelFactory):
    """
    Factory for user's order model class.
    """

    class Meta:
        model = Order

    user = factory.SubFactory(UserFactory)


class OrderLineFactory(factory.django.DjangoModelFactory):
    """
    Factory for user's orderline model class.
    """

    class Meta:
        model = OrderLine

    order = factory.SubFactory(OrderFactory)
    variation = factory.SubFactory(ProductVariation)
