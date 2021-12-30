function hideChartSettings() {
    var back_btn = document.getElementById("back_btn");
    back_btn.classList.remove("icon_btn");
    back_btn.classList.add("hidden");

    // unhighlight chart visualization
    var visCharts = document.querySelectorAll(".chart_vis");
    visCharts.forEach((visChart) => {
        visChart.classList.remove("icon_btn_selected");
        visChart.classList.add("icon_btn");
    });

    document.querySelector(".rows_container").style.display = "block";
    document.querySelector(".chartconf_container").style.display = "none";
}

// TODO
function showChartSettings(chart) {

    // show back button
    var back_btn = document.getElementById("back_btn");
    back_btn.classList.remove("hidden");
    back_btn.classList.add("icon_btn");

    // fill some general options
    document.querySelector("#prom_query").value = chart.promQuery;
    document.querySelector("#query_legend").value = 
            chart.visualization.options.legend;
    document.querySelector("#query_step").value = chart.step;
    document.querySelector("#query_type").checked = chart.instant;

    document.querySelector(".rows_container").style.display = "none";
    document.querySelector(".chartconf_container").style.display = "block";


    // highlight chart visualization
    var visCharts = document.querySelectorAll(".chart_vis");
    visCharts.forEach((visChart) => {
        var chartType = visChart.id.replace("_chart_btn", "").trim();
        if (chartType === chart.visualization.type) {
            visChart.classList.remove("icon_btn");
            visChart.classList.add("icon_btn_selected");
        }
    });

    // fill units
    var xaxisUnits = document.getElementById("xaxis_units");
    xaxisUnits.value = chart.visualization.options.units;
    updateConfChart();
}

function updateConfChart() {
    var currentChart = window.dashboard.getCurrentChart();
    var container = document.querySelector(
            ".chartconf_chart_container");
    for (var styleKey in currentChart.style) {
        var styleValue = currentChart.style[styleKey];
        if (styleValue) {
            container.style[styleKey] = styleValue;
        }
    }
    currentChart.update();
}


function init_dashconf() {
    // back to dashboard button
    var backBtn = document.getElementById("back_btn");
    backBtn.addEventListener("click", () => {
        hideChartSettings();
        window.dashboard.currentView = "dashboard";
        var currentChart = window.dashboard.getCurrentChart();
        currentChart.update();
    });

    // init chartconf navigation
    var chartconf_nav_items = document.querySelectorAll(".chartconf_nav_li");
    var chartconf_containers = document.querySelectorAll(
            ".chartconf_content_hidden");
    chartconf_nav_items.forEach((nav_item) => {

        nav_item.addEventListener("click", () => {

            chartconf_containers.forEach((chartconf_container) => {
                chartconf_container.classList.remove(
                        "chartconf_content_hidden");
                chartconf_container.classList.remove(
                        "chartconf_content");
                chartconf_container.classList.add(
                        "chartconf_content_hidden");
            })

            var current_container_id = nav_item.id.replace(
                    "btn", "container").trim();
            var current_container = document.getElementById(
                    current_container_id);
            current_container.classList.remove("chartconf_content_hidden");
            current_container.classList.add("chartconf_content");

        })
    })
    chartconf_nav_items.forEach((li_item) => {
        li_item.addEventListener("click", () => {

            chartconf_nav_items.forEach((item) => {
                item.classList.remove("chartconf_nav_li");
                item.classList.remove("chartconf_nav_li_selected");
                item.classList.add("chartconf_nav_li");
            })
            li_item.classList.remove("chartconf_nav_li");
            li_item.classList.remove("chartconf_nav_li_selected");
            li_item.classList.add("chartconf_nav_li_selected");
        })
    })

    // general section init
    var queryInput = document.getElementById("prom_query");
    queryInput.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            var currentChart = window.dashboard.getCurrentChart();
            currentChart.promQuery = queryInput.value.trim();
            updateConfChart();
        }
    }); 

    var queryStep = document.getElementById("query_step");
    queryStep.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            var currentChart = window.dashboard.getCurrentChart();
            currentChart.step = queryStep.value.trim();
            updateConfChart();
        }
    }); 

    var queryLegend = document.getElementById("query_legend");
    queryLegend.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            var currentChart = window.dashboard.getCurrentChart();
            var legend = queryLegend.value.trim();
            currentChart.visualization.options.legend = legend;
            updateConfChart();
        }
    }); 

    var query_type = document.getElementById("query_type");
    query_type.addEventListener('change', function() {
        var currentChart = window.dashboard.getCurrentChart();
        currentChart.instant = this.checked;
        updateConfChart();
    });


    // axes
    var xaxisUnits = document.getElementById("xaxis_units");
    xaxisUnits.addEventListener("keyup", (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            var currentChart = window.dashboard.getCurrentChart();
            currentChart.visualization.options.units = xaxisUnits.value.trim();
            updateConfChart();
        }
    });
    

    // visualisation section
    var visCharts = document.querySelectorAll(".chart_vis");
    visCharts.forEach((visChart) => {
        visChart.addEventListener("click", () => {

            visCharts.forEach((visChart) => {
                visChart.classList.remove("icon_btn_selected");
                visChart.classList.add("icon_btn");
            })

            visChart.classList.remove("icon_btn");
            visChart.classList.add("icon_btn_selected");


            var currentChart = window.dashboard.getCurrentChart();
            var chartType = visChart.id.replace("_chart_btn", "").trim();
            currentChart.visualization.type = chartType;
            currentChart.visualization.options = getDefaultOptions(chartType);
            updateConfChart();
        });
    });
}

init_dashconf();