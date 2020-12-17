from io import BytesIO

from PIL import Image
from django.core.files.base import ContentFile
from django.db.models.signals import pre_save
from django.dispatch import receiver

from store import models


THUMBNAIL_SIZE = (300, 300)


@receiver(pre_save, sender=models.ProductImage)
def generate_thumbnail(sender, instance, **kwargs):
    """
    Generate thumbnail before saving ProductImage.
    """
    image = Image.open(instance.image)
    image = image.convert('RGB')
    image.thumbnail(THUMBNAIL_SIZE, Image.ANTIALIAS)

    temp_thumb = BytesIO()
    image.save(temp_thumb, 'JPEG')
    temp_thumb.seek(0)

    instance.thumbnail.save(
        instance.image.name,
        ContentFile(temp_thumb.read()),
        save=False,
    )
    temp_thumb.close()
