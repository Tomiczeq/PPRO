function showError(msg) {
    document.getElementById("errorArea").textContent = msg;
    $("#successArea").hide();
    $("#errorArea").show();
    $("#errorArea").delay(10000).fadeOut();
}

function hideError() {
    $("#errorArea").hide();
}

function getRowHtml(row) {
    var rowElem = document.createElement('div');
    var rowHeader = document.createElement('div');
    var rowHeaderLeft = document.createElement('div');
    var rowHeaderRight = document.createElement('div');
    var rowMoveHandle = document.createElement('div');
    var rowName = document.createElement('div');
    var chartsContainer = document.createElement('div');

    // rowName.ondblclick = "this.contentEditable=true;this.className='inEdit';";
    rowName.addEventListener("dblclick", () => {
        rowName.contentEditable = true;
    })
    rowName.addEventListener("blur", () => {
        rowName.contentEditable = false;
        row.name = rowName.textContent.trim();
    })
    rowName.addEventListener("keydown", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            rowName.blur();
        }
    }); 

    var showBtn = get_icon("fas fa-chevron-right", null);
    var hideBtn = get_icon("fas fa-chevron-down", null);
    var addChartBtn = get_icon("fas fa-plus", null);
    var deleteRowBtn = get_icon("fas fa-trash", null);
    showBtn.classList.add("rowIcon");
    hideBtn.classList.add("rowIcon");
    addChartBtn.classList.add("rowIcon");
    deleteRowBtn.classList.add("rowIcon");

    showBtn.classList.toggle("hidden");
    showBtn.addEventListener("click", () => {
        showBtn.classList.toggle("hidden");
        hideBtn.classList.toggle("hidden");
        addChartBtn.classList.toggle("hidden");
        chartsContainer.classList.toggle("hidden");
        row.hidden = false;
    });
    hideBtn.addEventListener("click", () => {
        showBtn.classList.toggle("hidden");
        hideBtn.classList.toggle("hidden");
        addChartBtn.classList.toggle("hidden");
        chartsContainer.classList.toggle("hidden");
        row.hidden = true;
    });

    if (row.hidden) {
        hideBtn.click();
    }

    addChartBtn.addEventListener("click", () => {
        row.addNewChart();
    });
    deleteRowBtn.addEventListener("click", () => {
        window.dashboard.deleteRow(row.id);
    });

    rowElem.classList.add('row');
    rowHeader.classList.add('rowHeader');
    rowHeaderLeft.classList.add('rowHeaderLeft');
    rowHeaderRight.classList.add('rowHeaderRight');
    rowMoveHandle.classList.add('rowMoveHandle');
    rowName.classList.add('rowName');
    chartsContainer.classList.add('chartsContainer');

    rowElem.id = row.id;
    rowName.textContent = row.name;
    rowHeaderLeft.appendChild(rowMoveHandle);
    rowHeaderLeft.appendChild(rowName);
    rowHeaderLeft.appendChild(showBtn);
    rowHeaderLeft.appendChild(hideBtn);
    rowHeaderLeft.appendChild(addChartBtn);
    rowHeaderRight.appendChild(deleteRowBtn);

    rowHeader.appendChild(rowHeaderLeft);
    rowHeader.appendChild(rowHeaderRight);
    rowElem.appendChild(rowHeader);

    row.chartsByPos.forEach((chartId) => {
        var chartElem = row.charts[chartId].getHtml();
        chartsContainer.appendChild(chartElem);
    });

    rowElem.appendChild(chartsContainer);
    return rowElem;
}

function getChartHtml(chart) {
    var chartContainer = document.createElement('div');
    var chartNav = document.createElement('div')
    var chartIcons = document.createElement('div')
    var chartWrapper = document.createElement('div')
    var chartElem = document.createElement('div')

    var chartSpace = document.createElement('span');
    var chartName = document.createElement('span');
    var chartCfg = document.createElement('span');
    var chartDel = document.createElement('span');

    var chartCfgI = document.createElement('i');
    var chartDelI = document.createElement('i');

    chartContainer.classList.add("chartContainer");
    chartNav.classList.add("chartNav");
    chartIcons.classList.add("chartIcons");
    chartWrapper.classList.add("chartWrapper");
    chartElem.classList.add("chart");

    chartName.classList.add("chartName");
    chartCfg.classList.add("button");
    chartCfg.classList.add("iconBtn");
    chartCfg.classList.add("chartIcon");
    chartCfgI.classList.add("fas");
    chartCfgI.classList.add("fa-cog");
    chartDel.classList.add("button");
    chartDel.classList.add("iconBtn");
    chartDel.classList.add("chartIcon");
    chartDelI.classList.add("fas");
    chartDelI.classList.add("fa-trash");

    chartContainer.id = chart.id;
    chartName.textContent = chart.name;

    for (var styleKey in chart.style) {
        var styleValue = chart.style[styleKey];
        if (styleValue) {
            chartWrapper.style[styleKey] = styleValue;
        }
    }
    chartNav.style.width = chart.style.width;
    if (chart.style.minWidth) {
        chartNav.style.minWidth = chart.style.minWidth;
    }
    if (chart.style.maxWidth) {
        chartNav.style.maxWidth = chart.style.maxWidth;
    }

    chartCfg.addEventListener("click", () => {
        window.dashboard.currentView = "chartconf";
        window.dashboard.currentChartId = chart.id;
        window.dashboard.currentRowId = chart.rowId;
        showChartSettings(chart)
    });
    chartDel.addEventListener("click", () => {
        window.dashboard.actualizePositions();
        var row = window.dashboard.rows[chart.rowId];
        row.deleteChart(chart.id);
    });

    chartWrapper.appendChild(chartElem);
    chartCfg.appendChild(chartCfgI);
    chartDel.appendChild(chartDelI);
    chartIcons.appendChild(chartCfg);
    chartIcons.appendChild(chartDel);
    chartNav.appendChild(chartSpace);
    chartNav.appendChild(chartName);
    chartNav.appendChild(chartIcons);
    chartContainer.appendChild(chartNav);
    chartContainer.appendChild(chartWrapper);
    return chartContainer;
}

function get_icon(cls, id) {
    var span = document.createElement('span');
    span.classList.add('button');
    span.classList.add('iconBtn');

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
            showError("Error");
    }

    return options;
}

function sortNested(nestedArr, index) {
    nestedArr.sort((a, b) => {
        return a[index] - b[index];
    });
}

function setTimerange(timerange) {
    document.getElementById("queryLast").textContent = timerange.trim();
}

function getTimerange(timerange) {
    var start_date = new Date();
    var end_date = new Date();

    var last = document.getElementById("queryLast").textContent.trim();

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
            console.log("Unknown timerange type: " + timerange_type);
    }
    var start_f = start_date.toISOString();
    var end_f = end_date.toISOString();

    return [start_f, end_f, last];
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
            foreColor: '#4b97d4',
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
                type: chartOptions.units,
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
            console.log("get_chartParams Unknown chart type: " + chartType);
    } 
    fillData(chart, chartType, chartOptions, chartParams, promData);
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
            showError("Wrong units");
    }

    return values;
} 

function fillData(chart, chartType, chartOptions, chartParams, promData) {
    if (promData.status != "success") {
        chart.showError("promQuery error");
        return;
    }

    var data = promData.data;
    switch(chartType) {
        case "line": case "column":
            if (data.resultType !== "matrix") {
                chart.showError("bad data format");
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
                        chart.showError("Wrong legend");
                    }

                    if (legend_name in result.metric) {
                        var legend_value = result.metric[legend_name];
                        serie.name = legend_value;
                    } else {
                        chart.showError("Wrong legend");
                    }
                }
                series.push(serie);
            })
            chartParams.series = series;
            break;
        case "area":
            if (data.resultType !== "matrix") {
                chart.showError("bad data format");
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
                        chart.showError("Wrong legend");
                    }

                    if (legend_name in result.metric) {
                        var legend_value = result.metric[legend_name];
                        serie.name = legend_value;
                    } else {
                        chart.showError("Wrong legend");
                    }
                }
                series.push(serie);
            })
            chartParams.series = series;
            break;
        case "pie": case "donut":
            if (data.resultType != "vector") {
                chart.showError("bad data format");
            }

            var series = []
            var labels = []

            data.result.forEach((result) => {
                series.push(parseFloat(result.value[1]));
                if (chartParams.legend.show) {
                    var legend_name = chartOptions.legend.trim();
                    if (!legend_name) {
                        chart.showError("Wrong legend");
                    }

                    if (legend_name in result.metric) {
                        var legend_value = result.metric[legend_name];
                        labels.push(legend_value);
                    } else {
                        chart.showError("Wrong legend");
                    }
            }

            });

            chartParams.series = series;
            chartParams.labels = labels;
            break;
        case "heatmap":
            if (data.resultType !== "matrix") {
                chart.showError("bad data format");
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
                        chart.showError("Wrong legend");
                    }

                    if (legend_name in result.metric) {
                        var legend_value = result.metric[legend_name];
                        serie.name = legend_value;
                    } else {
                        chart.showError("Wrong legend");
                    }
                }
                series.push(serie);
            })
            chartParams.series = series;
            break;
        default:
            console.log("fill_chart Unknown chart type: " + chartType);
    }
}