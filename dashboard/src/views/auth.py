from flask import Blueprint
from flask import render_template
from flask import flash
from flask import redirect
from flask import url_for
from flask import request

from flask_login import login_user
from flask_login import login_required
from flask_login import logout_user
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

from views.models import User
from views.models import db


auth = Blueprint('auth', __name__)


@auth.route('/login', methods=["GET"])
def loginGet():
    return render_template("login.html")


@auth.route('/login', methods=["Post"])
def loginPost():
    username = request.form.get('username')
    password = request.form.get('password')

    user = User.query.filter_by(username=username).first()

    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it
    # to the hashed password in the database
    if not user or not check_password_hash(user.password, password):
        flash('Invalid credentials')
        return redirect(url_for('auth.loginGet'))

    login_user(user)
    return redirect(url_for('dashboards.homePage'))


@auth.route('/signUp', methods=["GET"])
def signUpGet():
    return render_template("signup.html")


@auth.route('/signUp', methods=["POST"])
def signUpPost():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username:
        flash("Empty username")
        return redirect(url_for('auth.signUpGet'))

    if not password:
        flash("Empty password")
        return redirect(url_for('auth.signUpGet'))

    user = User.query.filter_by(username=username).first()
    if user:
        flash(f"user {username} already exists")
        return redirect(url_for('auth.signUpGet'))

    newUser = User(username=username,
                   password=generate_password_hash(password, method='sha256'))

    db.session.add(newUser)
    db.session.commit()
    return redirect(url_for('auth.loginGet'))


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.loginGet'))
