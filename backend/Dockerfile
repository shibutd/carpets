FROM python:3.7

RUN apt-get update \
 && apt-get install --no-install-recommends --assume-yes \
   postgresql-client

WORKDIR /backend

RUN pip install --upgrade pip

COPY ./requirements.txt /backend/

RUN pip install -r requirements.txt

COPY . /backend/
