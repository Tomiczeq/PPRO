from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Dashboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))

    def __init__(self, name):
        self.name = name


class Row(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    position = db.Column(db.Integer)
    dashboard_id = db.Column(
            db.Integer,
            db.ForeignKey('dashboard.id'),
            nullable=False
    )
    dashboard = db.relationship(
            'Dashboard',
            backref=db.backref('rows', lazy=True)
    )

    def to_dict(self):
        dct = {
            "id": self.id,
            "name": self.name,
            "position": self.position,
            "dashboard_id": self.dashboard_id,
            "charts": [],
        }
        return dct


class Chart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    position = db.Column(db.Integer)
    prom_query = db.Column(db.String(30))
    row_id = db.Column(
            db.Integer,
            db.ForeignKey('row.id'),
            nullable=False
    )
    row = db.relationship(
            'Row',
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
            "position": self.position,
            "width": self.width,
            "min_width": self.min_width,
            "max_width": self.max_width,
            "height": self.height,
            "min_height": self.min_height,
            "max_height": self.max_height,
            "prom_query": self.prom_query,
            "row_id": self.row_id
        }
        return dct
