import pymysql
import argparse
import configparser
from flask import Flask

from views.api import api
from views.dashboards import dashboards
from views.home import home
from views.models import db
from views.models import Dashboard  # TODO docasne


parser = argparse.ArgumentParser(description="Sample app")
parser.add_argument("--conf", action="store",
                    default="conf/server.conf")


app = Flask(__name__)
app.register_blueprint(home)
app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(dashboards, url_prefix="/dashboards")
db.init_app(app)


if __name__ == "__main__":
    args = parser.parse_args()

    config = configparser.ConfigParser()
    config.read(args.conf)

    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://@localhost/test"

    with app.app_context():
        db.create_all()
        sentinel = Dashboard('sentinel')
        nametag = Dashboard('nametag')
        db.session.add(sentinel)
        db.session.add(nametag)
        db.session.commit()

    port = config.getint("server", "port", fallback=8080)
    host = config.get("server", "host", fallback="0.0.0.0")
    debug = config.getboolean("server", "debug", fallback=True)
    prometheus_url = config.get("prometheus", "address")

    app.run(host=host, port=port, debug=True)
