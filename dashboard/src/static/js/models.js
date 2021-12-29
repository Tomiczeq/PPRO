class Dashboard {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.timerange = "3h";
        this.currentView = "dashboard";
        this.rows = {};
        this.rowsByPos = [];
    }

    init() {
        $.ajax({
            type: "GET",
            url: "/api/getDashboardCharts",
            data: {
                dashboardId: this.id
            },
            success: (response) => {
                this.timerange = response.timerange;
                setTimerange(this.timerange);
                this.initRows(response.rows);
                this.updateCharts();
            },
            error: (e) => {
                this.showError("getDashboardCharts error");
            },
        });
    }

    save() {
        this.actualizePositions();
        $.ajax({
            type: "POST",
            url: "/api/saveDashboard",
            data: {
                dashboard: JSON.stringify(this),
            },
            success: (response) => {
                this.showSaveSucces();
            },
            error: (e) => {
                this.showError("Save error");
            },
        });
    }

    initRows(rowsConf) {
        this.rowsByPos = [];
        var rowIdPositions = [];
        for (var rowId in rowsConf) {
            var rowConf = rowsConf[rowId];
            var newRow = Row.fromConf(rowConf);
            this.rows[newRow.id] = newRow;
            rowIdPositions.push([newRow.id, newRow.position]);
        }
        sortNested(rowIdPositions, 1);
        rowIdPositions.forEach((rowIdPosition) => {
            this.rowsByPos.push(rowIdPosition[0]);
        })

        var rows_container = document.querySelector('.rows_container');
        this.rowsByPos.forEach((rowId) => {
            var rowElem = this.rows[rowId].getHtml();
            rows_container.appendChild(rowElem);
        })

    }

    updateCharts() {
        this.actualizePositions();

        for (var rowId in this.rows) {
            this.rows[rowId].updateCharts();
        }
    }

    static updateChart(qstring, chart) {

    }

    addNewRow() {
        var rowId = createId("row_");
        var rowName = getDefaultName('.row_name', 'New Row');
        var position = 0;
        var newRow = new Row(rowId, rowName, this.id, 0);
        this.rows[rowId] = newRow;

        var rowElem = newRow.getHtml();
        var rowsContainer = document.querySelector(".rows_container");
        rowsContainer.insertBefore(rowElem, rowsContainer.firstChild);

        this.actualizeRowsPosition();
    }

    deleteRow(rowId) {
        document.getElementById(rowId).remove();
        delete this.rows[rowId];
        this.actualizeRowsPosition();
    }

    actualizeRowsPosition() {
        var rows = document.querySelectorAll(".row");
        var position = 0;
        this.rowsByPos = [];

        rows.forEach((row) => {
            this.rowsByPos.push(row.id);
        });

        this.rowsByPos.forEach((rowId, rowPosition) => {
            this.rows[rowId].position = rowPosition; 
        })
    }

    actualizePositions() {
        this.actualizeRowsPosition();
        var charts = {};
        for (var rowId in this.rows) {
            var row = this.rows[rowId];
            for (var chartId in row.charts) {
                charts[chartId] = row.charts[chartId];
            }
            row.charts = {};
        }

        for (var rowId in this.rows) {
            var row = this.rows[rowId];
            var qstring = "#" + rowId + " .chart";
            var chartElems = document.querySelectorAll(qstring);
            chartElems.forEach((chartElem) => {
                row.charts[chartElem.id] = charts[chartElem.id];
                row.charts[chartElem.id].rowId = rowId;
            });
            row.actualizeChartsPosition();
        }
    }

    // TODO
    showError(msg) {
        alert(msg);
    }

    // TODO
    showSaveSucces() {
        alert("Saved");
    }
}


class Row {
    constructor(id, name, dashboardId, position) {
        this.id = id; 
        this.name = name;
        this.dashboardId = dashboardId;
        this.position = position;
        this.charts = {};
        this.chartsByPos = [];
    }

    static fromConf(rowConf) {
        var chartsByPos = [];
        var chartIdPositions = [];
        var newRow = new Row(
            rowConf.id, rowConf.name, rowConf.dashboardId, rowConf.position);
        for (var chartId in rowConf.charts) {
            var chartConf = rowConf.charts[chartId];
            var newChart = Chart.fromConf(chartConf);
            newRow.charts[newChart.id] = newChart;
            chartIdPositions.push([newChart.id, newChart.position]);
        }
        sortNested(chartIdPositions, 1);
        chartIdPositions.forEach((chartIdPosition) => {
            chartsByPos.push(chartIdPosition[0]);
        })
        newRow.chartsByPos = chartsByPos;
        return newRow;
    }

    getHtml() {
        var rowElem = getRowHtml(this);
        $(() => {
            var qstring = "#" + this.id + " .charts_container";
            var chart_container = document.querySelector(qstring);
            $(qstring).sortable({
                connectWith: ".charts_container",
            });
        })
        return rowElem;
    }

    addNewChart() {
        var chartId = createId("chart_");
        var chartName = getDefaultName(".chart_name", "New Chart");
        var position = 0;
        var newChart = new Chart(chartId, chartName, this.id, position);

        var chartElem = newChart.getHtml();
        var qstring = '#' + this.id + " .charts_container";
        var chartsContainer = document.querySelector(qstring);
        chartsContainer.insertBefore(chartElem, chartsContainer.firstChild);

        this.charts[chartId] = newChart;
        this.actualizeChartsPosition();
    }

    updateCharts() {
        for (var chartId in this.charts) {
            this.charts[chartId].update();
        }
    }

    deleteChart(chartId) {
        document.getElementById(chartId).remove();
        delete this.charts[chartId];
        this.actualizeChartsPosition();
    }

    actualizeChartsPosition() {
        var qstring = "#" + this.id + " .charts_container .chart";
        var charts = document.querySelectorAll(qstring); 
        var chartsByPos = [];

        charts.forEach((chart) => {
            chartsByPos.push(chart.id);
        })

        chartsByPos.forEach((chartId, chartPosition) => {
            this.charts[chartId].position = chartPosition;
        })
    }
}


class Chart {
    constructor(id, name, rowId, position) {
        this.id = id;
        this.name = name;
        this.rowId = rowId;
        this.position = position;
        this.promQuery = "";
        this.instant = false;
        this.step = "1m";
        this.style = {
            "width": "20%",
            "min_width": null,
            "max_width": null,
            "height": "200px",
            "min_height": null,
            "max_height": null,
        };
        this.visualization = getDefaultOptions("line");
        this.apexChart = null;
        this.qstring = "#" + id + " .chart_chart";
    }

    static fromConf(chartConf) {
        var newChart = new Chart(
            chartConf.id, chartConf.name, chartConf.rowId, chartConf.position);
        newChart.promQuery = chartConf.promQuery;
        newChart.instant = chartConf.Instant;
        newChart.step = chartConf.step;
        newChart.style = chartConf.style;
        newChart.visualization = chartConf.visualization;
        return newChart;
    }

    getHtml() {
        return getChartHtml(this);
    }

    update() {
        if (!this.promQuery.trim()) {
            return;
        }

        var timeRange = getTimerange();
        var requestConf = {
            "promQuery": this.promQuery,
            "instant": this.instant,
            "step": this.step,
            "start": timeRange[0],
            "end": timeRange[1],
        }

        $.ajax({
            type: "GET",
            url: "/api/prometheusRequest",
            data: {
                requestConf: JSON.stringify(requestConf)
            },
            success: function (response) {
                if (response.status === "ok") {
                    fill(response.data);
                } else {
                    this.showError("chart update error");
                }
            },
            error: function (e) {
                this.showError("chart update error 2");
            },
        });
    }

    fill(data) {
        // need to delete rendered apexchart, because apexChart updateOptions
        // merge old options with new options. This cause problems, because
        // old options are not removed.
        if (this.apexChart) {
            this.apexChart.destroy();
            delete this.apexChart;
        } 

        var chartParams = getChartParams(this, data);
        this.apexChart = new ApexCharts(
                document.querySelector(this.qstring), chartParams);
        this.apexChart.render();
    }

    // TODO
    showError(msg) {
        alert(msg);
    }
}