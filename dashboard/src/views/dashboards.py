from flask import Blueprint, render_template
from flask import abort
from views.models import Dashboard
from views.models import Chart
from views.models import Row

dashboards = Blueprint('dashboards', __name__)


@dashboards.route("/<name>", methods=["GET"])
def dashboard_page(name):
    dashboard = Dashboard.query.filter_by(name=name).first()

    if not dashboard:
        abort(404)

    rows = Row.query.filter_by(dashboard_id=dashboard.id)
    for row in rows:
        row.charts = Chart.query.filter_by(row_id=row.id).all()

    return render_template(
        "dashboard.html", dashboard=dashboard
        # "dashboard.html", dashboard=dashboard, rows=rows
    )


@dashboards.route("/chart/<chart_id>", methods=["GET"])
def chart_page(chart_id):
    chart = Chart.query.get(chart_id)

    if not chart:
        abort(404)

    return render_template(
        "chart.html", chart=chart
    )
