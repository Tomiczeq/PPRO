from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Dashboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))

    def __init__(self, name):
        self.name = name


class Chart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    dashboard_id = db.Column(
            db.Integer,
            db.ForeignKey('dashboard.id'),
            nullable=False
    )
    dashboard = db.relationship(
            'Dashboard',
            backref=db.backref('charts', lazy=True)
    )

    def to_dict(self):
        dct = {
            "id": self.id,
            "name": self.name,
            "dashboard_id": self.dashboard_id
        }
        return dct
