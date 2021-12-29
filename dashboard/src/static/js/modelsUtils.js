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
        window.dashboard.curentChart = chart;
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
