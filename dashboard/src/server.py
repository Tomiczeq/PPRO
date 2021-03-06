import pymysql
import argparse
import configparser
from flask import Flask
from flask_login import LoginManager

from views.api import api
from views.dashboards import dashboards
from views.auth import auth
from views.models import db
from views.models import User


def create_app(config):
    app = Flask(__name__)
    app.register_blueprint(auth)
    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(dashboards)
    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.loginGet'
    login_manager.init_app(app)

    @login_manager.user_loader
    def loadUser(user_id):
        return User.query.get(user_id)

    app.config['SQLALCHEMY_DATABASE_URI'] = config.get("database", "uri")
    app.config['SECRET_KEY'] = config.get("server", "secretKey")

    if config.getboolean("server", "test", fallback=False):
        app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
        db.session.commit()
    return app


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sample app")
    parser.add_argument("--conf", action="store",
                        default="conf/server.conf")
    args = parser.parse_args()
    config = configparser.ConfigParser()
    config.read(args.conf)

    port = config.getint("server", "port", fallback=8080)
    host = config.get("server", "host", fallback="0.0.0.0")
    debug = config.getboolean("server", "debug", fallback=True)
    prometheus_url = config.get("prometheus", "address")

    app = create_app(config)
    app.run(host=host, port=port, debug=debug)
