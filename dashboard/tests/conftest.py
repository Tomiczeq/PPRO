import configparser
import pytest
import sys

sys.path.append("../src")
from server import create_app
from views.models import db
from views.models import User


CFG_PATH = "../conf/test.conf"


# NOTE this is dependency injection
@pytest.fixture(scope='function')
def flask_app():

    config = configparser.ConfigParser()
    config.read(CFG_PATH)
    app = create_app(config)
    with app.app_context():
        db.create_all()
        db.session.commit()
    yield app
    with app.app_context():
        db.drop_all()
        db.session.commit()
