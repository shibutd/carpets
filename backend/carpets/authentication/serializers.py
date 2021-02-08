from rest_framework import serializers

from authentication.models import CustomUser, UserAddress


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for registration requests and create a new user.
    """
    password = serializers.CharField(
        min_length=8,
        max_length=128,
        write_only=True
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'password')

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class UserAddressSerializer(serializers.ModelSerializer):
    """
    Serializer for user address.
    """

    class Meta:
        model = UserAddress
        fields = (
            'id',
            'city',
            'street',
            'house_number',
            'appartment_number',
        )
