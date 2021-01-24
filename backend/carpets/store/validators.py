from django.core.validators import RegexValidator


phone_regex_validator = RegexValidator(
    regex=r'^(?:\+7|8)(?:343|9\d{2})\d{7}$',
    message="Телефонный номер должен быть в формате: \
'+79xxxxxxxxx' or '+7343xxxxxxx. Не более 11 цифр.",
)
