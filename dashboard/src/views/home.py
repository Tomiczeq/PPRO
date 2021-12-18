from flask import request
from flask import redirect
from flask import Blueprint
from flask import render_template
from flask import url_for
from views.models import db
from views.models import Dashboard

home = Blueprint('home', __name__)


@home.route("/", methods=["GET"])
def home_page():
    return render_template("home.html")


@home.route("/search", methods=["GET"])
def search_page_get():
    dashboards = Dashboard.query.all()
    return render_template("search.html", dashboards=dashboards)


@home.route("/create", methods=["GET"])
def create_get():
    return render_template("create.html")

@home.route("/create", methods=["POST"])
def create_post():
    name = request.form.get('name')
    exists = Dashboard.query.filter_by(name=name).first() is not None
    if exists:
        return redirect(
            url_for('home.create_get') + "?alreadyExists=1"
        )
    else:
        new_dashboard = Dashboard(name)
        db.session.add(new_dashboard)
        db.session.commit()
        return redirect(
            url_for('dashboards.dashboard_page', dashboard_name=name)
        )

    return name + " " + str(exists) + "\n"
