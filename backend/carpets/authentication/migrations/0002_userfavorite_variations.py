# Generated by Django 3.0.12 on 2021-03-09 08:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('store', '0001_initial'),
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfavorite',
            name='variations',
            field=models.ManyToManyField(blank=True, to='store.ProductVariation'),
        ),
    ]