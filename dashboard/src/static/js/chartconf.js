function hide_chart_settings() {
    var back_btn = document.getElementById("back_btn");
    back_btn.classList.remove("icon_btn");
    back_btn.classList.add("hidden");

    document.querySelector(".rows_container").style.display = "block";
    document.querySelector(".chartconf_container").style.display = "none";
}

function show_chart_settings(chart_conf) {
    if (chart_conf.prom_query) {
        document.querySelector("#prom_query").value = chart_conf.prom_query;
    }
    if (chart_conf.legend) {
        document.querySelector("#query_legend").value = chart_conf.legend;
    }
    document.querySelector("#query_step").value = chart_conf.step;
    document.querySelector("#query_type").checked = chart_conf.instant;

    document.querySelector(".rows_container").style.display = "none";
    document.querySelector(".chartconf_container").style.display = "block";

    // var chart_container = document.getElementById(chart_conf.id);
    // var chartconf_chart_container = document.querySelector(".chartconf_chart");
    // chartconf_chart_container.appendChild(chart_container);
    var qstring = ".chartconf_chart";
    var chart_container = document.querySelector(qstring);
    for (var style in chart_conf.style) {
        var value = chart_conf.style[style];
        if (value) {
            chart_container.style[style] = value;
        }
    }
    update_charts();

    var vis_charts = document.querySelectorAll(".chart_vis");
    vis_charts.forEach((vis_chart) => {
        var chart_type = vis_chart.id.replace("_chart_btn", "").trim();
        if (chart_type === chart_conf.visualization.type) {
            vis_chart.classList.remove("icon_btn");
            vis_chart.classList.add("icon_btn_selected");
        }
    });

    var back_btn = document.getElementById("back_btn");
    back_btn.classList.remove("hidden");
    back_btn.classList.add("icon_btn");

    var xaxis_units = document.getElementById("xaxis_units");
    xaxis_units.value = chart_conf.visualization.options.units;
}

function get_prom_data(chart_conf) {
    var time_range = get_time_range()
    var request_conf = {
        "prom_query": chart_conf.prom_query,
        "instant": chart_conf.instant,
        "step": chart_conf.step,
        "start": time_range[0],
        "end": time_range[1],
    }

    $.ajax({
        type: "GET",
        url: "/api/prometheusRequest",
        data: {
            request_conf: JSON.stringify(request_conf)
        },
        success: function (response) {
        },
        error: function (e) {
            alert("prom query error");
        },
    });
}

function update_charts() {
    console.log("update_charts g_current_view: " + window.g_current_view);
    if (window.g_current_view === "chartconf") {
        var qstring = ".chartconf_chart";
        var chart_conf = get_current_chart_conf();

        if (qstring in window.g_apex_charts) {
            window.g_apex_charts[qstring].destroy();
            delete window.g_apex_charts[qstring];
        }
        actualize_chart(qstring, chart_conf);
    } else {
        actualize_charts();
    }
}

function init() {
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

    var query_input = document.getElementById("prom_query");
    query_input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
    
            var prom_query = query_input.value;
    
            chart_conf = get_current_chart_conf();
            chart_conf.prom_query = prom_query;
            actualize_g_chart_conf(chart_conf);
            update_charts();
        }
    }); 

    var query_legend = document.getElementById("query_legend");
    query_legend.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            var legend = query_legend.value;

            chart_conf = get_current_chart_conf();
            chart_conf.legend = legend;
            actualize_g_chart_conf(chart_conf);
            update_charts();
        }
    }); 

    var query_step = document.getElementById("query_step");
    query_step.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            var step = query_step.value;

            chart_conf = get_current_chart_conf();
            chart_conf.step = step;
            actualize_g_chart_conf(chart_conf);
            update_charts();
        }
    }); 

    var query_type = document.getElementById("query_type");
    query_type.addEventListener('change', function() {
        chart_conf = get_current_chart_conf();
        chart_conf.instant = this.checked;
        actualize_g_chart_conf(chart_conf);
        update_charts();
    });

    var vis_charts = document.querySelectorAll(".chart_vis");
    vis_charts.forEach((vis_chart) => {
        vis_chart.addEventListener("click", () => {

            vis_charts.forEach((viss_chart) => {
                viss_chart.classList.remove("icon_btn_selected");
                viss_chart.classList.add("icon_btn");
            })

            vis_chart.classList.remove("icon_btn");
            vis_chart.classList.add("icon_btn_selected");

            var chart_conf = get_current_chart_conf();
            var chart_type = vis_chart.id.replace("_chart_btn", "").trim();
            chart_conf.visualization.type = chart_type;
            chart_conf.visualization.options = get_default_options(chart_type);
            actualize_g_chart_conf(chart_conf);
            console.log("chart_conf: ");
            console.log(chart_conf);
            update_charts();
        });
    });
    

    // actualizing charts on query range change
    var query_range = document.getElementById("query_last");
    query_range.addEventListener("keyup", (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            query_range.value = query_range.value.trim();
            window.g_timerange = query_range.value;

            update_charts();
        }
    });

    // actualizing charts on query range change
    var xaxis_units = document.getElementById("xaxis_units");
    xaxis_units.addEventListener("keyup", (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            xaxis_units.value = xaxis_units.value.trim();
            var chart_conf = get_current_chart_conf();
            chart_conf.visualization.options.units = xaxis_units.value;
            actualize_g_chart_conf(chart_conf);
            console.log("chart_conf: ");
            console.log(chart_conf);
            update_charts();
        }
    });
}

// var query = 'errors_total';
// perform_query(instant_query, query);

init();