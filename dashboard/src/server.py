import requests
import argparse
import configparser
from flask import Flask
from flask import render_template
from flask import request


parser = argparse.ArgumentParser(description='Sample app')
parser.add_argument("--conf", action="store",
                    default="conf/server.conf")
app = Flask(__name__)


@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/api/query", methods=["POST"])
@app.route("/api/query/", methods=["POST"])
def query():

    url = prometheus_url + '/api/v1/query'
    params = {"query": request.form['promql']}
    response = requests.get(url, params=params)

    return response.text


if __name__ == "__main__":
    args = parser.parse_args()

    config = configparser.ConfigParser()
    config.read(args.conf)

    port = config.getint("server", "port", fallback=8080)
    host = config.get("server", "host", fallback="0.0.0.0")
    debug = config.getboolean("server", "debug", fallback=True)
    prometheus_url = config.get("prometheus", "address")

    app.run(host=host, port=port, debug=True)
