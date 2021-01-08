from django.db import models
from django.contrib.auth import get_user_model
from polymorphic.models import PolymorphicModel

from authentication.models import Address


class Manufacturer(models.IntegerChoices):
    UNKNOWN = 1
    RUSSIA = 2
    TURKEY = 3


class Material(models.IntegerChoices):
    UNKNOWN = 1
    VISCOSE = 2
    WOOL = 3


class InStockManager(models.Manager):
    """
    Manager for retrieving products that is in stock.
    """

    def in_stock(self):
        return self.filter(in_stock=True)


class Product(models.Model):
    """
    Product model class.
    """
    name = models.CharField(max_length=60)
    size = models.CharField(max_length=48)
    manufacturer = models.IntegerField(
        choices=Manufacturer.choices,
        default=Manufacturer.UNKNOWN,
    )
    material = models.IntegerField(
        choices=Material.choices,
        default=Material.UNKNOWN,
    )
    price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
    )
    slug = models.SlugField()
    in_stock = models.BooleanField(default=True)
    date_updated = models.DateTimeField(auto_now=True)

    objects = InStockManager()

    class Meta:
        verbose_name = 'товар'
        verbose_name_plural = 'товары'

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """
    Product image model class.
    """
    product = models.ForeignKey(
        'Product',
        related_name='images',
        on_delete=models.CASCADE,
    )
    image = models.ImageField(upload_to='product-images')
    thumbnail = models.ImageField(
        upload_to="product-thumbnails",
        null=True,
    )

    class Meta:
        verbose_name = 'изображение товара'
        verbose_name_plural = 'изображения товаров'


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
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'заказ'
        verbose_name_plural = 'заказы'

    def __str__(self):
        return '%s - %s' % (
            self.user.email,
            self.date_updated.strftime("%Y-%m-%d - %H:%M:%S")
        )


class PickupAddress:
    """
    Default pickup addresses.
    """
    SKL = 0
    ART = 1
    KAM = 2
    choices = (
        (SKL, 'Основной склад'),
        (ART, 'Артемовский МАГАЗИН'),
        (KAM, 'Камышлов, ул. Куйбышева, 2'),
    )


class PickupOrder(Order):
    """
    Model for orders that users will pick up by themselves.
    """
    pickup_address = models.IntegerField(
        choices=PickupAddress.choices,
        default=PickupAddress.SKL,
    )


class DeliveryOrder(Order):
    """
    Model for orders that will be delivered to users.
    """
    delivery_address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )


class OrderLine(models.Model):
    """
    Order model class.
    """
    order = models.ForeignKey(
        'Order',
        related_name="lines",
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE,
    )
    quantity = models.PositiveIntegerField(default=1)
