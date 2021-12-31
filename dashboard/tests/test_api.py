import json
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
    username = "ennie"
    password = "ennie"
    with flask_app.app_context():
        user = User(username, password)
        db.session.add(user)
        db.session.commit()

    with flask_app.test_client() as test_client:
        response = test_client.get('/api/prometheusRequest',
                                   follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        response = login(test_client, username, password)

        # test valid request
        request_conf = {
            'url': 'http://localhost:9090',
            'promQuery': 'errors_total',
            'instant': False,
            'step': '1m',
            'start': '2021-12-31T06:16:39.310Z',
            'end': '2021-12-31T09:16:39.310Z'
        }
        data = {"requestConf": json.dumps(request_conf)}
        response = test_client.get('/api/prometheusRequest',
                                   follow_redirects=True,
                                   query_string=data).json
        assert response['status'] == 'ok'
        assert response['data']["status"] == 'success'

        # wrong url
        request_conf = {
            'url': 'http://localhost:4090',
            'promQuery': 'errors_total',
            'instant': False,
            'step': '1m',
            'start': '2021-12-31T06:16:39.310Z',
            'end': '2021-12-31T09:16:39.310Z'
        }
        data = {"requestConf": json.dumps(request_conf)}
        response = test_client.get('/api/prometheusRequest',
                                   follow_redirects=True,
                                   query_string=data).json
        assert response['status'] == "connection error"

        # TODO invalid request





def test_save_dashboard(flask_app):
    pass


def test_get_dashboard_charts(flask_app):
    username = "ennie"
    password = "ennie"
    dashboardId = 1
    dashboardName = "SuperDashboard"
    rowId = "1"
    rowName = "SuperRow"
    chartId1 = "1"
    chartName1 = "SuperChart1"
    chartId2 = "2"
    chartName2 = "SuperChart2"

    with flask_app.app_context():
        user = User(username, password)
        dashboard = Dashboard(dashboardName)
        dashboard.id = dashboardId
        row = Row(id=rowId, name=rowName, dashboardId=dashboardId)
        chart1 = Chart(id=chartId1, name=chartName1, rowId=rowId,
                       visualization="{}")
        chart2 = Chart(id=chartId2, name=chartName2, rowId=rowId,
                       visualization="{}")
        db.session.add(user)
        db.session.add(dashboard)
        db.session.add(row)
        db.session.add(chart1)
        db.session.add(chart2)
        db.session.commit()

    with flask_app.test_client() as test_client:

        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        response = login(test_client, username, password)
        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True)
        assert response.status_code == 404

        data = {"dashboardId": dashboardId}
        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True,
                                   query_string=data).json
        assert response["rows"]['1']['charts']['1']['name'] == chartName1
        assert response["rows"]['1']['charts']['2']['name'] == chartName2
