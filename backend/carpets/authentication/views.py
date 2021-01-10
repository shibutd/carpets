from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)

from authentication.serializers import CustomUserSerializer


class CustomUserViewSet(viewsets.ViewSet):

    def create(self, request):
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

    @action(detail=False, methods=['post'])
    def token_obtain_pair(self, request, *args, **kwargs):
        serializer = TokenObtainPairSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        return Response(
            serializer.validated_data,
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=['post'])
    def token_refresh(self, request, *args, **kwargs):
        serializer = TokenRefreshSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        return Response(
            serializer.validated_data,
            status=status.HTTP_200_OK,
        )
