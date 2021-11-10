FROM python:3.8-slim-buster

WORKDIR /www/ppro/monitored_app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY src src
COPY conf conf

CMD python3 /www/ppro/monitored_app/src/server.py \
            --conf=/www/ppro/monitored_app/conf/server.conf
