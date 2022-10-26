from django.contrib.gis import admin
from .models import Facility

admin.site.register(Facility, admin.GISModelAdmin)