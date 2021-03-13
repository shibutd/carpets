#!/bin/bash

cd carpets

python manage.py migrate --noinput

python manage.py collectstatic --noinput

uvicorn carpets.asgi:application --host 0.0.0.0 --port 8000
