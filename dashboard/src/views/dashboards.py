from flask import Blueprint, render_template
from flask import abort
from flask import current_app
from views.models import Dashboard
from views.models import Chart

dashboards = Blueprint('dashboards', __name__)


@dashboards.route("/<name>", methods=["GET"])
def dashboard_page(name):
    dashboard = Dashboard.query.filter_by(name=name).first()

    if not dashboard:
        abort(404)

    charts = Chart.query.filter_by(dashboard_id=dashboard.id).all()

    return render_template(
        "dashboard.html", dashboard=dashboard, charts=charts
    )


@dashboards.route("/chart/<chart_id>", methods=["GET"])
def chart_page(chart_id):
    chart = Chart.query.get(chart_id)

    if not chart:
        abort(404)

    return render_template(
        "chart.html", chart=chart
    )
