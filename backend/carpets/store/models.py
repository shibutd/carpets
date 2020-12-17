from django.db import models


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
    Manager for returning product that is in stock.
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
