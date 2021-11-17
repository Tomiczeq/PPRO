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
from flask import g


from prometheus_metrics import Metrics


parser = argparse.ArgumentParser(description="Sample app")
parser.add_argument("--conf", action="store",
                    default="conf/server.conf")

app = Flask(__name__)
CONTENT_TYPE_LATEST = "text/plain; version=0.0.4; charset=utf-8"
EXCEPTION_LIST = ["KeyError", "AttributeError", "RuntimeError", "TypeError"]


@app.before_request
def before_request():
    g.start_time = time.time()


@app.after_request
def after_request(response):
    duration = time.time() - g.start_time
    app.logger.info(f"Request on endpoint {request.path} "
                    f"took {duration} sec.")
    metrics.request_duration_seconds(
            method=request.method,
            endpoint=request.path,
            status=response.status_code,
            duration=duration
    )
    return response


def get_sleep_time():
    return np.random.exponential(scale)


@app.route("/", defaults={"path": ""}, methods=["GET"])
@app.route("/<path:path>", methods=["GET", "POST"])
def simulation(path):

    # simulate some processing time
    time.sleep(get_sleep_time())

    # simulate some errors
    if random.random() < error_chance:
        exception = random.choice(EXCEPTION_LIST)
        metrics.errors_total(err_type=exception)

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
