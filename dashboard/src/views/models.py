import json
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Datasource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(30))

    def to_dict(self):
        dct = {
            "url": self.url,
        }
        return dct


class Dashboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    timerange = db.Column(db.String(30))

    def __init__(self, name):
        self.name = name
        self.timerange = "3h"


class Row(db.Model):
    id = db.Column(db.String(30), primary_key=True)
    name = db.Column(db.String(30))
    position = db.Column(db.Integer)
    dashboardId = db.Column(
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
            "dashboardId": self.dashboardId,
        }
        return dct

    @staticmethod
    def from_conf(conf):
        row = Row()
        for k, v in conf.items():
            if k in ("charts", "chartsByPos"):
                continue
            else:
                setattr(row, k, v)
        return row


class Chart(db.Model):
    id = db.Column(db.String(30), primary_key=True)
    name = db.Column(db.String(30))
    position = db.Column(db.Integer)
    promQuery = db.Column(db.String(1000))
    step = db.Column(db.String(30))
    instant = db.Column(db.Boolean)
    visualization = db.Column(db.String(2000))

    rowId = db.Column(
            db.String(30),
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
            "rowId": self.rowId,
            "promQuery": self.promQuery,
            "step": self.step,
            "instant": self.instant,
            "visualization": json.loads(self.visualization),
            "style": {
                "width": self.width,
                "min_width": self.min_width,
                "max_width": self.max_width,
                "height": self.height,
                "min_height": self.min_height,
                "max_height": self.max_height,
            }
        }
        return dct

    @staticmethod
    def from_conf(conf):
        chart = Chart()
        for k, v in conf.items():
            if k in ("apexChart", "qstring"):
                continue
            elif k == "style":
                for kk, vv in v.items():
                    setattr(chart, kk, vv)
            elif k == "visualization":
                setattr(chart, k, json.dumps(v))
            else:
                setattr(chart, k, v)
        return chart
