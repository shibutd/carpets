from django.test import TestCase
from django.core.exceptions import ValidationError

from authentication.factories import UserAddressFactory
from store.models import PickupAddress, phone_regex_validator
from orders.models import Order, PickupOrder, DeliveryOrder


class OrderTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.addresses = UserAddressFactory.create_batch(2)

    def test_retrieve_polymorphic_orders(self):
        """
        Ensure polymorphic orders models work as expected.
        """
        pickup_order = PickupOrder.objects.create(
            user=self.addresses[0].user
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


class PickupAddressTests(TestCase):

    def test_pickupaddress_valid_phone_number_field(self):
        """
        Ensure PhoneNumberField with valid data works as expected.
        """
        addresses = [
            {
                'name': 'TestAddress-1',
                'phone_number': '+79121234567'
            },
            {
                'name': 'TestAddress-2',
                'phone_number': '+73432234567'
            },
            {
                'name': 'TestAddress-3',
                'phone_number': '83431234567'
            },
            {
                'name': 'TestAddress-4',
                'phone_number': '89221234567'
            },
        ]

        for address in addresses:
            try:
                phone_regex_validator(address['phone_number'])
                PickupAddress.objects.create(**address)
            except ValidationError:
                pass

        self.assertEqual(PickupAddress.objects.count(), 4)

    def test_pickupaddress_invalid_phone_number_field(self):
        """
        Ensure PhoneNumberField with invalid data works as expected.
        """
        addresses = [
            {
                'name': 'TestAddress-1',
                'phone_number': '+33432234567'
            },
            {
                'name': 'TestAddress-2',
                'phone_number': '+83432234567'
            },
            {
                'name': 'TestAddress-3',
                'phone_number': '3734563'
            },
            {
                'name': 'TestAddress-4',
                'phone_number': '83533733232'
            },
        ]

        for address in addresses:
            try:
                phone_regex_validator(address['phone_number'])
                PickupAddress.objects.create(**address)
            except ValidationError:
                pass

        self.assertEqual(PickupAddress.objects.count(), 0)
