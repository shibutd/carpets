from django.urls import path, include
from rest_framework import routers

from store.views import (
    OrderLineList,
    ProductCategoryList,
    PickupOrderCreate,
    ProductViewSet,
    PickupAddressList,
)

app_name = 'store'

router = routers.SimpleRouter()
router.register('products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('orders/', PickupOrderCreate.as_view(), name='order-create'),
    path('orderlines/', OrderLineList.as_view(), name='orderline-list'),
    path('categories/', ProductCategoryList.as_view(), name='category-list'),
    path(
        'pickup-addresses/',
        PickupAddressList.as_view(),
        name='pickup-address-list'
    ),
    # path('orderlines/<str:slug>', OrderLineDetail.as_view(), name='orderlines-detail'),
]
