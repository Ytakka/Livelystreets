import json
from django.core.serializers import serialize
from django.views.generic.base import TemplateView
from .models import Facility
from django.views import generic
from django.db.models import Sum
from django.shortcuts import render

#class Streetslist(generic.ListView):
    #model = Facility
    #context_object_name = "streets"
    #queryset = Facility.objects.values('name_trans').filter(name_trans__isnull=False).annotate(total=Sum('daily')).order_by('-total')[:10]
   
    #template_name = "Default.html"

def defaultPage(request):   
    queryset = Facility.objects.values('name_trans').filter(name_trans__isnull=False).annotate(total=Sum('daily')).order_by('-total')[:10]
    mapbox_access_token = 'pk.eyJ1IjoieXRha2thIiwiYSI6ImNsNzYwdW9vbzE5M20zb21hbnFiczdydG0ifQ.kD_WOU3qHqpanZ_9iHyZRA'
    context = {'queryset': queryset, 'mapbox_access_token': mapbox_access_token}
    return render(request, 'Default.html', context)