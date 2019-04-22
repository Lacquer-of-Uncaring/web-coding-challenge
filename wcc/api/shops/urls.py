from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('shops', views.ShopView)

urlpatterns = [
    path('', include(router.urls)),
    path('prefered/', views.LikedShops.as_view()),
    path(r'like/<pk>/', views.LikeShop.as_view())
]
