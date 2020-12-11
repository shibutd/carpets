from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

from authentication.serializers import CustomUserSerializer


class CustomUserCreate(APIView):
    """
    Create new user.
    """
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = CustomUserSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
