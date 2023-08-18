// Sample data
var data = [5, 10, 8, 12, 15, 20];

// Chart options
var options = {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Sample Line Chart'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
        title: {
            text: 'Value'
        }
    },
    series: [{
        name: 'Data Series',
        data: data
    }]
};


// Create the chart
Highcharts.chart('chart-container', options);
