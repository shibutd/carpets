from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from store.factories import ProductFactory
from store.models import Order, PickupOrder, DeliveryOrder


class ProductTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.products = ProductFactory.create_batch(2)

    def test_retrieve_products_list(self):
        """
        Ensure we can retrive products list with REST API request.
        """
        url = reverse('store:product-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_retrieve_single_product(self):
        """
        Ensure we can retrive single product object
        with REST API request.
        """

        product = self.products[0]

        url = reverse(
            'store:product-detail',
            kwargs={'slug': product.slug}
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], product.name)
