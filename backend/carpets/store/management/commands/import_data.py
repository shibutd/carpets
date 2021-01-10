import sys
import json
from pathlib import Path
from collections import Counter

from django.core.files.images import ImageFile
from django.core.management.base import BaseCommand

from store.models import (
    Product,
    ProductCategory,
    ProductManufacturer,
    ProductMaterial,
    ProductImage,
    ProductQuantity,
    PickupAddress,
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
        product,
        true_quantities,
        all_pickup_addresses_queryset
    ):
        # Get initial quntities of product
        product_quantities = ProductQuantity.objects.filter(
            product=product
        )
        for address, qty in true_quantities.items():
            address_obj = all_pickup_addresses_queryset.get(
                name=address
            )
            single_adress_quantity_queryset = product_quantities.filter(
                address=address_obj
            )
            if single_adress_quantity_queryset.exists():
                single_adress_quantity = single_adress_quantity_queryset[0]
                if single_adress_quantity.amount != qty:
                    single_adress_quantity.amout = qty
                    single_adress_quantity.save()

            elif qty > 0:
                ProductQuantity.objects.create(
                    product=product,
                    address=address_obj,
                    amount=qty,
                )

    def get_image_path_if_exists(self, image_filename, image_basedir):
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
                    PickupAddress.objects.create(name=address)
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
                image_path, exists = self.get_image_path_if_exists(
                    image_filename, image_basedir
                )
                if exists:
                    self.save_image(
                        image_path,
                        image_filename,
                        ProductCategory,
                        name=category.name,
                    )

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

            # Create product
            product, created = Product.objects.get_or_create(
                name=item["name"],
                price=item["price"],
                size=item["size"],
                manufacturer=manufacturer,
                material=material,
                category=category,
            )
            c['products'] += 1
            if created:
                c["products_created"] += 1

            # Update quantities
            self.update_quantities(
                product,
                item['quantities'],
                all_pickup_addresses_queryset,
            )

            # Processing product image
            image_filename = product.name.replace('\"', '') + '.jpg'
            image_path, exists = self.get_image_path_if_exists(
                image_filename, image_basedir
            )
            if exists:
                self.save_image(
                    image_path,
                    image_filename,
                    ProductImage,
                    product=product,
                )
                c["products_images"] += 1

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
            "Product images processed={}".format(c["products_images"]))

        self.stdout.write(
            "Category images processed={}".format(c["categories_images"]))

        self.stdout.write(
            "Manufacturers created={}".format(c["manufacturers_created"]))

        self.stdout.write(
            "Materials created={}".format(c["materials_created"]))
