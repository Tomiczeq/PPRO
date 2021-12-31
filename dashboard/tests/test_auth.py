from views.models import db
from views.models import User


def login(client, username, password, follow_redirects=True):
    data = dict()
    if username is not None:
        data["username"] = username
    if password is not None:
        data["password"] = password
    return client.post('/login', data=data, follow_redirects=follow_redirects)


def signup(client, username, password, follow_redirects=True):
    data = dict()
    if username is not None:
        data["username"] = username
    if password is not None:
        data["password"] = password
    return client.post('/signUp', data=data, follow_redirects=follow_redirects)


def logout(client):
    return client.get('/logout', follow_redirects=True)


def test_login_get(flask_app):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/login' page is requested (GET)
    THEN check that the response is valid
    """

    test_data = b'<form class="loginForm" method="POST" action="/login">'

    with flask_app.test_client() as test_client:
        response = test_client.get('/login')
        assert response.status_code == 200
        assert test_data in response.data


def test_login_post(flask_app):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/login' page is requested (POST)
    THEN check that the responses are valid
    """

    username = "ennie"
    password = "ennie"

    with flask_app.test_client() as test_client:
        with flask_app.app_context():
            user = User(username, password)
            db.session.add(user)
            db.session.commit()

        response = login(test_client, None, None)
        assert b"Invalid credentials" in response.data
        response = login(test_client, "aaaa", "bbbb")
        assert b"Invalid credentials" in response.data
        response = login(test_client, username, password)
        assert b"Invalid credentials" not in response.data
        assert b"ennie" in response.data


def test_singup_get(flask_app):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/signUp' page is requested (GET)
    THEN check that the response is valid
    """
    test_data = b'<form class="loginForm" method="POST" action="/signUp">'

    with flask_app.test_client() as test_client:
        response = test_client.get('/signUp')
        assert response.status_code == 200
        assert test_data in response.data
    pass


def test_singup_post(flask_app):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/signUp' page is requested (GET)
    THEN check that the response is valid
    """
    username = "ennie"
    password = "ennie"

    with flask_app.test_client() as test_client:
        response = signup(test_client, None, None)
        assert b"Empty username" in response.data
        response = signup(test_client, "", "")
        assert b"Empty username" in response.data
        response = signup(test_client, username, None)
        assert b"Empty password" in response.data
        response = signup(test_client, username, password)
        assert b"You have successfully signed up" in response.data
        response = signup(test_client, username, password)
        assert f"User {username} already exists".encode() in response.data
    pass


def test_logout(flask_app):
    username = "ennie"
    password = "ennie"

    with flask_app.test_client() as test_client:
        with flask_app.app_context():
            user = User(username, password)
            db.session.add(user)
            db.session.commit()
        login(test_client, username, password)
        response = logout(test_client)
        assert b"You have been successfully logged out" in response.data
