from rest_framework import viewsets
from rest_framework import routers

from Livelystreets.api_views import FacilityViewSet

router = routers.DefaultRouter()
router.register(r"facilities", FacilityViewSet)

urlpatterns = router.urls