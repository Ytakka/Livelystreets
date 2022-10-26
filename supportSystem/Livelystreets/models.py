from django.contrib.gis.db import models

class Facility(models.Model):
    sport = models.CharField(max_length=254, null=True)
    name_trans = models.CharField(max_length=254, null=True)
    daily = models.IntegerField()
    positiv = models.IntegerField()
    negativ = models.IntegerField()
    propos = models.IntegerField()
    shop = models.CharField(max_length=254, null=True)
    leisure = models.CharField(max_length=254, null=True)
    amenity = models.CharField(max_length=254, null=True)
    public_tra = models.CharField(max_length=254, null=True)
    geom = models.MultiPointField(srid=4326)
    
    class Meta:
        # order of drop-down list items
        ordering = ['name_trans']

        # plural form in admin view
        verbose_name_plural = 'Facilities'