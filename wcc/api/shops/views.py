from django.shortcuts import render
from rest_framework import viewsets
from .models import Shops
from .serializers import ShopSerializer
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from rest_framework.permissions import IsAuthenticated

# Create your views here.


class ShopView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = Shops.objects.all()
    serializer_class = ShopSerializer

    # sending nearby shops based on the coordiantes send in the url
    def get_queryset(self):
        qs = super().get_queryset()
        lon = self.request.query_params.get('lon', None)
        lat = self.request.query_params.get('lat', None)

        if lon and lat:
            user_location = Point(float(lon), float(lat), srid=4326)
            qs = qs.annotate(distance=Distance(
                'location', user_location)).order_by('distance')
        return qs
