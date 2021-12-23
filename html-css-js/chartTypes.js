toolbar_settings = {
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
      reset: false | '<img src="/static/icons/reset.png" width="20">',
      customicons: []
    },
    autoselected: 'zoom' 
}


var line_options = {
    stroke: {
        // curve: 'smooth',
        // curve: 'stepline',
        curve: 'straight',
        // dashArray: 0, // float in <0, some barrier>
        width: 0, //float
    },
    chart: {
        animations: { enabled: false },
        redrawOnParentResize: true,
        toolbar: toolbar_settings,

        stacked: true,
        // stacked: false,

    },
    legend: {
        // show: false,
        show: true,
    },
    series: [
        {
            // type: 'line',
            type: 'column',
            name: 'test1',
            data: [
                [640277963000, 54],
                [640278123000, 23],
                [640278283000, 33],
                [640278343000, 93],
                [640278403000, 13],
                [640278463000, 53],
                [640278523000, 63],
                [640278583000, 43],
            ]
        },
        {
            // type: 'line',
            type: 'column',
            name: 'test2',
            data: [
                [640277963000, 14],
                [640278123000, 18],
                [640278283000, 23],
                [640278343000, 13],
                [640278403000, 3],
                [640278463000, 23],
                [640278523000, 33],
                [640278583000, 23],
            ]
        },
    ], 
    xaxis: {
        // type: 'numeric',
        type: 'datetime',
    },
}

var area_options = {
    stroke: {
        // curve: 'smooth',
        // curve: 'stepline',
        curve: 'straight',
        // dashArray: 4, // float in <0, some barrier>
        // width: 5, //float
    },
    chart: {
        animations: { enabled: false },
        redrawOnParentResize: true,
        toolbar: toolbar_settings,

        // stacked: true,
        stacked: false,
        type: "area"

    },
    legend: {
        // show: false,
        show: true,
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        type: 'solid',
        // type: "gradient",
        // gradient: {
        //   shadeIntensity: 1,
        //   opacityFrom: 0.7,
        //   opacityTo: 0.9,
        //   stops: [0, 90, 100]
        // }
    },
    series: [
        {
            name: 'test1',
            data: [
                [640277963000, 54],
                [640278123000, 23],
                [640278283000, 33],
                [640278343000, 93],
                [640278403000, 13],
                [640278463000, 53],
                [640278523000, 63],
                [640278583000, 43],
            ]
        },
        {
            name: 'test2',
            data: [
                [640277963000, 14],
                [640278123000, 18],
                [640278283000, 23],
                [640278343000, 13],
                [640278403000, 3],
                [640278463000, 23],
                [640278523000, 33],
                [640278583000, 23],
            ]
        },
    ], 
    xaxis: {
        // type: 'numeric',
        type: 'datetime',
    },
}

var pie_options = {
    chart: {
        animations: { enabled: false },
        redrawOnParentResize: true,
        toolbar: toolbar_settings,

        // type: "donut",
        type: "pie"

    },
    legend: {
        // show: false,
        show: true,
    },
    dataLabels: {
        enabled: false
    },
    series: [12, 13, 5, 10], 
    labels: ["AttributeError", "KeyError", "RuntimeError", "TypeError"]
}

var heatmap_options = {
    chart: {
        type: 'heatmap',
    },
    series: [
        {
            name: 'Metric1',
            data: [
                [640277963000, 14],
                [640278123000, 118],
                [640278283000, 23],
                [640278343000, 13],
            ]
        },
        {
            name: 'Metric2',
            data: [
                [640277963000, 54],
                [640278123000, 88],
                [640278283000, 43],
                [640278343000, 33],
            ]
        },
    ],
    dataLabels: {
      enabled: false
    },
    colors: ["#008FFB"],
    title: {
      text: 'HeatMap Chart (Single color)'
    },
    xaxis: {
        // type: 'numeric',
        type: 'datetime',
    },
};

var line_chart = new ApexCharts(
        document.querySelector('#line_chart'), line_options);
var area_chart = new ApexCharts(
        document.querySelector('#area_chart'), area_options);
var pie_chart = new ApexCharts(
        document.querySelector('#pie_chart'), pie_options);
var heat_chart = new ApexCharts(
        document.querySelector('#heat_chart'), heatmap_options);

line_chart.render();
area_chart.render();
pie_chart.render();
heat_chart.render();