from flask import Blueprint
from flask import render_template

home = Blueprint('home', __name__,
                 template_folder="../templates/home")


@home.route("/", methods=["GET"])
def homepage():
    return render_template("home.html")
