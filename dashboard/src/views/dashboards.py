from flask import Blueprint, render_template
from flask import redirect
from flask import url_for
from flask_login import login_required
from flask_login import current_user
from flask import abort
from views.models import db
from views.models import Dashboard
from views.models import FavDashboard

dashboards = Blueprint('dashboards', __name__)


@dashboards.route("/dashboards/<name>", methods=["GET"])
@login_required
def dashboardPage(name):
    dashboard = Dashboard.query.filter_by(name=name).first()

    if not dashboard:
        abort(404)

    favourite = (FavDashboard.query
                             .filter_by(userId=current_user.id)
                             .filter_by(dashboardId=dashboard.id)
                             .first())

    return render_template(
        "dashboard.html", dashboard=dashboard, user=current_user,
        favourite=bool(favourite)
    )


@dashboards.route("/createNewDashboard", methods=["POST"])
@login_required
def createDashboard():

    name = "New Dashboard"
    i = 0
    dashboardName = ""
    while True:
        dashboardName = name + " " + str(i)
        if not Dashboard.query.filter_by(name=dashboardName).first():
            break
        i += 1

    dashboard = Dashboard(name=dashboardName)
    db.session.add(dashboard)
    db.session.commit()
    return redirect(url_for('dashboards.dashboardPage', name=dashboard.name))


@dashboards.route("/", methods=["GET"])
@login_required
def homePage():
    dashboards = Dashboard.query.all()

    for dashboard in dashboards:
        favourite = (FavDashboard.query
                                 .filter_by(userId=current_user.id)
                                 .filter_by(dashboardId=dashboard.id)
                                 .first())
        dashboard.favourite = bool(favourite)

    return render_template(
        "home.html", dashboards=dashboards, user=current_user
    )
