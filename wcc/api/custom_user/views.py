from rest_framework import generics
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser


class UserListView(generics.ListCreateAPIView):
    permission_classes = (IsAdminUser,)

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
