var options = {
    chart: {
        animations: {
            enabled: false
        },
        redrawOnParentResize: true,
        height: "200px",
        width: "300px",
        toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false | '<img src="/static/icons/reset.png" width="20">',
              customIcons: []
            },
            export: {
              csv: {
                filename: undefined,
                columnDelimiter: ',',
                headerCategory: 'category',
                headerValue: 'value',
                dateFormatter(timestamp) {
                  return new Date(timestamp).toDateString()
                }
              },
              svg: {
                filename: undefined,
              },
              png: {
                filename: undefined,
              }
            },
            autoSelected: 'zoom' 
          },
    },
    markers: {
        size: [1, 15]
    },
    series: [{
            type: 'line',
            name: 'ma,e',
            data: [[1, 34], [3, 54], [5, 23] , [15, 43]]
        }, {
            type: 'line',
            name: 'e',
            data: [[1, 14], [2, 24], [5, 23] , [15, 33]]
        }
    ], 
    legend: {
        show: true
    },
    grid: {
        show: true,
        borderColor: '#90A4AE',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
            lines: {
                show: true
            }
        },   
        yaxis: {
            lines: {
                show: false
            }
        },  
        row: {
            colors: undefined,
            opacity: 0.5
        },  
        column: {
            colors: undefined,
            opacity: 0.5
        },  
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },  
    },
    yaxis: {
        labels: {
          formatter: function (value) {
            return value + "$";
          }
        },
      },
    xaxis: {
        type: 'numeric',
    },
    annotations: {
        yaxis: [
          {
            y: 28,
            borderColor: '#00E396',
          }
        ],
        xaxis: [
          {
            x: 8,
            borderColor: '#00E396',
          }
        ]
      }
}

var chart = new ApexCharts(document.querySelector('#chart1 .chart'), options);
chart.render();
var chart2 = new ApexCharts(document.querySelector('#chart2 .chart'), options);
chart2.render();
var chart3 = new ApexCharts(document.querySelector('#chart3 .chart'), options);
chart3.render();