from rest_framework.response import Response
from rest_framework.decorators import APIView, api_view
from rest_framework import status

from .resolvers import EmergencyResolver
from .serializers import EmergencyRegionSerializer   

# Create your views here.
@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok', "message": "Backend is running!"}, status=status.HTTP_200_OK)



class EmergencyNumberView(APIView):
    def get(self, request, iso_code: str):
        iso_code = iso_code.upper()
        region = EmergencyResolver().resolve(iso_code)

        if region is None:
            return Response(
                {'error': f'No emergency data found for {iso_code}.'},
                status=status.HTTP_404_NOT_FOUND
            )

        data = EmergencyRegionSerializer(region).data
        data['requested'] = iso_code
        data['resolved_from'] = region.iso_code

        return Response(data, status=status.HTTP_200_OK)