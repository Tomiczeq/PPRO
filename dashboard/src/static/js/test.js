var options = {
    chart: {
        animations: {
            enabled: false
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
            label: {
              borderColor: '#00E396',
              style: {
                color: '#fff',
                background: '#00E396'
              },
              text: 'Y-axis annotation on 28'
            }
          }
        ],
        xaxis: [
          {
            x: 8,
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                color: '#fff',
                background: '#00E396'
              },
              text: 'X-axis annotation on 8'
            }
          }
        ]
      }
}

var chart = new ApexCharts(document.querySelector('#chart'), options);

chart.render();
