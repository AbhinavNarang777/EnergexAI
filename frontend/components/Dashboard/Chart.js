import React from 'react';
import ApexCharts from 'react-apexcharts';

const ForecastChart = ({ currentData, predictedData }) => {
  const options = {
    chart: {
      height: 350,
      type: 'line',
    },
    stroke: {
      width: 5,
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: currentData.map(data => data.x).concat(predictedData.map(data => data.x)), // Combine dates from current and predicted data
      tickAmount: 10,
      labels: {
        formatter: function(value) {
          return new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        }
      }
    },
    title: {
      text: 'Forecast',
      align: 'left',
      style: {
        fontSize: "16px",
        color: '#666'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#FDD835'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      },
    },
    yaxis: {
      min: -10,
      max: 40
    }
  };

  const series = [
    {
      name: 'Current Sales',
      data: currentData.map(item => ({x: item.x, y: item.y})), // Ensure data format is correct
    },
    {
      name: 'Predicted Sales',
      data: predictedData.map(item => ({x: item.x, y: item.y})),
      // Optionally, add distinct styling for predicted data
      stroke: {
        width: 5,
        curve: 'smooth',
        dashArray: 5 // Dashed line for predicted data
      }
    }
  ];

  return (
    <div id="chart">
      <ApexCharts options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default ForecastChart;
