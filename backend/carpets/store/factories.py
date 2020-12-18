import factory
import factory.fuzzy

from store.models import Product


class ProductFactory(factory.django.DjangoModelFactory):
    """
    Factory for product model class.
    """

    class Meta:
        model = Product

    name = factory.Sequence(lambda n: 'Product {}'.format(n))
    slug = factory.Sequence(lambda n: 'product-{}'.format(n))
    price = factory.fuzzy.FuzzyDecimal(10.0, 100.0, 2)


