function getRowHtml(row) {
    var rowElem = document.createElement('div');
    var rowHeader = document.createElement('div');
    var rowName = document.createElement('span');
    var chartsContainer = document.createElement('div');

    var showBtn = get_icon("fas fa-chevron-right", null);
    var hideBtn = get_icon("fas fa-chevron-down", null);
    var addChartBtn = get_icon("fas fa-plus", null);
    var deleteRowBtn = get_icon("fas fa-trash", null);

    showBtn.style.display = "none";
    showBtn.addEventListener("click", () => {
        showBtn.style.display = "none";
        hideBtn.style.display = "";
        chartsContainer.style.display = "";
    });
    hideBtn.addEventListener("click", () => {
        showBtn.style.display = "";
        hideBtn.style.display = "none";
        chartsContainer.style.display = "none";
    });

    addChartBtn.addEventListener("click", () => {
        row.addNewChart();
    });
    deleteRowBtn.addEventListener("click", () => {
        window.dashboard.deleteRow(row.id);
    });

    rowElem.classList.add('row');
    rowHeader.classList.add('row_header');
    rowName.classList.add('row_name');
    chartsContainer.classList.add('charts_container');

    rowElem.id = row.id;
    rowName.textContent = row.name;
    rowHeader.appendChild(rowName);
    rowHeader.appendChild(showBtn);
    rowHeader.appendChild(hideBtn);
    rowHeader.appendChild(addChartBtn);
    rowHeader.appendChild(deleteRowBtn);
    rowElem.appendChild(rowHeader);

    row.chartsByPos.forEach((chartId) => {
        var chartElem = row.charts[chartId].getHtml();
        chartsContainer.appendChild(chartElem);
    });

    rowElem.appendChild(chartsContainer);
    return rowElem;
}

function getChartHtml(chart) {
    var chartElem = document.createElement('div');
    var chartNav = document.createElement('div');
    var chartChart = document.createElement('div');
    var chartName = document.createElement('span');
    var chartIcon = document.createElement('span');
    var chartIconI = document.createElement('i');

    chartElem.classList.add('chart');
    chartNav.classList.add('chart_nav');
    chartChart.classList.add('chart_chart');
    chartName.classList.add('chart_name');
    chartIcon.classList.add('icon_btn');
    chartIconI.classList.add('fas');
    chartIconI.classList.add('fa-cog');

    chartElem.id = chart.id;
    chartName.textContent = chart.name;

    for (var styleKey in chart.style) {
        var styleValue = chart.style[styleKey];
        if (styleValue) {
            chartElem.style[styleKey] = styleValue;
        }
    }
    chartIcon.addEventListener("click", () => {
        window.dashboard.currentView = "chartconf";
        window.dashboard.currentChartId = chart.id;
        window.dashboard.currentRowId = chart.rowId;
        showChartSettings(chart)
    });

    chartIcon.appendChild(chartIconI);
    chartNav.appendChild(chartName);
    chartNav.appendChild(chartIcon);
    chartElem.appendChild(chartNav)
    chartElem.appendChild(chartChart)

    return chartElem;
}

function get_icon(cls, id) {
    var span = document.createElement('span');
    span.classList.add('icon_btn');

    if (id) {
        span.id = id;
    }

    var chart_icon = document.createElement('i');
    chart_icon.className = cls;
    span.appendChild(chart_icon);
    return span
}

function getDefaultOptions(type) {
    var options = null;
    switch(type) {
        case "line": case "column":
            options = {
                "curve": "straight",
                "lineWidth": 5,
                "type": "line",
                "stacked": false,
                "legend": "",
                "units": 'numeric'
            }
            break;
        case "area":
            options = {
                "curve": "straight",
                "lineWidth": 5,
                "type": "line",
                "stacked": false,
                "legend": "",
                "units": 'numeric',
                "fill" : {
                    "type": 'solid'
                }
            }
            break;
        case "pie": case "donut":
            options = {
                "legend": "",
            }
            break;
        case "heatmap":
            options = {
                "legend": "",
                "colors": ["#008FFB"],
                "units": 'datetime'
            }
            break;
        default:
            // TODO
            alert("Unknown chart type");
    }

    return options;
}

function sortNested(nestedArr, index) {
    nestedArr.sort((a, b) => {
        return a[index] - b[index];
    });
}

function setTimerange(timerange) {
    document.getElementById("query_last").value = timerange.trim();
}

function getTimerange(timerange) {
    var start_date = new Date();
    var end_date = new Date();

    var last = document.getElementById("query_last").value;

    var timerange_type = last.replace(/[0-9]/g, '');
    var timerange_number = last.replace(/[^0-9.]/g, '');
    timerange_number = parseInt(timerange_number);

    switch(timerange_type) {
        case "m":
            start_date.setMinutes(start_date.getMinutes() - timerange_number);
            break
        case "h":
            start_date.setHours(start_date.getHours() - timerange_number);
            break
        case "d":
            start_date.setDate(start_date.getDate() - timerange_number);
            break
        default:
            alert("Unknown timerange type: " + timerange_type);
    }
    var start_f = start_date.toISOString();
    var end_f = end_date.toISOString();

    return [start_f, end_f];
}

function createId(prefix){
    var id = prefix + Math.random().toString(36).substr(2, 10);
    return id;
}

function getDefaultName(identifier, substring) {
    var elems = document.querySelectorAll(identifier);
    var i = 0;
    var searched = "";

    while (true) {
        searched = substring + " " + i.toString();
        var found = false;
        elems.forEach((elem) => {
            if (elem.textContent.trim() === searched) {
                i += 1;
                found = true;
            }
        })
        if (!found) {
            break;
        }
    }
    return searched;
}

function getCommonParams() {
    chartParams = {
        chart: {
            animations: { enabled: false},
            redrawOnParentResize: true,
            width: '100%',
            height: '100%',
            toolbar: {
                show: false,
                offsetx: 0,
                offsety: 0,
                tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                    customicons: []
                },
                autoselected: 'zoom' 
            },
        },
        dataLabels: {
            enabled: false
        },
        // tooltip: {
        //     enabled: false
        // },
        grid: {
            show: false
        },
    }
    return chartParams;
}

function getChartParams(chart, promData) {
    var chartType = chart.visualization.type;
    var chartOptions = chart.visualization.options;
    console.log("chart.visualization");
    console.log(chart.visualization);
    var chartParams = getCommonParams();

    var chartLegend = chartOptions.legend.trim();
    var showLegend = false;

    if (chartLegend) {
        showLegend = true;
    }

    switch(chartType) {
        case "line": case "column":
            var stroke = {
                curve: chartOptions.curve,
                width: chartOptions.lineWidth
            };

            var legend = {
                show: showLegend,
            };
            var xaxis = {
                type: chartOptions.units
            };

            chartParams.stroke = stroke;
            chartParams.legend = legend;
            chartParams.xaxis = xaxis;
            chartParams.chart.stacked = chartOptions.stacked;
            break;
        case "area":
            var stroke = {
                curve: chartOptions.curve,
                width: chartOptions.lineWidth
            };
            var legend = {
                show: showLegend,
            };
            var xaxis = {
                type: chartOptions.units
            };
            fill = chartOptions.fill;

            chartParams.stroke = stroke;
            chartParams.legend = legend;
            chartParams.xaxis = xaxis;
            chartParams.chart.stacked = chartOptions.stacked;
            chartParams.chart.type = chartType
            break;
        case "pie": case "donut":
            var legend = {
                show: showLegend,
            };
            chartParams.legend = legend;
            chartParams.chart.type = chartType
            break;
        case "heatmap":
            var legend = {
                show: showLegend,
            };
            var xaxis = {
                type: chartOptions.units
            };
            chartParams.legend = legend;
            chartParams.colors = chartOptions.colors;
            chartParams.xaxis = xaxis;
            chartParams.chart.type = chartType;
            break;
        default:
            // TODO
            alert("get_chartParams Unknown chart type: " + chartType);
    } 
    fillData(chartType, chartOptions, chartParams, promData);
    return chartParams;
}

function correct_units(units, values) {
    
    switch(units) {
        case "numeric":
            break;
        case "datetime":
            for (let i = 0; i < values.length; i++) {
                values[i][0] *= 1000;
            } 
            break;
        default:
            alert("Unknown units: " + units
                                    + ". Return default values");
    }

    return values;
} 

function fillData(chartType, chartOptions, chartParams, promData) {
    if (promData.status != "success") {
        // TODO
        alert("prom query err");
        return;
    }

    var data = promData.data;
    switch(chartType) {
        case "line": case "column":
            if (data.resultType !== "matrix") {
                // TODO
                alert("bad data format");
            }

            var series = []
            data.result.forEach((result) => {
                correct_units(chartParams.xaxis.type, result.values);
                var serie = {
                    type: chartType,
                    data: result.values
                }
                if (chartParams.legend.show) {
                    var legend_name = chartOptions.legend.trim();
                    if (!legend_name) {
                        // TODO
                        alert("legend name should not be empty");
                    }

                    if (legend_name in result.metric) {
                        var legend_value = result.metric[legend_name];
                        serie.name = legend_value;
                    } else {
                        // TODO
                        alert("legend_name not found in data");
                    }
                }
                series.push(serie);
            })
            chartParams.series = series;
            break;
        case "area":
            if (data.resultType !== "matrix") {
                // TODO
                alert("bad data format");
            }

            var series = []
            data.result.forEach((result) => {
                correct_units(chartParams.xaxis.type, result.values);
                var serie = {
                    data: result.values
                }
                if (chartParams.legend.show) {
                    var legend_name = chartOptions.legend.trim();
                    if (!legend_name) {
                        // TODO
                        alert("legend name should not be empty");
                    }

                    if (legend_name in result.metric) {
                        var legend_value = result.metric[legend_name];
                        serie.name = legend_value;
                    } else {
                        // TODO
                        alert("legend_name not found in data");
                    }
                }
                series.push(serie);
            })
            chartParams.series = series;
            break;
        case "pie": case "donut":
            if (data.resultType != "vector") {
                // TODO
                alert("bad data format");
            }

            var series = []
            var labels = []

            data.result.forEach((result) => {
                series.push(parseFloat(result.value[1]));
                if (chartParams.legend.show) {
                    var legend_name = chartOptions.legend.trim();
                    if (!legend_name) {
                        // TODO
                        alert("legend name should not be empty");
                    }

                    if (legend_name in result.metric) {
                        var legend_value = result.metric[legend_name];
                        labels.push(legend_value);
                    } else {
                        // TODO
                        alert("legend_name not found in data");
                    }
            }

            });

            chartParams.series = series;
            chartParams.labels = labels;
            break;
        case "heatmap":
            if (data.resultType !== "matrix") {
                // TODO
                alert("bad data format");
            }

            var series = []
            data.result.forEach((result) => {
                correct_units(chartParams.xaxis.type, result.values);
                var serie = {
                    data: result.values
                }
                if (chartParams.legend.show) {
                    var legend_name = chartOptions.legend.trim();
                    if (!legend_name) {
                        // TODO
                        alert("legend name should not be empty");
                    }

                    if (legend_name in result.metric) {
                        var legend_value = result.metric[legend_name];
                        console.log("legend_value: " + legend_value);
                        serie.name = legend_value;
                    } else {
                        // TODO
                        alert("legend_name not found in data");
                    }
                }
                series.push(serie);
            })
            chartParams.series = series;
            break;
        default:
            // TODO
            alert("fill_chart Unknown chart type: " + chartType);
    }
}