from prometheus_client import Counter, Histogram


class Metrics:

    def __init__(self, app_name):
        self.REQUEST_COUNT = Counter(
                'request_count', 'App Request Count',
                ['app', 'method', 'endpoint', 'status']
        )
        self.app_name = app_name

    def request_count_total(self, method, endpoint, status,
                            increment=1):
        (self.REQUEST_COUNT
             .labels(self.app_name, method, endpoint, status)
             .inc(increment))
