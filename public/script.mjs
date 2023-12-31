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
const noDataPopup = document.getElementById('noDataPopup');
const popupCloseButton = document.getElementById('popupClose');

// Function to show the popup
// Function to show the popup
const showNoDataPopup = () => {
  noDataPopup.style.display = 'block';
};

// Function to hide the popup
const hideNoDataPopup = () => {
  noDataPopup.style.display = 'none';
};



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
const pageSize = 25; // Number of data points to display per page




///////////threshold play ground ////////

const drawChartButton = document.getElementById('drawChartButtons');
let filter = {};
drawChartButton.addEventListener('click', () => {
  // Get threshold values from input fields
  const rpmThreshold = parseFloat(document.getElementById('rpmThreshold').value);
  const temp1Threshold = parseFloat(document.getElementById('temp1Threshold').value);
  const temp2Threshold = parseFloat(document.getElementById('temp2Threshold').value);
  const temp3Threshold = parseFloat(document.getElementById('temp3Threshold').value);
  const pressureThreshold = parseFloat(document.getElementById('pressureThreshold').value);
  
  // Create a filter object based on the provided threshold values

  
  if (!isNaN(rpmThreshold)) {
    filter.rpm = rpmThreshold;
  }
  
  if (!isNaN(temp1Threshold)) {
    filter.temp1 = temp1Threshold;
  }
  
  if (!isNaN(temp2Threshold)) {
    filter.temp2 = temp2Threshold;
  }
  
  if (!isNaN(temp3Threshold)) {
    filter.temp3 = temp3Threshold;
  }
  
  if (!isNaN(pressureThreshold)) {
    filter.pressure = pressureThreshold;
  }
  
  fetchData(currentPage, fromEpoch, toDateEpoch, filter)
});
const fetchData = async (page, fromdate, todate,filters) => {
  try {
    console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{",page,fromdate,todate,filters);
    let apiEndpoint;
    let params = {};
    if (!fromdate && !todate && Object.keys(filter).length === 0) {
      // Use the page-based API as the default when no filters or date range provided
      apiEndpoint = '/sensors/getDatByPage';
      params = {
        page: page,
        pageSize: pageSize,
      };
    } else if (fromdate && todate) {
      // Use the date range-based API
      apiEndpoint = '/sensors/getDataByDateRange';
      params = {
        from: fromdate,
        to: todate,
        page: page,
        pageSize: pageSize,
      };
    } else if (filter) {
      // Use the threshold API when thresholds are provided
      apiEndpoint = '/sensors/getDataByThreshold';
      params = {
        filter: filter,
        page: page,
        pageSize: pageSize,
      };
    }
    
    
        console.log("api is  > > > >",apiEndpoint+params);
    const result = await axios.get(apiEndpoint, { params });
    console.log("dattaa >> from      db+++++",result.data)

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
    console.log(error);
  }
};


prevButton.addEventListener('click',async () => {
  if (currentPage > 0) {
    console.log("call received still on the data part to the prev button")
    currentPage -= 1;
    fetchData(currentPage, fromEpoch, toDateEpoch,filter);
  }else{
    console.log("call received to the else part of prev button")
    try {
      const result = await axios.get('/sensors/getDataByPage', {
        params: {
          page: currentPage,
          pageSize: pageSize,
        },
      });
      const data = result.data;

      if (data.formattedDate.length === 0) {
        // Show the "No more data available" popup
        showNoDataPopup();
      }
    } catch (error) {
      console.error(error);
    }
  }
});

nextButton.addEventListener('click', () => {
  currentPage += 1;
  fetchData(currentPage, fromEpoch, toDateEpoch,filter);
});

popupCloseButton.addEventListener('click', () => {
  // Hide the popup when the close button is clicked
  hideNoDataPopup();
});

// Add an event listener to the "Home" button to reload the page
const homeButton = document.getElementById('homeButton');

homeButton.addEventListener('click', () => {
  // Reload the page
  window.location.reload();
});

const fetchLiveData = async () => {

  fetchData(currentPage, fromEpoch, toDateEpoch);
};

const fetchDataByPage = async (page) => {
  fetchData(page);
};




socket.on("dataCleared", () => {
  fetchLiveData();
});

socket.on("dataPosted", () => {
  fetchLiveData();
})
fetchDataByPage(currentPage);
