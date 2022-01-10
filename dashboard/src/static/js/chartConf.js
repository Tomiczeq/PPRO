function hideChartSettings() {
    // change header
    document.querySelector(".dashboardHeader").classList.remove("hidden");
    document.querySelector(".confHeader").classList.add("hidden");

    // unhighlight chart visualization
    var visCharts = document.querySelectorAll(".chartVis");
    visCharts.forEach((visChart) => {
        visChart.classList.remove("buttonSelected");
        visChart.classList.add("button");
    });

    // show add row button
    document.getElementById("addRowBtn").classList.remove("hidden");

    document.querySelector(".rowsContainer").classList.remove("hidden");
    document.querySelector(".confContainer").classList.add("hidden");
}

function showChartSettings(chart) {
    // change header
    document.querySelector(".dashboardHeader").classList.add("hidden");
    document.querySelector(".confHeader").classList.remove("hidden");
    document.querySelector(
        ".confHeader .dashboardName").textContent = chart.name;

    // fill some general options
    document.querySelector("#chartName").value = chart.name;
    document.querySelector("#promQuery").value = chart.promQuery;
    document.querySelector("#queryLegend").value = 
            chart.visualization.options.legend;
    document.querySelector("#queryStep").value = chart.step;
    document.querySelector("#queryType").checked = chart.instant;

    document.querySelector(".rowsContainer").classList.add("hidden");
    document.querySelector(".confContainer").classList.remove("hidden");

    // hide add row button
    document.getElementById("addRowBtn").classList.add("hidden");

    // highlight chart visualization
    var qstring = chart.visualization.type + "ChartBtn";
    var currentVis = document.getElementById(qstring);
    currentVis.classList.remove("button");
    currentVis.classList.add("buttonSelected");

    // fill units
    var xaxisUnits = document.getElementById("xaxisUnits");
    xaxisUnits.value = chart.visualization.options.units;
    updateConfChart();
}

function updateConfChart() {
    var currentChart = window.dashboard.getCurrentChart();
    var container = document.querySelector(
            ".confChartContainer");
    for (var styleKey in currentChart.style) {
        var styleValue = currentChart.style[styleKey];
        if (styleValue) {
            container.style[styleKey] = styleValue;
        }
    }
    currentChart.update();
}


function initChartConf() {
    // back to dashboard button
    var backBtn = document.getElementById("confBackBtn");
    backBtn.addEventListener("click", () => {
        hideChartSettings();
        window.dashboard.currentView = "dashboard";
        var currentChart = window.dashboard.getCurrentChart();
        currentChart.update();
    });

    // init chart conf navigation
    var confNavItems = document.querySelectorAll(".confNavLi");
    var confContainers = document.querySelectorAll(".confContent");
    confNavItems.forEach((navItem) => {

        navItem.addEventListener("click", () => {
            
            confNavItems.forEach((navItem) => {
                navItem.classList.remove("button");
                navItem.classList.remove("buttonSelected");
                navItem.classList.add("button");
            })
            navItem.classList.remove("button");
            navItem.classList.add("buttonSelected");

            confContainers.forEach((confContainer) => {
                confContainer.classList.remove("hidden");
                confContainer.classList.add("hidden");
            })

            var currentContainerId = navItem.id.replace(
                    "Btn", "Container").trim();
            var currentContainer = document.getElementById(currentContainerId);
            currentContainer.classList.remove("hidden");

        })
    })
    var queryContainer = document.getElementById("confQueryContainer")
    queryContainer.classList.remove("hidden")
    var queryNav = document.getElementById("confQueryBtn");
    queryNav.classList.remove("button");
    queryNav.classList.add("buttonSelected");

    // general section init
    var queryInput = document.getElementById("promQuery");
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

    var chartName = document.getElementById("chartName");
    chartName.addEventListener("keydown", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            var currentChart = window.dashboard.getCurrentChart();
            currentChart.name = chartName.value.trim();
            document.querySelector(
                ".confHeader .dashboardName").textContent = currentChart.name;
            var qstring = "#" + currentChart.id + " .chartName";
            document.querySelector(qstring).textContent = currentChart.name;
        }
    });

    var queryStep = document.getElementById("queryStep");
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

    var queryLegend = document.getElementById("queryLegend");
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

    var query_type = document.getElementById("queryType");
    query_type.addEventListener('change', function() {
        var currentChart = window.dashboard.getCurrentChart();
        currentChart.instant = this.checked;
        updateConfChart();
    });


    // axes
    var xaxisUnits = document.getElementById("xaxisUnits");
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
    var visCharts = document.querySelectorAll(".chartVis");
    visCharts.forEach((visChart) => {
        visChart.addEventListener("click", () => {

            visCharts.forEach((visChart) => {
                visChart.classList.remove("buttonSelected");
                visChart.classList.add("button");
            })

            visChart.classList.remove("button");
            visChart.classList.add("buttonSelected");

            var currentChart = window.dashboard.getCurrentChart();
            var chartType = visChart.id.replace("ChartBtn", "").trim();
            currentChart.visualization.type = chartType;
            currentChart.visualization.options = getDefaultOptions(chartType);
            updateConfChart();
        });
    });
}

initChartConf();