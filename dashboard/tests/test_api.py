import urllib.parse
from views.models import db
from views.models import User
from views.models import Dashboard
from views.models import Row
from views.models import Chart


def login(client, username, password, follow_redirects=True):
    data = dict()
    if username is not None:
        data["username"] = username
    if password is not None:
        data["password"] = password
    return client.post('/login', data=data, follow_redirects=follow_redirects)


def test_prometheus_request(flask_app):
    pass


def test_save_dashboard(flask_app):
    pass


def test_get_dashboard_charts(flask_app):
    username = "ennie"
    password = "ennie"
    user = User(username, password)
    dashboard = Dashboard("dashboard")
    with flask_app.test_client() as test_client:

        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        with flask_app.app_context():
            db.session.add(user)
            db.session.add(dashboard)
            db.session.commit()

        response = login(test_client, username, password)
        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True)
        assert response.status_code == 404

        dashboard = Dashboard.query.filter_by(name="dashboard").first()
        data = {"dashboardId": dashboard.id}
        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True,
                                   query_string=data)
        assert b'{"rows":{},"timerange":"3h","url":null}\n' == response.data
