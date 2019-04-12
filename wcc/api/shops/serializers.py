from rest_framework import serializers
from .models import Shops


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shops
        fields = ('id', 'name', 'picture', '_id', 'location', 'email', 'city',)
