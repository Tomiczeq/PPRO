from views.models import db
from views.models import User
from views.models import Dashboard
from views.models import FavDashboard


def login(client, username, password, follow_redirects=True):
    data = dict()
    if username is not None:
        data["username"] = username
    if password is not None:
        data["password"] = password
    return client.post('/login', data=data, follow_redirects=follow_redirects)


def test_dashboard_page(flask_app):
    username = "ennie"
    password = "ennie"

    dashboard_name = "SuperDashboard"
    datasource_url = "http://localhost:9090"
    timerange = "6h"

    test_timerange = f'contenteditable="true">{timerange}'.encode()
    test_name = f'<span class="dashboardName">{dashboard_name}</span>'.encode()
    test_url = b'http://localhost:9090'

    with flask_app.app_context():
        user = User(username, password)
        dashboard = Dashboard(dashboard_name)
        dashboard.url = datasource_url
        dashboard.timerange = timerange
        db.session.add(user)
        db.session.add(dashboard)
        db.session.commit()

        dashboard = Dashboard.query.filter_by(name=dashboard_name).first()

    with flask_app.test_client() as test_client:
        response = test_client.get('/dashboards/SuperDashboard',
                                   follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        response = login(test_client, username, password)
        assert b"ennie" in response.data

        response = test_client.get('/dashboards/SuperDashboard',
                                   follow_redirects=True)
        # test correct templating
        assert test_name in response.data
        assert test_url in response.data
        assert test_timerange in response.data
        # dashboard should not be marked as user favourite
        assert b'favourite' not in response.data

        # mark dashboard as user favourite and test it
        with flask_app.app_context():
            userId = User.query.filter_by(username=username).first().id
            dashboardId = (Dashboard.query
                                    .filter_by(name="SuperDashboard")
                                    .first().id)
            favDashboard = FavDashboard(dashboardId=dashboardId, userId=userId)
            db.session.add(favDashboard)
            db.session.commit()

        response = test_client.get('/dashboards/SuperDashboard',
                                   follow_redirects=True)
        assert b'favourite' in response.data


def test_homepage(flask_app):
    username = "ennie"
    password = "ennie"

    with flask_app.app_context():
        user = User(username, password)
        dashboard = Dashboard("SuperDashboard")
        db.session.add(user)
        db.session.add(dashboard)
        db.session.commit()

    with flask_app.test_client() as test_client:
        response = test_client.get('/', follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        response = login(test_client, username, password)
        assert b"ennie" in response.data
        assert b"SuperDashboard" in response.data


def test_create_dashboard(flask_app):
    username = "ennie"
    password = "ennie"

    with flask_app.app_context():
        user = User(username, password)
        db.session.add(user)
        db.session.commit()

    with flask_app.test_client() as test_client:
        response = test_client.post('/createNewDashboard',
                                    follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        response = login(test_client, username, password)
        assert b"ennie" in response.data

        response = test_client.post('/createNewDashboard',
                                    follow_redirects=True)
        test_snippet = b'<span class="dashboardName">New Dashboard 0</span'
        assert test_snippet in response.data

        newDashbrd = Dashboard.query.filter_by(name="New Dashboard 0").first()
        assert newDashbrd
