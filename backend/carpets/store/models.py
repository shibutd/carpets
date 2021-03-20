import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.indexes import GinIndex
from polymorphic.models import PolymorphicModel
from slugify import slugify
from phonenumber_field.modelfields import PhoneNumberField

from store.validators import phone_regex_validator


class Product(models.Model):
    """
    Product model class.
    """
    name = models.CharField(max_length=60)
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
    slug = models.SlugField(max_length=48, unique=True)
    description = models.TextField(blank=True, null=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        indexes = [
            GinIndex(fields=('name', 'description'), name='search_idx')
        ]

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
    slug = models.SlugField(max_length=48, unique=True)
    image = models.ImageField(upload_to='category-images')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductManufacturer(models.Model):
    """
    Product manufacture model class.
    """
    name = models.CharField(max_length=60)

    class Meta:
        verbose_name = 'Производитель'
        verbose_name_plural = 'Производители'

    def __str__(self):
        return self.name


class ProductMaterial(models.Model):
    """
    Product material model class.
    """
    name = models.CharField(max_length=60)

    class Meta:
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'

    def __str__(self):
        return self.name


class ProductUnit(models.Model):
    """
    Product material model class.
    """
    name = models.CharField(max_length=30)

    class Meta:
        verbose_name = 'Единица'
        verbose_name_plural = 'Единицы'

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
    # thumbnail = models.ImageField(
    #     upload_to="product-thumbnails",
    #     null=True,
    # )

    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'


class VariationInStockManager(models.Manager):

    def in_stock(self):
        return self.filter(in_stock=True)


class ProductVariation(models.Model):
    """
    Model for product's variations.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    product = models.ForeignKey(
        'Product',
        related_name='variations',
        on_delete=models.CASCADE,
    )
    size = models.ForeignKey(
        'VariationSize',
        related_name='variations',
        on_delete=models.CASCADE,
    )
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=1000.00
    )
    tags = models.ManyToManyField('VariationTag', blank=True)
    in_stock = models.BooleanField(default=True)
    date_updated = models.DateTimeField(auto_now=True)

    objects = VariationInStockManager()

    class Meta:
        verbose_name = 'Вариация товара'
        verbose_name_plural = 'Вариации товаров'

    def __str__(self):
        return '%s - %s' % (
            self.product.name,
            self.size
        )


class VariationQuantity(models.Model):
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

    class Meta:
        verbose_name = 'Наличие в магазинах'
        verbose_name_plural = 'Наличие в магазинах'


class VariationTag(models.Model):
    name = models.CharField(max_length=20)
    slug = models.SlugField(max_length=20, unique=True)

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class VariationSize(models.Model):
    """
    Product size model class.
    """
    value = models.CharField(max_length=48)

    def __str__(self):
        return self.value


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
        'PickupAddress',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = 'Самовывоз'
        verbose_name_plural = 'Заказы самовывоза'


class PickupAddress(models.Model):
    """
    Model for addresses from which users will
    pick up goods by themselves.
    """
    name = models.CharField(max_length=60)
    phone_number = PhoneNumberField(
        null=True,
        validators=[phone_regex_validator],
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Адрес самовывоза'
        verbose_name_plural = 'Адреса самовывоза'


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
        'ProductVariation',
        on_delete=models.CASCADE,
    )
    quantity = models.PositiveIntegerField(default=1)


class Promotion(models.Model):
    """
    Order model class.
    """
    title = models.CharField(max_length=120)
    description = models.TextField()

    class Meta:
        verbose_name = 'Промо-акция'
        verbose_name_plural = 'Промо-акции'
