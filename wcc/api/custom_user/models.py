from time import timezone
from django.db import models
from django.utils.http import urlquote
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from shops.models import Shops

# Create your models here.


class CustomUserManager(BaseUserManager):
    # helper method
    def _create_user(self, email, password=None, is_active=True, is_staff=False, is_superuser=False):
        """
        Create and save user
        """
        if not email:
            raise ValueError("Users must provide an email")
        if not password:
            raise ValueError("Users must provide a password")

        email = self.normalize_email(email)
        user = self.model(
            email=email,
        )
        user.is_active = is_active
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_user(self, email, password=None):
        return self._create_user(email, password=password, is_staff=True)

    def create_superuser(self, email, password=None):
        return self._create_user(email, password=password, is_staff=True, is_superuser=True)


class CustomUser(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    likes = models.ManyToManyField(Shops, related_name='likers')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # used for querysets
    objects = CustomUserManager()

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_absolute_url(self):
        return "/users/%s/" % urlquote(self.email)

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
