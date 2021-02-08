from django.urls import path, include
from rest_framework import routers

from store.views import (
    OrderLineViewSet,
    ProductViewSet,
    ProductVariationViewSet,
    PickupAddressList,
    ProductCategoryViewSet,
    OrderCreateView,
    PromotionList,
)

app_name = 'store'

router = routers.SimpleRouter()
router.register('products', ProductViewSet)
router.register('product-variations', ProductVariationViewSet)
router.register('categories', ProductCategoryViewSet)
router.register('orderlines', OrderLineViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path(
        'pickup-addresses/',
        PickupAddressList.as_view(),
        name='pickup-address-list'
    ),
    path('orders/', OrderCreateView.as_view(), name='order-list'),
    path('promotions/', PromotionList.as_view(), name='promotion-list'),
]
