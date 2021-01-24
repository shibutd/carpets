from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from store.validators import phone_regex_validator


class CustomUserManager(BaseUserManager):

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a CustomUser instance with the given email and
        password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        """
        Create a simple user.
        """
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """
        Create a superuser.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class CustomUser(PermissionsMixin, AbstractBaseUser):
    """
    Custom User model class with email field instead of username.
    """
    email = models.EmailField(
        db_index=True,
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    phone_number = PhoneNumberField(
        null=True,
        validators=[phone_regex_validator],
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'пользователь'
        verbose_name_plural = 'пользователи'

    def __str__(self):
        return 'User: {}'.format(self.email)


class UserAddress(models.Model):
    user = models.ForeignKey(
        'CustomUser',
        on_delete=models.CASCADE,
    )
    city = models.CharField(max_length=60)
    street = models.CharField(max_length=60)
    house_number = models.PositiveIntegerField()
    appartment_number = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = 'адрес'
        verbose_name_plural = 'адреса'


class UserFavorite(models.Model):
    user = models.OneToOneField(
        'CustomUser',
        on_delete=models.CASCADE,
        primary_key=True,
    )
    variations = models.ManyToManyField(
        'store.ProductVariation',
        blank=True,
    )

    class Meta:
        verbose_name = 'избранное'
        verbose_name_plural = 'избранное'
