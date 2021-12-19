from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Dashboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))

    def __init__(self, name):
        self.name = name


# TODO
class Row(db.Model):
    pass


class Chart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    prom_query = db.Column(db.String(30))
    dashboard_id = db.Column(
            db.Integer,
            db.ForeignKey('dashboard.id'),
            nullable=False
    )
    dashboard = db.relationship(
            'Dashboard',
            backref=db.backref('charts', lazy=True)
    )

    width = db.Column(db.String(30), default="20%")
    min_width = db.Column(db.String(30))
    max_width = db.Column(db.String(30))
    height = db.Column(db.String(30), default="200px")
    min_height = db.Column(db.String(30))
    max_height = db.Column(db.String(30))

    def to_dict(self):
        dct = {
            "id": self.id,
            "name": self.name,
            "width": self.width,
            "min_width": self.min_width,
            "max_width": self.max_width,
            "height": self.height,
            "min_height": self.min_height,
            "max_height": self.max_height,
            "prom_query": self.prom_query,
            "dashboard_id": self.dashboard_id
        }
        return dct
