import os
import json
import requests
from flask import request
from flask import Blueprint
from flask import make_response
from flask import jsonify
from views.models import db
from views.models import Dashboard
from views.models import Datasource
from views.models import Chart
from views.models import Row
from flask import current_app

api = Blueprint('api', __name__)


@api.route("/getDatasource", methods=["GET"])
def getDatasource():
    datasources = Datasource.query.all()
    datasources = [datasource.to_dict() for datasource in datasources]
    return make_response(jsonify(datasources), 200)


@api.route("/prometheusRequest", methods=["GET"])
def prometheusRequest():
    response = {
        "status": "err",
        "data": None
    }
    request_conf = json.loads(request.args.get('requestConf'))
    params = {
        "query": request_conf["promQuery"],
    }

    if request_conf["instant"]:
        query_type = "query"
        params["time"] = request_conf["end"]
    else:
        query_type = "query_range"
        params["step"] = request_conf["step"]
        params["start"] = request_conf["start"]
        params["end"] = request_conf["end"]

    current_app.logger.info(f"params: {params}")

    query_prefix = os.path.join("api/v1", query_type)

    datasourceUrl = request_conf.get("url")
    current_app.logger.info(f"datasourceUrl: {datasourceUrl}")

    if not datasourceUrl:
        response["status"] = "no datasource url"
        return make_response(response, 200)

    prom_url = os.path.join(datasourceUrl, query_prefix)
    current_app.logger.info(f"prom_url: {prom_url}")
    prom_response = requests.get(prom_url, params=params)
    current_app.logger.info(f"response.text: {prom_response.text}")

    if prom_response.status_code != 200:
        return make_response("Bad query", prom_response.status_code)

    response["status"] = "ok"
    response["data"] = prom_response.json()
    return make_response(response, 200)


@api.route("/updateDatasource", methods=["POST"])
def updateDatasource():
    datasources = Datasource.query.all()
    for datasource in datasources:
        db.session.delete(datasource)

    datasource = Datasource()
    url = request.form.get('datasource_url')

    if isinstance(url, str):
        datasource.url = url
    else:
        return make_response("Bad request\n", 400)

    db.session.add(datasource)
    db.session.commit()
    return make_response("", 200)


@api.route("/saveDashboard", methods=["POST"])
def saveDashboard():
    dashboardJson = json.loads(request.form.get('dashboard'))
    rows_conf = dashboardJson.get("rows")
    timerange = dashboardJson.get("timerange")
    name = dashboardJson.get("name")
    url = dashboardJson.get("url", "")

    dashboard = Dashboard.query.get(dashboardJson.get("id", ""))
    if not (dashboard and timerange and name):
        return make_response("Bad request\n", 400)
    dashboard.timerange = timerange
    dashboard.name = name
    dashboard.url = url

    rows = Row.query.filter_by(dashboardId=dashboard.id)
    for row in rows:
        charts = Chart.query.filter_by(rowId=row.id)
        for chart in charts:
            db.session.delete(chart)
        db.session.delete(row)

    if rows_conf:
        for row_id, row_conf in rows_conf.items():
            row = Row.from_conf(row_conf)
            db.session.add(row)

            for chart_id, chart_conf in row_conf["charts"].items():
                chart = Chart.from_conf(chart_conf)
                db.session.add(chart)

    db.session.commit()
    return make_response("", 200)


@api.route("/getDashboardCharts", methods=["GET"])
def get_dashboard_charts():
    dashboardId = request.args.get('dashboardId')

    if not dashboardId:
        return make_response("Not found\n", 404)

    dashboard = Dashboard.query.get(dashboardId)
    if not dashboard:
        return make_response("Not found\n", 404)

    rows = Row.query.filter_by(dashboardId=dashboard.id)
    rows_conf = {row.id: row.to_dict() for row in rows}

    for row_id, row_conf in rows_conf.items():
        charts = Chart.query.filter_by(rowId=row_id)
        row_conf["charts"] = {chart.id: chart.to_dict() for chart in charts}

    response = {
        "timerange": dashboard.timerange,
        "rows": rows_conf,
        "url": dashboard.url
    }

    return jsonify(response)