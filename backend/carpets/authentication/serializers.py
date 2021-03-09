from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from authentication.models import CustomUser, UserAddress


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for registration requests and create a new user.
    """
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=CustomUser.objects.all(),
                message="Пользователь с указанной электронной почтой уже зарегистрирован",
            )
        ],
        error_messages={'required': 'Необходимо указать электронную почту'},
    )
    password = serializers.CharField(
        min_length=8,
        max_length=128,
        write_only=True,
        error_messages={'required': 'Необходимо указать пароль'},
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'password')

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer for obtairing token with custom error message.
    """
    default_error_messages = {
        'no_active_account': 'Неверный адрес электронной почты или пароль'
    }


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
