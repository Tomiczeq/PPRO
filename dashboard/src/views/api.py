import uuid
from flask import request
from flask import Blueprint

api = Blueprint('api', __name__)


def get_mock_chart():
    mock_chart = {
        "chart_id": uuid.uuid1(),
        "chart_name": "SuperChart",
        "dashboard_id": "12345",
        "height": "200",
        "width": "300",
        "query": "nejake query"
    }
    return mock_chart


@api.route("/getDashboardCharts", methods=["GET"])
def get_dashboard_charts():
    dashboard_id = request.args.get('dashboard_id')

    # return error if there is no dashboard id parameter
    if not dashboard_id:
        return 'Not found\n', 400

    charts = [get_mock_chart() for i in range(3)]
    print(charts)

    data = {
        "charts": charts
    }
    return data
