from django.contrib import admin
from rest_framework import serializers
from django.contrib.gis.admin import OSMGeoAdmin
from .models import Shops


@admin.register(Shops)
class ShopAdmin(OSMGeoAdmin):
    list_display = ('id', 'name', 'picture', '_id',
                    'location', 'email', 'city',)
