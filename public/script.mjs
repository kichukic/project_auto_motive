// Define the Highcharts configuration options
var options = {
  chart: { renderTo: 'chart-container' },
  title: { text: 'Automotive Plots', align: 'left' },
  subtitle: { text: '5 sensors', align: 'left' },
  series: [
    {
      name: "Temperature1",
      showInLegend: true,
      data: [],
      tooltip: {
        valueSuffix: ' °C'
      }
    },
    {
      name: "Temperature2",
      showInLegend: true,
      data: [],
      yAxis: 1,
      tooltip: {
        valueSuffix: ' °C'
      }
    },
    {
      name: "Temperature3",
      showInLegend: true,
      data: [],
      yAxis: 2,
      tooltip: {
        valueSuffix: ' °C'
      }
    },
    {
      name: "Pressure",
      showInLegend: true,
      data: [],
      yAxis: 3,
      tooltip: {
        valueSuffix: ' kPa'
      }
    },
    {
      name: "RPM",
      showInLegend: true,
      data: [],
      yAxis: 4,
      tooltip: {
        valueSuffix: ' rpm'
      }
    }
  ],
  plotOptions: {
    line: {
      animation: false,
      dataLabels: { enabled: true }
    },
    series: [
      { color: '#059e8a' },
      { color: '#049e8a' },
      { color: '#039e8a' },
      { color: '#029e8a' },
      { color: '#019e8a' }
    ]
  },
  xAxis: {
    type: 'datetime',
    title: { text: 'Time' },
    dateTimeLabelFormats: { second: '%H:%M:%S' }
  },
  yAxis: [
    {
      title: {
        text: 'Temperature 1',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        format: '{value} °C',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      opposite: true
    },
    {
      gridLineWidth: 0,
      title: {
        text: 'Temperature 2',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      labels: {
        format: '{value} °C',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      opposite: true
    },
    {
      gridLineWidth: 0,
      title: {
        text: 'Temperature 3',
        style: {
          color: Highcharts.getOptions().colors[2]
        }
      },
      labels: {
        format: '{value} °C',
        style: {
          color: Highcharts.getOptions().colors[2]
        }
      },
      opposite: true
    },
    {
      title: {
        text: 'Pressure',
        style: {
          color: Highcharts.getOptions().colors[3]
        }
      },
      labels: {
        format: '{value} kPa',
        style: {
          color: Highcharts.getOptions().colors[3]
        }
      }
    },
    {
      title: {
        text: 'RPM',
        style: {
          color: Highcharts.getOptions().colors[4]
        }
      },
      labels: {
        format: '{value} rpm',
        style: {
          color: Highcharts.getOptions().colors[4]
        }
      }
    }
  ],
  tooltip: {
    shared: true
  },
  credits: { enabled: false },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            floating: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0
          },
          yAxis: [
            {
              labels: {
                align: 'left',
                x: 0,
                y: -6
              },
              showLastLabel: false
            },
            {
              labels: {
                align: 'left',
                x: 0,
                y: -6
              },
              showLastLabel: false
            },
            {
              labels: {
                align: 'left',
                x: 0,
                y: -6
              },
              showLastLabel: false
            },
            {
              labels: {
                align: 'right',
                x: 0,
                y: -6
              },
              showLastLabel: false
            },
            {
              labels: {
                align: 'right',
                x: 0,
                y: -6
              },
              showLastLabel: false
            },
            {
              visible: false
            }
          ]
        }
      }
    ]
  }
};

// Fetch data from the server using Axios
axios.get("sensors/getData").then((result) => {
  options.series[0].data = result.data.temp1;
  options.series[1].data = result.data.temp2;
  options.series[2].data = result.data.temp3;
  options.series[3].data = result.data.pressure;
  options.series[4].data = result.data.rpm;
  Highcharts.chart('chart-container', options);
}).catch((err) => {
  console.log(err);
});
