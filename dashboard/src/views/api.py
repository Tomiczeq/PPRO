import uuid
from flask import request
from flask import Blueprint
from flask import make_response
from flask import current_app
from flask import jsonify
from views.models import db
from views.models import Dashboard
from views.models import Chart

api = Blueprint('api', __name__)


@api.route("/getDashboardCharts", methods=["GET"])
def get_dashboard_charts():
    dashboard_id = request.args.get('dashboard_id')

    if not dashboard_id:
        return make_response("Not found\n", 404)

    dashboard = Dashboard.query.get(dashboard_id)
    current_app.logger.info(f"dash: {dashboard}")
    if not dashboard:
        return make_response("Not found\n", 404)

    charts = Chart.query.filter_by(dashboard_id=dashboard.id)
    data = [chart.to_dict() for chart in charts]
    return jsonify(data)


@api.route("/createNewChart", methods=["POST"])
def create_new_chart():
    dashboard_id = request.form.get('dashboard_id')
    dashboard = Dashboard.query.get(dashboard_id)
    if not dashboard:
        return make_response("Not found\n", 404)

    chart = Chart(name="New Chart", dashboard=dashboard)
    db.session.add(chart)
    db.session.commit()
    return make_response(jsonify(chart.to_dict()), 201)


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
