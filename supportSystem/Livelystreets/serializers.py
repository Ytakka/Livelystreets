from rest_framework_gis import serializers 
from .models import Facility
class FacilitySerializer(serializers.GeoFeatureModelSerializer):
    class Meta:
        fields = ("sport", "shop", "leisure", "amenity", "public_tra", "name_trans", "daily", "positiv", "negativ", "propos")
        geo_field = "geom"
        model = Facility