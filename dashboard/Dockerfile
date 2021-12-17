FROM python:3.8-slim-buster

WORKDIR /www/ppro/dashboard

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

RUN pip3 install flask
RUN pip3 install requests
RUN pip3 install flask-sqlalchemy
RUN pip3 install pymysql

COPY src src
COPY conf conf

CMD python3 /www/ppro/dashboard/src/server.py \
            --conf=/www/ppro/dashboard/conf/server.conf
