FROM python:3.7

WORKDIR /backend

RUN pip install --upgrade pip

COPY ./requirements.txt /backend/

RUN pip install -r requirements.txt

COPY . /backend/
