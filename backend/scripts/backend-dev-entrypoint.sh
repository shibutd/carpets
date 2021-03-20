#!/bin/bash

set -e

until PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 3
done

>&2 echo "Postgres is up - proceeding"

cd carpets

python manage.py migrate --noinput

python manage.py runserver 0.0.0.0:8000
