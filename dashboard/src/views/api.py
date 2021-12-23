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
    request_conf = json.loads(request.args.get('request_conf'))
    params = {
        "query": request_conf["prom_query"],
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

    datasource = Datasource.query.first()
    current_app.logger.info(f"datasource: {datasource}")
    current_app.logger.info(f"datasource_url: {datasource.url}")
    prom_url = os.path.join(datasource.url, query_prefix)
    current_app.logger.info(f"prom_url: {prom_url}")
    # prom_url = 'http://localhost:9090/api/v1/query_range?query=errors_total&start=2021-12-22T16:05:36.111Z&end=2021-12-23T11:16:05.111Z&step=1m'
    response = requests.get(prom_url, params=params)
    current_app.logger.info(f"response.text: {response.text}")

    if response.status_code != 200:
        make_response("", response.status_code)

    return make_response(jsonify(response.json()), 200)


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
    dashboard_id = request.form.get('dashboard_id')
    rows_conf = json.loads(request.form.get('rows_conf'))

    dashboard = Dashboard.query.get(dashboard_id)
    if not dashboard:
        return make_response("Not found\n", 404)

    rows = Row.query.filter_by(dashboard_id=dashboard.id)
    for row in rows:
        charts = Chart.query.filter_by(row_id=row.id)
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
    dashboard_id = request.args.get('dashboard_id')

    if not dashboard_id:
        return make_response("Not found\n", 404)

    dashboard = Dashboard.query.get(dashboard_id)
    if not dashboard:
        return make_response("Not found\n", 404)

    rows = Row.query.filter_by(dashboard_id=dashboard.id)
    rows_conf = {row.id: row.to_dict() for row in rows}

    for row_id, row_conf in rows_conf.items():
        charts = Chart.query.filter_by(row_id=row_id)
        row_conf["charts"] = {chart.id: chart.to_dict() for chart in charts}

    return jsonify(rows_conf)


@api.route("/createNewRow", methods=["POST"])
def create_new_row():
    dashboard_id = request.form.get('dashboard_id')
    dashboard = Dashboard.query.get(dashboard_id)
    if not dashboard:
        return make_response("Not found\n", 404)

    rows = Row.query.filter_by(dashboard_id=dashboard_id)
    rows = sorted(rows, key=lambda x: x.position)
    i = 1
    for row in rows:
        row.position = i
        i += 1

    row = Row(name="New Row " + str(len(rows)), dashboard=dashboard)
    row.position = 0
    db.session.add(row)
    db.session.commit()
    return make_response(jsonify(row.to_dict()), 201)


@api.route("/createNewChart", methods=["POST"])
def create_new_chart():
    row_id = request.form.get('row_id')
    row = Row.query.get(row_id)
    if not row:
        return make_response("Not found\n", 404)

    charts = Chart.query.filter_by(row_id=row_id)
    charts = sorted(charts, key=lambda x: x.position)
    i = 1
    for chart in charts:
        chart.position = i
        i += 1

    chart = Chart(name="New Chart", row=row)
    chart.position = 0
    db.session.add(chart)
    db.session.commit()
    return make_response(jsonify(chart.to_dict()), 201)


@api.route("updateRow", methods=["POST"])
def update_row():
    row_id = request.form.get('id')
    name = request.form.get("name")

    if not row_id:
        return make_response("Not found\n", 404)

    row = Row.query.get(row_id)
    if not row:
        return make_response("Not found\n", 404)

    row.name = name
    db.session.commit()
    return make_response("", 200)


@api.route("updateChart", methods=["POST"])
def update_chart():
    chart_id = request.form.get('id')
    name = request.form.get("name")
    width = request.form.get("width")
    min_width = request.form.get("min_width")
    max_width = request.form.get("max_width")
    height = request.form.get("height")
    min_height = request.form.get("min_height")
    max_height = request.form.get("max_height")
    prom_query = request.form.get("prom_query")

    if not chart_id:
        return make_response("Not found\n", 404)

    chart = Chart.query.get(chart_id)

    if not chart:
        return make_response("Not found\n", 404)

    chart.name = name
    chart.width = width
    chart.min_width = min_width
    chart.max_width = max_width
    chart.height = height
    chart.min_height = min_height
    chart.max_height = max_height
    chart.prom_query = prom_query
    db.session.commit()
    return make_response("", 200)
