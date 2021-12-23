function get_time_range() {
    var start = document.getElementById("query_start").value;
    var end = document.getElementById("query_end").value;
    return [start, end];
}

function show_chart_settings(chart_conf) {
    if (chart_conf.prom_query) {
        document.querySelector("#prom_query").value = chart_conf.prom_query;
    }
    document.querySelector("#query_step").value = chart_conf.step;
    document.querySelector("#query_type").checked = chart_conf.instant;

    document.querySelector(".rows_container").style.display = "none";
    document.querySelector(".chartconf_container").style.display = "block";
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

function init() {
    var start_date = new Date();
    var end_date = new Date();

    start_date.setDate(start_date.getDate() - 1);
    var start_formatted = start_date.toISOString();
    var end_formatted = end_date.toISOString();
    document.getElementById('query_start').value = start_formatted;
    document.getElementById('query_end').value = end_formatted;

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
            get_prom_data(chart_conf);
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
            get_prom_data(chart_conf);
        }
    }); 

    var query_type = document.getElementById("query_type");
    query_type.addEventListener('change', function() {
        chart_conf = get_current_chart_conf();
        chart_conf.instant = this.checked;
        actualize_g_chart_conf(chart_conf);
        actualize_chart(chart_conf, "chartconf_chart")
    });

}

// var query = 'errors_total';
// perform_query(instant_query, query);

init();