from django.db import models

# Create your models here.
class EmergencyRegion(models.Model):

    """ Definisco la regione geografica a cui si riferiscono i numeri di emergenza, es. "Italy", "United States", "Europe", etc., ma anche Italy > Verona, Italy > Veneto, ecc"""

    iso_code = models.CharField(max_length=2, unique=True, db_index=True)  # ISO 3166-1 alpha-2 code
    name = models.CharField(max_length=100)

    parent = models.ForeignKey(
            'self', null=True, blank=True, on_delete=models.SET_NULL,
            related_name='children')
    
    class StatusTypes(models.TextChoices):
        ACTIVE = 'active', 'Active'
        TRANSITIONING = 'transitioning', 'Transitioning'
        PLANNED = 'planned', 'Planned'
    
    status = models.CharField(max_length=20, choices=StatusTypes.choices)
    
    valid_until   = models.DateField(null=True, blank=True)
    last_verified = models.DateField(auto_now=True)
    source_url    = models.URLField(blank=True)

    def __str__(self):
        return f"{self.iso_code} ({self.name})"
    

class EmergencyNumber(models.Model):
    """ Definisco un numero di emergenza, es. "112", "911", "999", etc. """

    class NumberType(models.TextChoices):
        GENERAL  = 'general',  'General'
        POLICE   = 'police',   'Police'
        FIRE     = 'fire',     'Fire'
        MEDICAL  = 'medical',  'Medical'
        COAST    = 'coast',    'Coast Guard'

    region     = models.ForeignKey(EmergencyRegion, on_delete=models.CASCADE, related_name='numbers')
    number     = models.CharField(max_length=20)
    number_type = models.CharField(max_length=20, choices=NumberType.choices)
    label = models.CharField(max_length=100, blank=True)  # "Carabinieri", "SUEM 118", ecc.
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.number} ({self.number_type}) - {self.region.name}"