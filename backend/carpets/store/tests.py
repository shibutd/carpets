from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from store.factories import ProductFactory


class ProductTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.products = ProductFactory.create_batch(2)

    def test_retrieve_product_list_in_stock(self):
        url = reverse('store:product-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        self.products[0].in_stock = False
        self.products[0].save()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_single_product(self):
        product = self.products[0]

        url = reverse(
            'store:product-detail',
            kwargs={'slug': product.slug}
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], product.name)
