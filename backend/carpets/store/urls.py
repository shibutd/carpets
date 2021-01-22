from django.urls import path, include
from rest_framework import routers

from store.views import (
    OrderLineList,
    PickupOrderCreate,
    ProductViewSet,
    ProductVariationViewSet,
    PickupAddressList,
    ProductCategoryViewSet,
    PromotionList,
)

app_name = 'store'

router = routers.SimpleRouter()
router.register('products', ProductViewSet)
router.register('product-variations', ProductVariationViewSet)
router.register('categories', ProductCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('orders/', PickupOrderCreate.as_view(), name='order-create'),
    path('orderlines/', OrderLineList.as_view(), name='orderline-list'),
    path(
        'pickup-addresses/',
        PickupAddressList.as_view(),
        name='pickup-address-list'
    ),
    path('promotions/', PromotionList.as_view(), name='promotion-list'),
]
