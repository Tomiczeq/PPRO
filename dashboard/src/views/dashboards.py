from flask import Blueprint, render_template
from flask import abort
from flask import current_app
from views.models import Dashboard

dashboards = Blueprint('dashboards', __name__)


@dashboards.route("/<name>", methods=["GET"])
def dashboard_page(name):
    dashboard = Dashboard.query.filter_by(name=name).first()

    if not dashboard:
        abort(404)

    return render_template("dashboard.html", dashboard=dashboard)
