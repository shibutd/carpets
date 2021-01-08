from django.urls import path, include
from rest_framework import routers

from store.views import (PickupOrderCreate, OrderLineList, ProductViewSet)

app_name = 'store'

router = routers.SimpleRouter()
router.register('products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('orders/', PickupOrderCreate.as_view(), name='order-create'),
    path('orderlines/', OrderLineList.as_view(), name='orderlines-list'),
    # path('orderlines/<str:slug>', OrderLineDetail.as_view(), name='orderlines-detail'),
]
