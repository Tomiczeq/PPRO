// apexCharts in Chart cause TypeError: cyclic object value
function replacer(key,value) {
    if (key==="apexChart") return undefined;
    else return value;
}

class Dashboard {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.timerange = "3h";
        this.currentView = "dashboard";
        this.currentRowId = null;
        this.currentChartId = null;
        this.rows = {};
        this.rowsByPos = [];
        this.url = "";
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
                this.url = response.url;
                this.initRows(response.rows);
                this.updateCharts();
            },
            error: (e) => {
                this.showError("Error");
            },
        });
    }

    save() {
        this.userFav = this.isFav();
        this.actualizePositions();
        $.ajax({
            type: "POST",
            url: "/api/saveDashboard",
            data: {
                dashboard: JSON.stringify(this, replacer),
            },
            success: (response) => {
                this.showSaveSucces();
                window.history.replaceState("", "", '/dashboards/' + this.name);
            },
            error: (e) => {
                this.showError("Save error");
            },
        });
    }

    isFav() {
        return document.getElementById(
            "dashboardFav").classList.contains("favourite");
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

        var rows_container = document.querySelector('.rowsContainer');
        this.rowsByPos.forEach((rowId) => {
            var rowElem = this.rows[rowId].getHtml();
            rows_container.appendChild(rowElem);
        })

    }

    updateCharts() {
        if (this.currentView === "chartconf") {
            updateConfChart();
        } else {
            this.actualizePositions();

            for (var rowId in this.rows) {
                this.rows[rowId].updateCharts();
            }
        }
    }

    addNewRow() {
        var rowId = createId("row_");
        var rowName = getDefaultName('.rowName', 'New Row');
        var position = 0;
        var newRow = new Row(rowId, rowName, this.id, 0);
        this.rows[rowId] = newRow;

        var rowElem = newRow.getHtml();
        var rowsContainer = document.querySelector(".rowsContainer");
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
            var qstring = "#" + rowId + " .chartContainer";
            var chartElems = document.querySelectorAll(qstring);
            chartElems.forEach((chartElem) => {
                row.charts[chartElem.id] = charts[chartElem.id];
                row.charts[chartElem.id].rowId = rowId;
            });
            row.actualizeChartsPosition();
        }
    }

    getCurrentChart() {
        if (!(this.currentChartId && this.currentRowId)) {
            return null;
        }
        return this.rows[this.currentRowId].charts[this.currentChartId];
    }

    showError(msg) {
        document.getElementById("errorArea").textContent = msg;
        $("#errorArea").show();
        $("#errorArea").delay(10000).fadeOut();
    }

    hideError() {
        $("#errorArea").hide();
    }

    showSaveSucces() {
        document.getElementById("successArea").textContent = "saved";
        $("#errorArea").hide();
        $("#successArea").show();
        $("#successArea").delay(5000).fadeOut();
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
        this.hidden = false;
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
        newRow.hidden = rowConf.hidden;
        return newRow;
    }

    getHtml() {
        var rowElem = getRowHtml(this);
        $(() => {
            var qstring = "#" + this.id + " .chartsContainer";
            var chart_container = document.querySelector(qstring);
            $(qstring).sortable({
                connectWith: ".chartsContainer",
            });
        })
        return rowElem;
    }

    addNewChart() {
        var chartId = createId("chart_");
        var chartName = getDefaultName(".chartName", "New Chart");
        var position = 0;
        var newChart = new Chart(chartId, chartName, this.id, position);

        var chartElem = newChart.getHtml();
        var qstring = '#' + this.id + " .chartsContainer";
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
        var qstring = "#" + this.id + " .chartsContainer .chartContainer";
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
            "width": "20vw",
            "minWidth": "150px",
            "maxWidth": null,
            "height": "200px",
            "minHeight": null,
            "maxHeight": null,
        };
        this.visualization = {
            "type": "line",
            "options": getDefaultOptions("line")
        };
        this.apexChart = null;
        this.qstring = "#" + id + " .chart";
        this.chartConfQstring = ".confChart";
    }

    static fromConf(chartConf) {
        var newChart = new Chart(
            chartConf.id, chartConf.name, chartConf.rowId, chartConf.position);
        newChart.promQuery = chartConf.promQuery;
        newChart.instant = chartConf.instant;
        newChart.step = chartConf.step;
        newChart.style = chartConf.style;
        newChart.visualization = chartConf.visualization;
        return newChart;
    }

    getHtml() {
        return getChartHtml(this);
    }

    update() {
        if (!window.dashboard.url) {
            this.showError("Empty datasource url");
            return;
        }

        // need to delete rendered apexchart, because apexChart updateOptions
        // merge old options with new options. This cause problems, because
        // old options are not removed.
        if (this.apexChart) {
            this.apexChart.destroy();
            delete this.apexChart;
            this.apexChart = null;
        } 

        if (!this.promQuery.trim()) {
            return;
        }

        var timeRange = getTimerange();
        var promQuery = this.promQuery.replace(/\$timeRange/g, timeRange[2]);
        var requestConf = {
            "url": window.dashboard.url,
            "promQuery": promQuery,
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
            success: (response, textStatus, xhr) => {
                console.log(textStatus);
                console.log(xhr);
                if (response.status === "ok") {
                    this.fill(response.data);
                } else {
                    this.showError(response.status);
                }
            },
            error: (e) => {
                this.showError("Unexpected Error");
            },
        });
    }

    fill(data) {
        var chartParams = getChartParams(this, data);
        var qstring = this.getQstring();
        this.apexChart = new ApexCharts(
                document.querySelector(qstring), chartParams);
        this.apexChart.render();
    }

    getQstring() {
        if (window.dashboard.currentView === "chartconf") {
            return this.chartConfQstring;
        }
        return this.qstring;
    }

    showError(msg) {
        document.getElementById("errorArea").textContent = msg;
        $("#successArea").hide();
        $("#errorArea").show();
        $("#errorArea").delay(5000).fadeOut();
    }

    hideError() {
        $("#errorArea").hide();
    }
}