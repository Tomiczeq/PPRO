
import time
import argparse
import configparser
import prometheus_client
from flask import Flask
from flask import request
from flask import Response


from prometheus_metrics import Metrics


parser = argparse.ArgumentParser(description='Sample app')
parser.add_argument("--conf", action="store",
                    default="conf/server.conf")

app = Flask(__name__)
CONTENT_TYPE_LATEST = "text/plain; version=0.0.4; charset=utf-8"


def record_request_data(response):
    print("Request path: %s Request method: %s Response status: %s\n" %
          (request.path, request.method, response.status_code))
    metrics.request_count_total(
            method=request.method,
            endpoint=request.path,
            status=response.status_code
    )
    return response


def setup_metrics(app):
    app.after_request(record_request_data)


@app.route("/")
def hello():
    return f"hello from {__name__}!"


@app.route('/metrics')
@app.route('/metrics/')
def get_metrics():
    return Response(prometheus_client.generate_latest(),
                    mimetype=CONTENT_TYPE_LATEST)


if __name__ == "__main__":
    setup_metrics(app)
    app_name = "test"
    metrics = Metrics(app_name)

    args = parser.parse_args()
    config = configparser.ConfigParser()
    config.read(args.conf)
    port = config.getint("server", "port", fallback=8015)
    host = config.get("server", "host", fallback="0.0.0.0")
    debug = config.getboolean("server", "debug", fallback=True)

    app.run(host=host, port=port, debug=True)
