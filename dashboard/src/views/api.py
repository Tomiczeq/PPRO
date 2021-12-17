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

    current_app.logger.info("lalalal")
    current_app.logger.info(f"id: {dashboard_id}")

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
    return make_response("", 201)
