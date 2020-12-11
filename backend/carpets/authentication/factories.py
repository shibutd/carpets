import factory
from django.contrib.auth import get_user_model


class UserFactory(factory.django.DjangoModelFactory):
    """
    Factory for custom user model class.
    """

    class Meta:
        model = get_user_model()
        django_get_or_create = ('email',)

    email = factory.Sequence(lambda n: 'testuser{}@example.com'.format(n))
    password = factory.Sequence(lambda n: 'password{}'.format(n))

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Override the default ``_create`` with our custom call."""
        manager = cls._get_manager(model_class)
        return manager.create_user(*args, **kwargs)
