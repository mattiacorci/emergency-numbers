# api/tests/test_views.py
from django.test import TestCase
from rest_framework.test import APIClient
from api.models import EmergencyRegion, EmergencyNumber


class EmergencyNumberViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
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

    def test_200_con_codice_valido(self):
        response = self.client.get('/api/emergency-numbers/FOO-IT/')
        self.assertEqual(response.status_code, 200)

    def test_404_con_codice_inesistente(self):
        response = self.client.get('/api/emergency-numbers/XX/')
        self.assertEqual(response.status_code, 404)

    def test_iso_code_case_insensitive(self):
        # la view fa .upper(), quindi "it" deve funzionare come "IT"
        response = self.client.get('/api/emergency-numbers/foo-it/')
        self.assertEqual(response.status_code, 200)

    def test_response_contiene_numbers(self):
        response = self.client.get('/api/emergency-numbers/FOO-IT/')
        data = response.json()
        self.assertIn('numbers', data)
        self.assertEqual(len(data['numbers']), 1)
        self.assertEqual(data['numbers'][0]['number'], '112')