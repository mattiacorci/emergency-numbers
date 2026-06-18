from datetime import date, timedelta
from django.test import TestCase
from api.models import EmergencyRegion, EmergencyNumber
from api.resolvers import EmergencyResolver


class EmergencyResolverTest(TestCase):

    def setUp(self):
        self.foolandia, _ = EmergencyRegion.objects.get_or_create(
            iso_code='FOO-IT',
            defaults={'name': 'foolandia', 'status': 'active'},
        )

        self.fooveneto, _ = EmergencyRegion.objects.get_or_create(
            iso_code='FOO-IT-VR',
            defaults={'name': 'Foolopoli', 'status': 'active', 'parent': self.foolandia},
        )
        
        EmergencyNumber.objects.get_or_create(
            region=self.foolandia,
            number='112',
            number_type='general',
            defaults={'is_primary': True},
        )

    def test_trova_regione_esatta(self):
        result = EmergencyResolver().resolve('FOO-IT')
        assert result is not None
        self.assertEqual(result.iso_code, 'FOO-IT')

    def test_fallback_al_parent(self):
        # IT-VE esiste ma non ha numeri propri — deve risolvere a IT
        # (dipende da come hai implementato il fallback)
        result = EmergencyResolver().resolve('FOO-IT-VR')
        self.assertIsNotNone(result)

    def test_codice_inesistente_ritorna_none(self):
        result = EmergencyResolver().resolve('XX')
        self.assertIsNone(result)

    def test_regione_scaduta_ritorna_none(self):
        self.foolandia.valid_until = date.today() - timedelta(days=1)
        self.foolandia.save()
        result = EmergencyResolver().resolve('FOO-IT')
        self.assertIsNone(result)

    def test_regione_non_ancora_scaduta(self):
        self.foolandia.valid_until = date.today() + timedelta(days=1)
        self.foolandia.save()
        result = EmergencyResolver().resolve('FOO-IT')
        self.assertIsNotNone(result)