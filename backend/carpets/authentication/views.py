from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.serializers import CustomUserSerializer


class CustomUserCreate(APIView):
    """
    Create new user.
    """
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = CustomUserSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token

        return Response(
            {
                'refresh': str(refresh_token),
                'access': str(access_token),
                **serializer.data,
            },
            status=status.HTTP_201_CREATED
        )
