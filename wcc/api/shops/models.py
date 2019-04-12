# from django.db import models
from django.contrib.gis.db import models

# Create your models here.


class Shops(models.Model):
    name = models.CharField(max_length=50)
    picture = models.CharField(max_length=200)
    location = models.PointField(null=True, blank=True)
    email = models.EmailField(max_length=200, unique=True)
    city = models.CharField(max_length=50)
