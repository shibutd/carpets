from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.factories import AddressFactory
from store.factories import ProductFactory
from store.models import Order, PickupOrder, DeliveryOrder


class ProductTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.products = ProductFactory.create_batch(2)

    def test_retrieve_product_list_in_stock(self):
        """
        Ensure we can retrive products list with REST API request.
        """
        url = reverse('store:product-list-in-stock')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        self.products[0].in_stock = False
        self.products[0].save()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

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


class OrderTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.addresses = AddressFactory.create_batch(2)

    def test_retrieve_polymorphic_orders(self):
        """
        Ensure polymorphic orders models work as expected.
        """
        pickup_order = PickupOrder.objects.create(
            user=self.addresses[0].user,
            pickup_address=2,
        )

        for address in self.addresses:
            DeliveryOrder.objects.create(
                user=address.user,
                delivery_address=address,
            )

        self.assertEqual(Order.objects.count(), 3)
        self.assertEqual(
            Order.objects.instance_of(PickupOrder)[0],
            pickup_order
        )
        self.assertEqual(
            Order.objects.instance_of(DeliveryOrder).count(),
            2
        )
