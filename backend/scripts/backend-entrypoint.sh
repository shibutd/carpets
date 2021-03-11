#!/bin/bash

python carpets/manage.py migrate

python carpets/manage.py runserver 0.0.0.0:8000
