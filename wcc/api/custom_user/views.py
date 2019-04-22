from rest_framework import generics
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated


class UserListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
