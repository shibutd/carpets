import sys, os
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

    def add_arguments(self, parser):
        """
        Add command's arguments.
        """
        parser.add_argument("jsonfile", type=str)
        parser.add_argument("image_basedir", type=str)

    def update_quantities(
        self,
        variation,
        true_quantities,
        all_pickup_addresses_queryset
    ):
        # Get initial quntities of product
        variation_quantities = VariationQuantity.objects.filter(
            variation=variation
        )
        for address, qty in true_quantities.items():
            address_obj = all_pickup_addresses_queryset.get(
                name=address
            )
            single_adress_quantity_queryset = variation_quantities.filter(
                address=address_obj
            )
            if single_adress_quantity_queryset.exists():
                single_adress_quantity = single_adress_quantity_queryset[0]
                if single_adress_quantity.amount != qty:
                    single_adress_quantity.amout = qty
                    single_adress_quantity.save()

            elif qty > 0:
                VariationQuantity.objects.create(
                    variation=variation,
                    address=address_obj,
                    amount=qty,
                )

    def get_imagefile_path_if_exists(self, image_filename, image_basedir):
        image_path = image_basedir / image_filename
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

    def handle(self, *args, **options):
        self.stdout.write("Importing products")
        c = Counter()

        # check if images base directory exists
        image_basedir = Path(options.pop("image_basedir"))
        if not image_basedir.exists() or not image_basedir.is_dir():
            self.stdout.write(
                'Image directory does not exists: {}'.format(image_basedir)
            )
            sys.exit()

        # Load data from .json file
        file = options.pop("jsonfile")
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        all_pickup_addresses_queryset = PickupAddress.objects.all()
        prickup_addresses_created = True \
            if all_pickup_addresses_queryset.count() > 0 else False

        for item in data:
            # TEMPORARILY FOR CREATING PICKUP ADDRESSES
            if not prickup_addresses_created:
                for address in item['quantities'].keys():
                    PickupAddress.objects.create(
                        name=address,
                        phone_number='+7912{}'.format(
                            reduce(
                                (lambda x, y: x + str(random.randrange(0, 9))),
                                range(7),
                                '',
                            )
                        )
                    )
                prickup_addresses_created = True
            # TEMPORARILY FOR CREATING PICKUP ADDRESSES

            # Create category
            category, created = ProductCategory.objects.get_or_create(
                name=item['category']['name'],
            )
            c["categories"] += 1
            if created:
                c["categories_created"] += 1
                # processing category image
                image_filename = category.name.replace('\"', '') + '.jpg'
                image_path, path_exists = self.get_imagefile_path_if_exists(
                    image_filename, image_basedir
                )
                if path_exists:
                    self.save_image(
                        image_path,
                        image_filename,
                        ProductCategory,
                        name=category.name,
                    )

            # Create size
            size, created = VariationSize.objects.get_or_create(
                value=item['size'],
            )
            if created:
                c["sizes_created"] += 1

            # Create manufacturer
            manufacturer, created = ProductManufacturer.objects.get_or_create(
                name=item['manufacturer'],
            )
            if created:
                c["manufacturers_created"] += 1

            # Create material
            material, created = ProductMaterial.objects.get_or_create(
                name=item['material'],
            )
            if created:
                c["materials_created"] += 1

            # Create unit
            unit, created = ProductUnit.objects.get_or_create(
                name=item['unit'],
            )
            if created:
                c["units_created"] += 1

            # Create product
            product, created = Product.objects.get_or_create(
                name=item["name"],
                manufacturer=manufacturer,
                material=material,
                unit=unit,
                category=category,
            )
            c['products'] += 1
            if created:
                c["products_created"] += 1

            # Processing product image
            image_filename = product.name.replace('\"', '') + '.jpg'
            image_path, path_exists = self.get_imagefile_path_if_exists(
                image_filename, image_basedir
            )
            if path_exists:
                self.save_image(
                    image_path,
                    image_filename,
                    ProductImage,
                    product=product,
                )
                c["products_images"] += 1

            # Create product variation
            variation, created = ProductVariation.objects.get_or_create(
                product=product,
                size=size,
            )
            c['variations'] += 1
            if created:
                c["variations_created"] += 1
            variation.price = Decimal(item['price'].replace(',', '.'))
            variation.save()

            # Update quantities
            self.update_quantities(
                variation,
                item['quantities'],
                all_pickup_addresses_queryset,
            )

        self.create_tags('Хиты')
        self.create_tags('Новинки')

        # Display info about processed products
        self.stdout.write(
            "Products processed={0} (created={1})".format(
                c["products"], c["products_created"])
        )
        self.stdout.write(
            "Categories processed={0} (created={1})".format(
                c["categories"], c["categories_created"])
        )
        self.stdout.write(
            "Variations processed={0} (created={1})".format(
                c["variations"], c["variations_created"])
        )

        self.stdout.write(
            "Product images processed={}".format(c["products_images"]))

        self.stdout.write(
            "Category images processed={}".format(c["categories_images"]))

        self.stdout.write(
            "Sizes created={}".format(c["sizes_created"]))

        self.stdout.write(
            "Manufacturers created={}".format(c["manufacturers_created"]))

        self.stdout.write(
            "Materials created={}".format(c["materials_created"]))

        self.stdout.write(
            "Units created={}".format(c["units_created"]))
