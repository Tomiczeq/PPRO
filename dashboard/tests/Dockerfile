FROM python:3.8-slim-buster

WORKDIR /www/ppro/dashboard

COPY requirements.txt requirements.txt

RUN apt-get update && apt-get install -y curl

RUN pip3 install flask
RUN pip3 install requests
RUN pip3 install flask-sqlalchemy
RUN pip3 install pymysql
RUN pip3 install flask-login
RUN pip3 install pytest

COPY scripts scripts
COPY src src
COPY conf conf
COPY tests tests