from flask import Blueprint, render_template
from flask_login import login_required
from flask_login import current_user
from flask import abort
from views.models import Dashboard

dashboards = Blueprint('dashboards', __name__)


@dashboards.route("/dashboards/<name>", methods=["GET"])
@login_required
def dashboardPage(name):
    dashboard = Dashboard.query.filter_by(name=name).first()

    if not dashboard:
        abort(404)

    return render_template(
        "dashboard.html", dashboard=dashboard, user=current_user
    )


@dashboards.route("/", methods=["GET"])
@login_required
def homePage():
    dashboards = Dashboard.query.all()
    return render_template("home.html", dashboards=dashboards)
