from rest_framework import serializers
from .models import Shops


class ShopSerializer(serializers.ModelSerializer):
    distance = serializers.DecimalField(
        source='distance.km', max_digits=10, decimal_places=2, required=False
    )

    class Meta:
        model = Shops
        fields = ('id', 'name', 'picture', '_id',
                  'location', 'email', 'city', 'distance', 'likers')

        read_only_fields = ('id', 'name', 'picture', '_id',
                            'location', 'email', 'city',)
