from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.factories import UserFactory, UserAddressFactory
from store.factories import (
    ProductFactory,
    ProductVariationFactory,
    OrderFactory,
    OrderLineFactory,
    PickupAddressFactory,
)
from store.models import Order, PickupOrder, DeliveryOrder, OrderStatus


class ProductTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.products = ProductFactory.create_batch(2)

    def test_retrieve_products_list(self):
        """
        Ensure we can retrive products list.
        """
        url = reverse('store:product-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_retrieve_single_product(self):
        """
        Ensure we can retrive single product object.
        """
        product = self.products[0]

        url = reverse(
            'store:product-detail',
            kwargs={'slug': product.slug}
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], product.name)


class OrderLineTest(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.users = UserFactory.create_batch(2)
        user1, user2 = cls.users

        cls.variations = ProductVariationFactory.create_batch(3)

        order1 = OrderFactory.create(user=user1)
        order2 = OrderFactory.create(user=user2)

        OrderLineFactory.create(
            order=order1,
            variation=cls.variations[0]
        )

        for variation in (cls.variations[0], cls.variations[1]):
            OrderLineFactory.create(
                order=order2,
                variation=variation
            )

    def test_list_orderlines(self):
        """
        Ensure user can retrieve only his orderlines from
        order with status "NEW".
        """
        url = reverse('store:orderline-list')
        user1, user2 = self.users

        self.client.force_authenticate(user1)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        self.client.force_authenticate(user2)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_update_orderlines_with_valid_data(self):
        """
        Ensure orderlines updates correctly with given valid data.
        """
        url = reverse('store:orderline-update-orderlines')
        user1, user2 = self.users
        self.client.force_authenticate(user1)

        data = []
        for variation in self.variations:
            data.append(
                {
                    'variation': {
                        'id': variation.id,
                        'size': variation.size.value,
                        'price': variation.price,
                        'product': {
                            'name': variation.product.name,
                            'slug': variation.product.slug,
                        },
                    },
                    'quantity': 2,
                }
            )

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        url = reverse('store:orderline-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(
            response.data[0]['variation']['id'],
            str(self.variations[0].id)
        )
        self.assertEqual(
            response.data[1]['variation']['id'],
            str(self.variations[1].id)
        )
        self.assertEqual(
            response.data[2]['variation']['id'],
            str(self.variations[2].id)
        )
        self.assertEqual(response.data[0]['quantity'], 1)
        self.assertEqual(response.data[1]['quantity'], 2)
        self.assertEqual(response.data[2]['quantity'], 2)

    def test_update_orderlines_with_invalid_data(self):
        """
        Ensure orderlines updates correctly with given invalid data.
        """
        url = reverse('store:orderline-update-orderlines')
        user1 = self.users[0]
        self.client.force_authenticate(user1)

        variation = self.variations[1]

        data = [
            {
                'variation': {
                    'id': variation.id,
                },
            },
            {
                'variation': {
                    'id': '512151',
                    'size': variation.size.value,
                    'price': variation.price,
                    'product': {
                        'name': variation.product.name,
                        'slug': variation.product.slug,
                    },
                },
                'quantity': 1,
            }
        ]
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        url = reverse('store:orderline-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class ProductVaritaionTests(APITestCase):

    def test_add_to_cart(self):
        pass

    def test_remove_single_from_cart(self):
        pass

    def test_remove_from_cart(self):
        pass

    def test_favorites(self):
        pass

    def test_add_to_favorites(self):
        pass

    def test_remove_from_favorites(self):
        pass


class OrderCreateTests(APITestCase):

    def setUp(self):
        self.user = UserFactory.create()
        OrderFactory.create(user=self.user)

    def test_user_can_create_pickup_order(self):
        """
        Ensure user can create pickup order.
        """
        url = reverse('store:order-list')

        self.client.force_authenticate(self.user)
        pickup_address = PickupAddressFactory.create()

        response = self.client.post(
            url,
            {
                'ordertype': 'PickupOrder',
                'pickup_address': pickup_address.id,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'Paid')
        self.assertEqual(
            response.data['pickup_address'],
            pickup_address.id
        )
        self.assertEqual(
            Order.objects.filter(
                user=self.user,
                status=OrderStatus.NEW
            ).count(),
            0,
        )
        self.assertEqual(
            Order.objects.filter(
                user=self.user,
                status=OrderStatus.PAID
            ).instance_of(PickupOrder).count(),
            1,
        )

    def test_user_can_create_delivery_order(self):
        """
        Ensure user can create delivery order.
        """
        url = reverse('store:order-list')

        self.client.force_authenticate(self.user)
        delivery_address = UserAddressFactory.create(user=self.user)

        response = self.client.post(
            url,
            {
                'ordertype': 'DeliveryOrder',
                'delivery_address': delivery_address.id,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'Paid')
        self.assertEqual(
            response.data['delivery_address'],
            delivery_address.id
        )
        self.assertEqual(
            Order.objects.filter(
                user=self.user,
                status=OrderStatus.NEW
            ).count(),
            0,
        )
        self.assertEqual(
            Order.objects.filter(
                user=self.user,
                status=OrderStatus.PAID
            ).instance_of(DeliveryOrder).count(),
            1,
        )

    def tearDown(self):
        self.user.delete()
