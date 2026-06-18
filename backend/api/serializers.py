
from .models import EmergencyNumber, EmergencyRegion
from rest_framework import serializers

class EmergencyNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyNumber
        fields = ['number', 'number_type', 'label', 'is_primary']

class EmergencyRegionSerializer(serializers.ModelSerializer):
    numbers = EmergencyNumberSerializer(many=True, read_only=True)

    class Meta:
        model = EmergencyRegion
        fields = ['iso_code', 'country_name', 'status', 'valid_until', 'last_verified', 'source_url', 'numbers']