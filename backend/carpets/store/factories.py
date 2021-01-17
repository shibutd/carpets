import factory
import factory.fuzzy

from store.models import Product, ProductCategory


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
