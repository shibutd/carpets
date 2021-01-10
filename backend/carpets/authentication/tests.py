from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.factories import UserFactory


class UserCreateTests(TestCase):
    user_model = get_user_model()

    def test_create_user(self):
        """
        Ensure user is created properly.
        """
        user = self.user_model.objects.create_user(
            email='will@email.com',
            password='testpass123'
        )

        self.assertEqual(self.user_model.objects.count(), 1)

        self.assertEqual(user.email, 'will@email.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        """
        Ensure superuser is created properly.
        """
        admin_user = self.user_model.objects.create_superuser(
            email='superadmin@email.com',
            password='testpass123'
        )

        self.assertEqual(self.user_model.objects.count(), 1)

        self.assertEqual(admin_user.email, 'superadmin@email.com')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)


class JWTAuthenicationTests(APITestCase):

    def setUp(self):
        self.email = 'user@example.com'
        self.password = 'userpassword'
        self.user = UserFactory.create(
            email=self.email,
            password=self.password
        )

    def test_api_create_user(self):
        """
        Ensure we can create user with REST API request.
        """
        url = reverse('authentication:user-list')
        email = 'admin@example.com'
        password = 'password123'

        response = self.client.post(
            url,
            {
                'email': email,
                'password': password
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], email)

    def request_for_token(self, email, password):
        """
        Make request for JWT access token.
        """
        url = reverse('authentication:user-token-obtain-pair')
        response = self.client.post(
            url,
            {
                'email': email,
                'password': password
            },
            format='json'
        )
        return response

    def test_existing_user_can_obtain_token(self):
        """
        Ensure we can obtain JWT access token for existing user.
        """
        response = self.request_for_token(self.email, self.password)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data.get('access'), None)
        self.assertNotEqual(response.data.get('refresh'), None)

    def test_existing_user_can_refresh_token(self):
        """
        Ensure we can refresh JWT access token.
        """
        obtain_token_response = self.request_for_token(
            self.email, self.password)

        url = reverse('authentication:user-token-refresh')
        refresh_token_response = self.client.post(
            url,
            {
                'refresh': obtain_token_response.data.get('refresh')
            },
            format='json'
        )
        self.assertEqual(
            refresh_token_response.status_code,
            status.HTTP_200_OK
        )
        self.assertNotEqual(refresh_token_response.data.get('access'), None)

    def test_not_existing_user_cant_obtain_token(self):
        """
        Ensure we can not obtain JWT access token for not existing user.
        """
        url = reverse('authentication:user-token-obtain-pair')

        response = self.client.post(
            url,
            {
                'email': 'random_email@example.com',
                'password': 'random_password'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def tearDown(self):
        self.user.delete()
