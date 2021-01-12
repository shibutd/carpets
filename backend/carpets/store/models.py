from django.db import models
from django.contrib.auth import get_user_model
from polymorphic.models import PolymorphicModel
from slugify import slugify


class Product(models.Model):
    """
    Product model class.
    """
    name = models.CharField(max_length=60)
    # size = models.CharField(max_length=48)
    category = models.ForeignKey(
        'ProductCategory',
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    manufacturer = models.ForeignKey(
        'ProductManufacturer',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    material = models.ForeignKey(
        'ProductMaterial',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    unit = models.ForeignKey(
        'ProductUnit',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    # price = models.DecimalField(
    #     max_digits=6,
    #     decimal_places=2,
    # )
    slug = models.SlugField(max_length=48)
    description = models.TextField(blank=True, null=True)
    in_stock = models.BooleanField(default=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'товар'
        verbose_name_plural = 'товары'

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductCategory(models.Model):
    """
    Product category model class.
    """
    name = models.CharField(max_length=60)
    slug = models.SlugField(max_length=48)
    image = models.ImageField(upload_to='category-images')

    class Meta:
        verbose_name = 'производитель'
        verbose_name_plural = 'производители'

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductSize(models.Model):
    """
    Product size model class.
    """
    value = models.CharField(max_length=48)

    def __str__(self):
        return self.value


class ProductManufacturer(models.Model):
    """
    Product manufacture model class.
    """
    name = models.CharField(max_length=60)

    class Meta:
        verbose_name = 'производитель'
        verbose_name_plural = 'производители'

    def __str__(self):
        return self.name


class ProductMaterial(models.Model):
    """
    Product material model class.
    """
    name = models.CharField(max_length=60)

    class Meta:
        verbose_name = 'материал'
        verbose_name_plural = 'материалы'

    def __str__(self):
        return self.name


class ProductUnit(models.Model):
    """
    Product material model class.
    """
    name = models.CharField(max_length=30)

    class Meta:
        verbose_name = 'единица'
        verbose_name_plural = 'единицы'

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


class ProductVariation(models.Model):
    """
    Model for product's variations.
    """
    product = models.ForeignKey(
        'Product',
        related_name='variations',
        on_delete=models.CASCADE,
    )
    size = models.ForeignKey(
        'ProductSize',
        related_name='variations',
        on_delete=models.CASCADE,
    )
    price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
    )


class ProductQuantity(models.Model):
    """
    Model for product's quantities in specific pickup address.
    """
    variation = models.ForeignKey(
        'ProductVariation',
        related_name='quantities',
        on_delete=models.CASCADE,
    )
    address = models.ForeignKey(
        'PickupAddress',
        related_name="quantities",
        on_delete=models.CASCADE,
    )
    amount = models.PositiveIntegerField(default=0)


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


class PickupOrder(Order):
    """
    Model for orders that users will pick up by themselves.
    """
    pickup_address = models.ForeignKey(
        'PickupAddress',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )


class PickupAddress(models.Model):
    """
    Model for addresses from which users will
    pick up goods by themselves.
    """
    name = models.CharField(max_length=60)

    def __str__(self):
        return self.name


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
