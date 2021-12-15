from flask import Blueprint, render_template

dashboards = Blueprint('dashboards', __name__)


@dashboards.route("/<dashboard_name>", methods=["GET"])
def dashboard_page(dashboard_name):
    return render_template("dashboard.html", dashboard_name=dashboard_name)
