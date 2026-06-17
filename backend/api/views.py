from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status   

# Create your views here.
@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok', "message": "Backend is running!"}, status=status.HTTP_200_OK)