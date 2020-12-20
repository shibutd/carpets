from django.urls import path

from store.views import ProductList, ProductDetail, PickupOrderCreate


app_name = 'store'

urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<str:slug>', ProductDetail.as_view(), name='product-detail'),
    path('orders/', PickupOrderCreate.as_view(), name='order-create'),
]
