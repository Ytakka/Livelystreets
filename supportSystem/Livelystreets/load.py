from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from Livelystreets.models import Facility 

facility_mapping = {
    'name_trans': 'name_trans',
    'sport': 'sport',
    'shop': 'shop',
    'leisure': 'leisure',
    'amenity': 'amenity',
    'public_tra': 'public_tra',
    'daily': 'daily',
    'positiv': 'positiv',
    'negativ': 'negativ',
    'propos': 'propos',
    'geom': 'MULTIPOINT',
}

facility_shp = Path(__file__).resolve().parent / 'data' / 'Facilities.shp'

def run(verbose=True):
    lm = LayerMapping(Facility, facility_shp, facility_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)