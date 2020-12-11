from rest_framework.serializers import (
    ModelSerializer,
    CharField,
)

from authentication.models import CustomUser


class CustomUserSerializer(ModelSerializer):
    """
    Serializer for registration requests and create a new user.
    """
    password = CharField(
        min_length=8,
        max_length=128,
        write_only=True
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'password')

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)
