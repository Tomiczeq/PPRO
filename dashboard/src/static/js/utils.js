
function get_time_range() {
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


function actualize_g_rows_conf() {
    var rows = document.querySelectorAll(".row");
    var charts = {};

    for (var row_id in window.g_rows_conf) {
        var row_charts = window.g_rows_conf[row_id].charts;
        for (var chart_id in row_charts) {
            charts[chart_id] = row_charts[chart_id];
        }
    }

    var new_g_rows_conf = {};
    var position = 0
    rows.forEach((row) => {

        var row_conf = g_rows_conf[row.id];
        row_conf.position = position;
        row_conf.charts = get_row_charts(row.id, charts);
        new_g_rows_conf[row.id] = row_conf;
        position += 1;

    });
    window.g_rows_conf = new_g_rows_conf;
}

function actualize_g_chart_conf(chart_conf) {
    window.g_rows_conf[chart_conf.row_id].charts[chart_conf.id] = chart_conf;
}

function get_chart_conf_by_id(wanted_chart_id) {
    actualize_g_rows_conf();

    for (var row_id in window.g_rows_conf) {
        var row_conf = window.g_rows_conf[row_id];
        for(var chart_id in row_conf.charts) {
            if (chart_id = wanted_chart_id) {
                return row_conf.charts[chart_id]
            }
        }
    }

    alert("Cannot get chart conf by id");
}

function get_current_chart_conf() {
    return get_chart_conf_by_id(window.g_current_chart_id);
}

function get_row_charts(row_id, charts) {
    var current_charts = document.querySelectorAll('#' + row_id + ' .chart');
    var charts_conf = {}

    var position = 0
    current_charts.forEach((chart) => {
        var chart_conf = charts[chart.id];
        chart_conf.position = position;
        chart_conf.row_id = row_id;
        charts_conf[chart.id] = chart_conf
        position += 1;
    })
    return charts_conf
}

