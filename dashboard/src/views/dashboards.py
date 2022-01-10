from flask import Blueprint, render_template
from flask import redirect
from flask import url_for
from flask import request
from flask import current_app
from flask_login import login_required
from flask_login import current_user
from flask import abort
from views.models import db
from views.models import Dashboard
from views.models import FavDashboard
from views.models import Chart
from views.models import Row

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

    dashboard = Dashboard(name=dashboardName, url="", timerange="3h")
    db.session.add(dashboard)
    db.session.commit()
    return redirect(url_for('dashboards.dashboardPage', name=dashboard.name))


@dashboards.route('/deleteDashboard', methods=["Post"])
@login_required
def deleteDashboard():
    dashboardId = request.form.get('dashboardId')

    rows = Row.query.filter_by(dashboardId=dashboardId)
    for row in rows:
        charts = Chart.query.filter_by(rowId=row.id)
        for chart in charts:
            db.session.delete(chart)
        db.session.delete(row)

    usersFavourite = (FavDashboard.query
                                  .filter_by(dashboardId=dashboardId)
                                  .all())
    for userFav in usersFavourite:
        db.session.delete(userFav)

    dashboard = Dashboard.query.get(dashboardId)
    db.session.delete(dashboard)
    db.session.commit()
    return redirect(url_for('dashboards.homePage'))


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
