from django.urls import path, include
from rest_framework import routers

from authentication.views import (
    CustomUserViewSet,
    UserAddressListCreateView,
)

router = routers.SimpleRouter()
router.register('users', CustomUserViewSet, basename='user')

app_name = 'authentication'

urlpatterns = [
    path('', include(router.urls)),
    path(
        'user-addresses/',
        UserAddressListCreateView.as_view(),
        name='user-addresses-list'
    ),
]
