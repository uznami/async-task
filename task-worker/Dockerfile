FROM ubuntu:16.04

RUN apt-get update

RUN apt-get install -y python3 python3-pip
RUN apt-get install -y libpq-dev
RUN pip3 install --upgrade pip

RUN pip3 install celery psycopg2-binary

RUN useradd celery-user
USER celery-user

WORKDIR /work
