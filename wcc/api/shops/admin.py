from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import Shops


@admin.register(Shops)
class ShopAdmin(OSMGeoAdmin):
    list_display = ('name', 'location')
