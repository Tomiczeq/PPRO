import time
import logging
import random
import argparse
import configparser
import prometheus_client

import numpy as np

from flask import Flask
from flask import request
from flask import Response

from prometheus_metrics import Metrics


parser = argparse.ArgumentParser(description="Sample app")
parser.add_argument("--conf", action="store",
                    default="conf/server.conf")

app = Flask(__name__)
CONTENT_TYPE_LATEST = "text/plain; version=0.0.4; charset=utf-8"
EXCEPTION_LIST = ["KeyError", "AttributeError", "RuntimeError", "TypeError"]


@app.route("/errors_total", methods=["GET"])
def errors_total():
    num_errors = int(request.args.get('num_errors', 1))

    for i in range(num_errors):
        exception = random.choice(EXCEPTION_LIST)
        metrics.errors_total(err_type=exception)

    return Response(status=200)


@app.route("/request_duration_seconds", methods=["GET"])
def request_duration_seconds():
    scale = float(request.args.get('scale', 0.5))
    size = int(request.args.get('size', 1))

    durations = np.random.exponential(scale, size)
    for duration in durations:
        metrics.request_duration_seconds(
                method=request.method,
                endpoint=request.path,
                status=200,
                duration=duration
        )

    return Response(status=200)


@app.route("/metrics")
@app.route("/metrics/")
def get_metrics():
    return Response(prometheus_client.generate_latest(),
                    mimetype=CONTENT_TYPE_LATEST)


if __name__ == "__main__":

    # disable flask messages
    log = logging.getLogger("werkzeug")
    log.disabled = True

    args = parser.parse_args()
    config = configparser.ConfigParser()
    config.read(args.conf)
    port = config.getint("server", "port", fallback=8015)
    host = config.get("server", "host", fallback="0.0.0.0")
    debug = config.getboolean("server", "debug", fallback=True)

    # simulation constants
    scale = config.getfloat(
            "simulation", "duration", fallback=0.05)
    error_chance = config.getfloat(
            "simulation", "error_chance", fallback=0.1)

    # init metrics
    app_name = config.get("metrics", "app_name", fallback="test")
    metrics = Metrics(app_name)

    app.run(host=host, port=port, debug=True)
