from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from authentication.factories import (
    UserFactory,
    UserAddressFactory,
    # UserFavoriteFactory
)
from store.factories import (
    ProductFactory,
    ProductVariationFactory,
    OrderFactory,
    OrderLineFactory,
    PickupAddressFactory,
)
from authentication.models import UserFavorite
from store.models import ProductVariation
from orders.models import (
    Order,
    OrderLine,
    PickupOrder,
    DeliveryOrder,
    OrderStatus,
)


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

        OrderLineFactory.create(order=order1, variation=cls.variations[0])

        for variation in (cls.variations[0], cls.variations[1]):
            OrderLineFactory.create(order=order2, variation=variation)

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
        Ensure orderlines not updates with given invalid data.
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

    @classmethod
    def setUpTestData(cls):
        cls.user = UserFactory.create()
        cls.variations = ProductVariationFactory.create_batch(2)
        cls.order = OrderFactory.create(user=cls.user)
        UserFavorite.objects.create(user=cls.user)

    @staticmethod
    def create_orderline(order, variation, quantity=1):
        return OrderLineFactory.create(
            order=order,
            variation=variation,
            quantity=quantity
        )

    @staticmethod
    def get_reversed_url(variation_id):
        return reverse(
            'store:productvariation-detail',
            kwargs={'id': variation_id}
        )

    def get_add_to_cart_url(self, variation_id):
        return '{}add_to_cart/'.format(
            self.get_reversed_url(variation_id)
        )

    def get_remove_single_from_cart_url(self, variation_id):
        return '{}remove_single_from_cart/'.format(
            self.get_reversed_url(variation_id)
        )

    def get_remove_from_cart_url(self, variation_id):
        return '{}remove_from_cart/'.format(
            self.get_reversed_url(variation_id)
        )

    def get_add_to_favorites_url(self, variation_id):
        return '{}add_to_favorites/'.format(
            self.get_reversed_url(variation_id)
        )

    def get_remove_from_favorites_url(self, variation_id):
        return '{}remove_from_favorites/'.format(
            self.get_reversed_url(variation_id)
        )

    def test_add_to_cart(self):
        """
        Ensure user can add product's variation to cart.
        """
        self.client.force_authenticate(self.user)
        variation1, variation2 = self.variations
        users_orderlines = OrderLine.objects.filter(order__user=self.user)

        self.assertEqual(users_orderlines.count(), 0)

        response = self.client.post(
            self.get_add_to_cart_url(variation1.id)
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(users_orderlines.count(), 1)

        response = self.client.post(
            self.get_add_to_cart_url(variation2.id)
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(users_orderlines.count(), 2)

        response = self.client.post(
            self.get_add_to_cart_url(variation2.id)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(users_orderlines.count(), 2)
        self.assertEqual(users_orderlines[1].quantity, 2)

    def test_remove_single_from_cart(self):
        """
        Ensure user can remove single item of product's variation from cart.
        """
        self.client.force_authenticate(self.user)
        variation1, variation2 = self.variations
        users_orderlines = OrderLine.objects.filter(order__user=self.user)
        self.create_orderline(self.order, variation1, 2)

        response = self.client.post(
            self.get_remove_single_from_cart_url(variation1.id)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(users_orderlines.count(), 1)
        self.assertEqual(users_orderlines[0].quantity, 1)

        response = self.client.post(
            self.get_remove_single_from_cart_url(variation1.id)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(users_orderlines.count(), 1)
        self.assertEqual(users_orderlines[0].quantity, 1)

        response = self.client.post(
            self.get_remove_single_from_cart_url(variation2.id)
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_from_cart(self):
        """
        Ensure user can remove product's variation from cart.
        """
        self.client.force_authenticate(self.user)
        variation = self.variations[0]
        users_orderlines = OrderLine.objects.filter(order__user=self.user)
        self.create_orderline(self.order, variation)

        response = self.client.post(
            self.get_remove_from_cart_url(variation.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(users_orderlines.count(), 0)

        response = self.client.post(
            self.get_remove_from_cart_url(variation.id)
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_favorites(self):
        """
        Ensure user can get list of his favorite product's variations.
        """
        url = reverse('store:productvariation-favorites')
        new_user = UserFactory.create()
        self.client.force_authenticate(new_user)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        UserFavorite.objects.create(user=new_user)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_to_favorites_creates_userfavorite_profile(self):
        """
        Ensure adding to user's list of favorites also creates this list
        (favorites profile) if it did not exist earlier.
        """
        new_user = UserFactory.create()
        self.client.force_authenticate(new_user)
        variation = self.variations[0]

        self.assertFalse(hasattr(new_user, 'userfavorite'))

        self.client.post(
            self.get_add_to_favorites_url(variation.id)
        )
        self.assertTrue(hasattr(new_user, 'userfavorite'))

    def test_add_to_favorites(self):
        """
        Ensure user can add product's variation to his list of favorites.
        """
        self.client.force_authenticate(self.user)
        variation1, variation2 = self.variations
        user_favorite = self.user.userfavorite

        response = self.client.post(
            self.get_add_to_favorites_url(variation1.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(user_favorite.variations.count(), 1)

        response = self.client.post(
            self.get_add_to_favorites_url(variation2.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(user_favorite.variations.count(), 2)

    def test_add_to_favorites_restrict_duplicates(self):
        """
        Ensure user can't add product's variation to his list of favorites
        if it's already in list.
        """
        self.client.force_authenticate(self.user)
        variation1, variation2 = self.variations
        user_favorite = self.user.userfavorite

        user_favorite.variations.add(variation1)
        user_favorite.save()
        self.assertEqual(user_favorite.variations.count(), 1)

        response = self.client.post(
            self.get_add_to_favorites_url(variation1.id)
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data,
            {'error': 'Этот товар уже у Вас в избранном.'}
        )
        self.assertEqual(user_favorite.variations.count(), 1)

    def test_add_to_favorites_restrict_more_than_5_items(self):
        """
        Ensure user can't add more than 5 product's variation
        to his list of favorites.
        """
        self.client.force_authenticate(self.user)
        ProductVariationFactory.create_batch(4)
        user_favorite = self.user.userfavorite

        variations = ProductVariation.objects.all()

        for idx, variation in enumerate(variations[:5]):
            response = self.client.post(
                self.get_add_to_favorites_url(variation.id)
            )
            self.assertEqual(
                response.status_code,
                status.HTTP_204_NO_CONTENT
            )
            self.assertEqual(user_favorite.variations.count(), idx + 1)

        response = self.client.post(
            self.get_add_to_favorites_url(variations[5].id)
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data,
            {'error': 'В избранное можно добавить не больше 5 товаров.'}
        )
        self.assertEqual(user_favorite.variations.count(), 5)

    def test_remove_from_favorites(self):
        """
        Ensure user can remove product's variation from his list of favorites.
        """
        self.client.force_authenticate(self.user)
        user_favorite = self.user.userfavorite
        variation = self.variations[0]

        response = self.client.post(
            self.get_remove_from_favorites_url(variation.id)
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data,
            {'error': 'Этого товара нет у Вас в избранном.'}
        )

        user_favorite.variations.add(variation)
        user_favorite.save()
        self.assertEqual(self.user.userfavorite.variations.count(), 1)

        response = self.client.post(
            self.get_remove_from_favorites_url(variation.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.user.userfavorite.variations.count(), 0)


class OrderCreateTests(APITestCase):

    def setUp(self):
        self.user = UserFactory.create()
        self.order = OrderFactory.create(user=self.user)

    def user_can_create_order(
        self,
        address,
        address_name,
        order_model,
        request_body_data,
    ):
        """
        Helper method to check creating orders.
        """
        url = reverse('store:order-list')
        self.client.force_authenticate(self.user)

        response = self.client.post(
            url,
            request_body_data,
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'Paid')
        self.assertEqual(
            response.data[address_name],
            address.id
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
            ).instance_of(order_model).count(),
            1,
        )

    def test_user_can_create_pickup_order(self):
        """
        Ensure user can create pickup order.
        """
        pickup_address = PickupAddressFactory.create()

        self.user_can_create_order(
            address=pickup_address,
            address_name='pickup_address',
            order_model=PickupOrder,
            request_body_data={
                'ordertype': 'PickupOrder',
                'pickup_address': pickup_address.id,
            }
        )

    def test_user_can_create_delivery_order(self):
        """
        Ensure user can create delivery order.
        """
        delivery_address = UserAddressFactory.create(user=self.user)

        self.user_can_create_order(
            address=delivery_address,
            address_name='delivery_address',
            order_model=DeliveryOrder,
            request_body_data={
                'ordertype': 'DeliveryOrder',
                'delivery_address': delivery_address.id,
            }
        )

    def creating_order_also_creates_orderlines(
        self,
        address,
        order_model,
        request_body_data,
    ):
        """
        Helper method to ensure orderlines correctly transfers
        from existing NEW order to created PAID one.
        """
        url = reverse('store:order-list')

        self.client.force_authenticate(self.user)

        variations = ProductVariationFactory.create_batch(2)
        for idx, variation in enumerate(variations):
            OrderLineFactory.create(
                order=self.order,
                variation=variation,
                quantity=idx + 1
            )
        orderlines = self.order.lines.all()

        response = self.client.post(
            url,
            request_body_data,
            format='json',
        )
        order = Order.objects.filter(
            user=self.user,
            status=OrderStatus.PAID,
        ).instance_of(order_model)

        self.assertEqual(order.count(), 1)
        self.assertEqual(order[0].lines.count(), 2)
        self.assertEqual(order[0].lines.all()[0].quantity, 1)
        self.assertEqual(order[0].lines.all()[1].quantity, 2)


    def test_creating_pickup_order_also_creates_orderlines(self):
        """
        Ensure user's orderlines correctly transfers
        from existing NEW order to created PAID Pickup order.
        """
        pickup_address = PickupAddressFactory.create()

        self.creating_order_also_creates_orderlines(
            address=pickup_address,
            order_model=PickupOrder,
            request_body_data={
                'ordertype': 'PickupOrder',
                'pickup_address': pickup_address.id,
            },
        )

    def test_creating_delivery_order_also_creates_orderlines(self):
        """
        Ensure user's orderlines correctly transfers
        from existing NEW order to created PAID Delivery order.
        """
        delivery_address = UserAddressFactory.create(user=self.user)

        self.creating_order_also_creates_orderlines(
            address=delivery_address,
            order_model=DeliveryOrder,
            request_body_data={
                'ordertype': 'DeliveryOrder',
                'delivery_address': delivery_address.id,
            },
        )

    def tearDown(self):
        self.user.delete()
