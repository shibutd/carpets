from django.db import models
from django.contrib.auth import get_user_model
from polymorphic.models import PolymorphicModel


class OrderStatus(models.IntegerChoices):
    NEW = 1
    PAID = 2
    COMPLETED = 3


class Order(PolymorphicModel):
    """
    Order model class.
    """
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    status = models.IntegerField(
        choices=OrderStatus.choices,
        default=OrderStatus.NEW,
    )
    date_updated = models.DateTimeField(auto_now=True)
    date_added = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата размещения заказа',
    )

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return '%s - %s' % (
            self.user.email,
            self.date_updated.strftime("%Y-%m-%d - %H:%M:%S")
        )


class PickupOrder(Order):
    """
    Model for orders that users will pick up by themselves.
    """
    pickup_address = models.ForeignKey(
        'store.PickupAddress',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = 'Самовывоз'
        verbose_name_plural = 'Заказы самовывоза'


class DeliveryOrder(Order):
    """
    Model for orders that will be delivered to user home.
    """
    delivery_address = models.ForeignKey(
        'authentication.UserAddress',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = 'Доставка'
        verbose_name_plural = 'Заказы на доставку'


class OrderLine(models.Model):
    """
    Order model class.
    """
    order = models.ForeignKey(
        'Order',
        related_name="lines",
        on_delete=models.CASCADE,
    )
    variation = models.ForeignKey(
        'store.ProductVariation',
        on_delete=models.CASCADE,
    )
    quantity = models.PositiveIntegerField(default=1)
