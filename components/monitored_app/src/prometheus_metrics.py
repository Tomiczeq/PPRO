from prometheus_client import Counter
from prometheus_client import Gauge
from prometheus_client import Histogram


# TODO mozna pouzit zabudovane decoratory
class Metrics:

    def __init__(self, app_name):
        self.HISTOGRAM = Histogram(
                'request_duration_seconds', 'track requests duration',
                ['app', 'method', 'endpoint', 'status'],
                buckets=[0.01, 0.05, 0.1, 0.5]
        )
        self.COUNTER = Counter(
                'errors_total', 'count number of errors',
                ['app', 'type']
        )
        self.app_name = app_name

    def request_duration_seconds(self, method, endpoint, status, duration):

        (self.HISTOGRAM
             .labels(self.app_name, method, endpoint, status)
             .observe(duration))

    def errors_total(self, err_type, increment=1):

        self.COUNTER.labels(self.app_name, err_type).inc(increment)
