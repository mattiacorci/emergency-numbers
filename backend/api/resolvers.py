
from datetime import date
from .models import EmergencyRegion

class EmergencyResolver:
    def resolve(self, iso_code: str) -> EmergencyRegion | None:
    
        """ Ritorna la regione di emergenza corrispondente al codice ISO, o None se non trovata """

        candidate = self._find_valid(iso_code)
        if candidate:
            return candidate
    
        parent_code = self._parent_code(iso_code)
        if parent_code:
            return self.resolve(parent_code)

        return None


    def _find_valid(self, iso_code: str) -> EmergencyRegion | None:
        try:
            region = EmergencyRegion.objects.prefetch_related('numbers').get(iso_code=iso_code)
        except EmergencyRegion.DoesNotExist:
            return None
        
        if region.valid_until and region.valid_until < data.today():
            return None
        
        return region;


    def _parent_code(self, iso_code: str) -> str | None:
        if '-' in iso_code:
            return iso_code.split('-')[0]
        return None