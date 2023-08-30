// Import Highcharts module
const socket = io()
// Define the Highcharts configuration options
var options = {
  chart: { renderTo: 'chart-container' },
  chart: {
    renderTo: 'chart-container',
    backgroundColor: 'white', // Set the background color to grey
      width: window.innerWidth, // Set the chart width to match the window width
    height: window.innerHeight,
  },
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
      animation: false, // Enable animation for the series
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
    dateTimeLabelFormats: { second: '%H:%M:%S' },
    categories: [] ,
    reversed : true
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


// Modify the onChange handlers for the "From" and "To" date pickers
let fromEpoch
let toDateEpoch
flatpickr("#fromDateTimePicker", {
  // ... Existing config ...
  enableTime: true, // Enable time selection
  onChange: function(selectedDates, dateStr) {
    console.log("Selected 'From' date and time:", dateStr);
    fromEpoch = new Date(dateStr).getTime() / 1000;
    // You might want to trigger data fetching here based on the selected range
    const toDateStr = document.querySelector("#toDateTimePicker").value;
   // fetchDataByDateRange(dateStr, toDateStr);
   //fetchData(currentPage,fromDateStr,fromDateEpoch)
  }
});

flatpickr("#toDateTimePicker", {
  // ... Existing config ...
  enableTime: true, // Enable time selection
  onChange: function(selectedDates, dateStr) {
    console.log("Selected 'To' date and time:", dateStr);
     toDateEpoch = new Date(dateStr).getTime() / 1000;
    // You might want to trigger data fetching here based on the selected range
    const fromDateStr = document.querySelector("#fromDateTimePicker").value;
    console.log("data > > > >",fromDateStr)
   // fetchDataByDateRange(fromDateStr, dateStr);
   fetchData(currentPage,fromEpoch,toDateEpoch)
  }
});





// Fetch data from the server using Axios
const chart = Highcharts.chart('chart-container', options);


const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const clearButton = document.getElementById('clearButton');

clearButton.addEventListener('click', async () => {
  try {
    // Send a DELETE request to clear the chart data
    await axios.delete('sensors/clearData');
    // Handle the "dataCleared" event to update the chart
    socket.on('dataCleared', () => {
      // Clear or update the chart as needed
      fetchLiveData()
    });
  } catch (error) {
    console.error(error);
  }
});

let currentPage = 0; // Track the current page for pagination
const pageSize = 20; // Number of data points to display per page

const fetchData = async(page,fromdate,todate)=>{
  try {
    let apiEndpoint
    let params= {}
    if(fromdate&&todate){
      apiEndpoint = '/sensors/getDataByDateRange';
      params ={
        from:fromdate,
        to : todate,
        page:page,
        pageSize:pageSize
      }
    }else{
      apiEndpoint = '/sensors/getDatByPage';
      params = {
        page: page,
        pageSize: pageSize,
      };
    }
    console.log("the end point is        >>>>>>",apiEndpoint)
    const result = await axios.get(apiEndpoint, { params });
    console.log("fetched data is >>>>>>",result.data)
    const categories = result.data.formattedDate;
    const temp1Data = result.data.temp1;
    const temp2Data = result.data.temp2;
    const temp3Data = result.data.temp3;
    const pressureData = result.data.pressure;
    const rpmData = result.data.rpm;

    chart.xAxis[0].update({ categories: categories }, false);
    chart.series[0].setData(temp1Data, false);
    chart.series[1].setData(temp2Data, false);
    chart.series[2].setData(temp3Data, false);
    chart.series[3].setData(pressureData, false);
    chart.series[4].setData(rpmData, false);

    chart.redraw(false);

  } catch (error) {
    
  }
}




prevButton.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage -= 1;
    fetchData(currentPage, fromEpoch, toDateEpoch);
  }
});

nextButton.addEventListener('click', () => {
  currentPage += 1;
  fetchData(currentPage, fromEpoch, toDateEpoch);
});


const fetchDataByPage = async (page) => {
  fetchData(page);
};


fetchDataByPage(currentPage);

socket.on("dataCleared", () => {
  fetchLiveData();
});

socket.on("dataPosted", () => {
  fetchLiveData();
})

fetchLiveData()