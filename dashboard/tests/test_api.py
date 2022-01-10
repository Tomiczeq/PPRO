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

    # add user to database
    with flask_app.app_context():
        user = User(username, password)
        db.session.add(user)
        db.session.commit()

    with flask_app.test_client() as test_client:
        # login should be required
        response = test_client.get('/api/prometheusRequest',
                                   follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        # login
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

        # request with wrong url
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


def test_save_dashboard(flask_app):
    username = "ennie"
    password = "ennie"
    dashboardId = 1

    # prepare database
    with flask_app.app_context():
        user = User(username, password)
        dashboard = Dashboard(name="Dashboard", url="", timerange="1h")
        dashboard.id = dashboardId
        db.session.add(user)
        db.session.add(dashboard)
        db.session.commit()

    # try to save dashboard with this config
    dashboard_conf = {
        "id": 1,
        "name": "SuperDashboard",
        "timerange": "3h",
        "rows": {
            "row_0qibkuoib3": {
                "id": "row_0qibkuoib3",
                "name": "Row",
                "dashboardId": "1",
                "position": 0,
                "charts": {
                    "chart_u4ojijphna": {
                        "id": "chart_u4ojijphna",
                        "name": "Chart",
                        "rowId": "row_0qibkuoib3",
                        "position": 0,
                        "promQuery": "test",
                        "instant": False,
                        "step": "1m",
                        "style": {
                            "width": "20vw",
                            "minWidth": "150px",
                            "maxWidth": None,
                            "height": "200px",
                            "minHeight": None,
                            "maxHeight": None
                        },
                        "visualization": {
                            "type": "line",
                            "options": {
                                "curve": "straight",
                                "lineWidth": 5,
                                "type": "line",
                                "stacked": False,
                                "legend": "",
                                "units": "numeric"
                            }
                        },
                    }
                },
                "chartsByPos": [],
                "hidden": False
            }
        },
        "url": "test",
        "userFav": False
    }
    conf_json = json.dumps(dashboard_conf)
    with flask_app.test_client() as test_client:
        # login should be required
        response = test_client.post('/api/saveDashboard',
                                    data={"dashboard": conf_json},
                                    follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        # login
        response = login(test_client, username, password)

        # save dashboard
        response = test_client.post('/api/saveDashboard',
                                    data={"dashboard": conf_json},
                                    follow_redirects=True)
        assert response.status_code == 200

    # tests whether the changes have been reflected in the database
    with flask_app.app_context():
        dashboard = Dashboard.query.get(dashboardId)
        assert dashboard.name == dashboard_conf["name"]
        assert dashboard.url == dashboard_conf["url"]
        assert dashboard.timerange == dashboard_conf["timerange"]

        row_conf = dashboard_conf["rows"]["row_0qibkuoib3"]
        row = Row.query.filter_by(dashboardId=dashboardId).first()
        assert row.id == row_conf["id"]
        assert row.name == row_conf["name"]
        assert row.position == row_conf["position"]

        chart_conf = row_conf["charts"]["chart_u4ojijphna"]
        chart = Chart.query.filter_by(rowId=row_conf["id"]).first()
        assert chart.id == chart_conf["id"]
        assert chart.name == chart_conf["name"]
        assert chart.position == chart_conf["position"]
        assert chart.promQuery == chart_conf["promQuery"]
        assert chart.instant == chart_conf["instant"]
        assert chart.step == chart_conf["step"]
        assert chart.visualization == json.dumps(chart_conf["visualization"])


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

    # Prepare database
    # add user and dashboard with some charts
    with flask_app.app_context():
        user = User(username, password)
        dashboard = Dashboard(name=dashboardName, url="", timerange="3h")
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

    # test whether we get created dashboard and charts
    with flask_app.test_client() as test_client:
        # login should be required
        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True)
        assert b"Please log in to access this page." in response.data

        # login
        response = login(test_client, username, password)

        # test request without provided dashboard id
        # should return not found
        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True)
        assert response.status_code == 404

        # test correct request
        data = {"dashboardId": dashboardId}
        response = test_client.get('/api/getDashboardCharts',
                                   follow_redirects=True,
                                   query_string=data).json
        assert response["rows"]['1']['charts']['1']['name'] == chartName1
        assert response["rows"]['1']['charts']['2']['name'] == chartName2
