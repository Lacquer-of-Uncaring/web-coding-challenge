from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    """
    Creates a user with no privileges
    """

    class Meta:
        model = CustomUser
        fields = ('email',)


class CustomUserChangeForm(UserChangeForm):
    """
    Update a user. Includes all the fields on the user,
    but with password hash display field
    """

    class Meta:
        model = CustomUser
        fields = ('email',)
        # fields = UserChangeForm.Meta.fields
