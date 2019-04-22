from copy import deepcopy
from django.shortcuts import render
from rest_framework import viewsets, generics, mixins
from .models import Shops
from custom_user.models import CustomUser
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
        user_id = self.request.query_params.get('id', None)
        lon = self.request.query_params.get('lon', None)
        lat = self.request.query_params.get('lat', None)

        if lon and lat:
            user_location = Point(float(lon), float(lat), srid=4326)
            qs = qs.annotate(distance=Distance(
                'location', user_location)).order_by('distance')
        # exclude liked shops from nearby shops
        if user_id:
            qs = qs.exclude(likers__in=[user_id])
        return qs


class LikeShop(generics.GenericAPIView, mixins.UpdateModelMixin):
    queryset = Shops.objects.all()
    serializer_class = ShopSerializer

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class LikedShops(generics.ListAPIView):
    # permission_classes = (IsAuthenticated,)

    queryset = Shops.objects.all()
    serializer_class = ShopSerializer
    pagination_class = None

    # sending prefered shops from if user is in likers
    def get_queryset(self):
        qs = None
        user_id = self.request.query_params.get('id', None)
        if user_id:
            qs = super().get_queryset()
            qs = qs.filter(likers__in=[user_id])
        return qs
