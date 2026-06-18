from django.urls import path
from .views import EmergencyNumberView, health_check

urlpatterns = [
    path("health/", health_check),
    path('emergency-numbers/<str:iso_code>/', EmergencyNumberView.as_view()),
]