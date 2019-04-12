from django.shortcuts import render
from rest_framework import viewsets
from .models import Shops
from .serializers import ShopSerializer

# Create your views here.


class ShopView(viewsets.ModelViewSet):
    queryset = Shops.objects.all()
    serializer_class = ShopSerializer
