
import time
import prometheus_client
from flask import Flask
from flask import request
from flask import Response


from metrics import REQUEST_COUNT


app = Flask(__name__)
CONTENT_TYPE_LATEST = "text/plain; version=0.0.4; charset=utf-8"


def start_timer():
    request.start_time = time.time()


def stop_timer(response):
    resp_time = time.time() - request.start_time
    print("Response time: %ss\n" % resp_time)
    REQUEST_COUNT.labels("test", request.method,
                         request.path, response.status).inc()
    return response


def record_request_data(response):
    print("Request path: %s Request method: %s Response status: %s\n" %
          (request.path, request.method, response.status_code))
    return response


def setup_metrics(app):
    app.before_request(start_timer)
    # The order here matters since we want stop_timer
    # to be executed first
    app.after_request(record_request_data)
    app.after_request(stop_timer)


@app.route("/")
def hello():
    return f"hello from {__name__}!"

@app.route('/metrics/')
def metrics():
    return Response(prometheus_client.generate_latest(),
                    mimetype=CONTENT_TYPE_LATEST)


setup_metrics(app)
