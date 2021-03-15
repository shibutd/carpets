import sys
import json
import random
from pathlib import Path
from collections import Counter
from decimal import Decimal
from functools import reduce

from django.core.files.images import ImageFile
from django.core.management.base import BaseCommand

from store.models import (
    Product,
    ProductCategory,
    ProductManufacturer,
    ProductMaterial,
    ProductUnit,
    ProductImage,
    PickupAddress,
    ProductVariation,
    VariationSize,
    VariationTag,
    VariationQuantity,
)


class Command(BaseCommand):
    """
    Implement 'import data' command for loading products to database
    from .json file.
    """
    help = 'Import products'
    tracker = Counter()
    image_basedir = ''

    def add_arguments(self, parser):
        """
        Add command's arguments.
        """
        parser.add_argument("jsonfile", type=str)
        parser.add_argument("image_basedir", type=str)

    def update_variation_quantities(
        self,
        variation,
        quantities,
    ):
        for address_name, qty in quantities.items():
            address_obj, created = PickupAddress.objects.get_or_create(
                name=address_name
            )
            quantity_qs = VariationQuantity.objects.filter(
                variation=variation,
                address=address_obj,
            )

            if quantity_qs.exists():
                quantity = quantity_qs[0]
                if quantity.amount != qty:
                    quantity.amount = qty
                    quantity.save()
            elif qty > 0:
                VariationQuantity.objects.create(
                    variation=variation,
                    address=address_obj,
                    amount=qty,
                )

    def get_imagefile_path_if_exists(self, image_filename):
        image_path = self.image_basedir / image_filename
        if image_path.is_file():
            return image_path, True
        return None, False

    def save_image(self, image_path, image_filename, model, **params):
        with open(image_path, "rb",) as f:
            image = ImageFile(f, image_filename)
            instance, created = model.objects.get_or_create(**params)
            instance.image = image
            instance.save()

    def create_tags(self, tag_name):
        tag, created = VariationTag.objects.get_or_create(name=tag_name)
        if created:
            variations = ProductVariation.objects.all()
            variations_count = variations.count()
            for idx in random.sample(range(variations_count), k=5):
                variations[idx].tags.add(tag)

    def get_dummy_phone_number(self):
        return '+791{}'.format(
            reduce(
                lambda x, y: x + str(random.randrange(0, 9)),
                range(8),
                '',
            )
        )

    def create_pickup_addresses(self, addresses):
        all_pickup_addresses = PickupAddress.objects.values_list(
            'name',
            flat=True,
        )
        new_addresses = addresses.difference(all_pickup_addresses)
        if len(new_addresses) != 0:
            PickupAddress.objects.bulk_create([
                PickupAddress(
                    name=address,
                    phone_number=self.get_dummy_phone_number()
                ) for address in new_addresses
            ])

    @staticmethod
    def get_image_filename(name):
        return name.replace('\"', '') + '.jpg'

    def create_category(self, name):
        category, created = ProductCategory.objects.get_or_create(name=name)
        self.tracker["categories"] += 1
        if created:
            self.tracker["categories_created"] += 1

            # Processing category image
            image_filename = self.get_image_filename(category.name)
            image_path, path_exists = self.get_imagefile_path_if_exists(
                image_filename
            )
            if path_exists:
                self.save_image(
                    image_path,
                    image_filename,
                    ProductCategory,
                    name=category.name,
                )
                self.tracker["categories_images"] += 1

        return category

    def create_product(self, name, manufacturer, material, unit, category):
        product, created = Product.objects.get_or_create(
            name=name,
            manufacturer=manufacturer,
            material=material,
            unit=unit,
            category=category,
        )
        self.tracker['products'] += 1
        if created:
            self.tracker["products_created"] += 1

            # Processing product image
            image_filename = self.get_image_filename(product.name)
            image_path, path_exists = self.get_imagefile_path_if_exists(
                image_filename
            )
            if path_exists:
                self.save_image(
                    image_path,
                    image_filename,
                    ProductImage,
                    product=product,
                )
                self.tracker["products_images"] += 1

        return product

    def create_variation(self, product, size, price, quantities):
        variation, created = ProductVariation.objects.get_or_create(
            product=product,
            size=size,
        )
        self.tracker['variations'] += 1
        if created:
            self.tracker["variations_created"] += 1
        variation.price = Decimal(price.replace(',', '.'))
        variation.save()

        # Update quantities
        self.update_variation_quantities(
            variation,
            quantities,
        )
        return variation

    def handle(self, *args, **options):
        self.stdout.write("Importing products")

        # check if images base directory exists
        self.image_basedir = Path(options.pop("image_basedir"))
        if not self.image_basedir.exists() or not self.image_basedir.is_dir():
            self.stdout.write('Image directory does not exists: {}'.format(
                self.image_basedir
            ))
            sys.exit()

        # Load data from .json file
        file = options.pop("jsonfile")
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for item in data:
            self.create_pickup_addresses(set(item['quantities'].keys()))

            # Create category
            category = self.create_category(item['category']['name'])

            # Create size
            size, created = VariationSize.objects.get_or_create(
                value=item['size'],
            )
            if created:
                self.tracker["sizes_created"] += 1

            # Create manufacturer
            manufacturer, created = ProductManufacturer.objects.get_or_create(
                name=item['manufacturer'],
            )
            if created:
                self.tracker["manufacturers_created"] += 1

            # Create material
            material, created = ProductMaterial.objects.get_or_create(
                name=item['material'],
            )
            if created:
                self.tracker["materials_created"] += 1

            # Create unit
            unit, created = ProductUnit.objects.get_or_create(
                name=item['unit'],
            )
            if created:
                self.tracker["units_created"] += 1

            # Create product
            product = self.create_product(
                name=item["name"],
                manufacturer=manufacturer,
                material=material,
                unit=unit,
                category=category,
            )

            # Create product variation
            self.create_variation(
                product,
                size,
                price=item['price'],
                quantities=item['quantities'],
            )

        self.create_tags('Хиты')
        self.create_tags('Новинки')

        # Display info about processed products
        self.stdout.write("Products processed={0} (created={1})".format(
            self.tracker["products"], self.tracker["products_created"]
        ))
        self.stdout.write("Categories processed={0} (created={1})".format(
            self.tracker["categories"], self.tracker["categories_created"]
        ))
        self.stdout.write("Variations processed={0} (created={1})".format(
            self.tracker["variations"], self.tracker["variations_created"]
        ))
        self.stdout.write("Product images processed={}".format(
            self.tracker["products_images"]
        ))
        self.stdout.write("Category images processed={}".format(
            self.tracker["categories_images"]
        ))
        self.stdout.write("Sizes created={}".format(
            self.tracker["sizes_created"]
        ))
        self.stdout.write("Manufacturers created={}".format(
            self.tracker["manufacturers_created"]
        ))
        self.stdout.write("Materials created={}".format(
            self.tracker["materials_created"]
        ))
        self.stdout.write("Units created={}".format(
            self.tracker["units_created"]
        ))
