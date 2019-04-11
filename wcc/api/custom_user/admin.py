from django.contrib import admin
from django.contrib.auth import get_user_model
from .forms import CustomUserCreationForm, CustomUserChangeForm

# Register your models here.


class UserAdmin(admin.ModelAdmin):
    search_fields = ['email']
    edit_form = CustomUserChangeForm
    add_form = CustomUserCreationForm


user = get_user_model()
admin.site.register(user, UserAdmin)
