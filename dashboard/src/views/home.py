from flask import Blueprint
from flask import render_template

home = Blueprint('home', __name__,
                 template_folder="../templates/home")


@home.route("/", methods=["GET"])
def home_page():
    return render_template("home.html")


@home.route("/search", methods=["GET"])
def search_page():
    dashboards = ["sentinel" for i in range(100)]
    return render_template("search.html", dashboards=dashboards)
