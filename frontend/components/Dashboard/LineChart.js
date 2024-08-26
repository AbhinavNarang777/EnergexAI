import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = ({ data }) => {
  const options = {
    series: [{
      data: data
    }],
    chart: {
      id: 'chart2',
      type: 'line',
      height: 230,
      toolbar: {
        autoSelected: 'pan',
        show: false
      }
    },
    colors: ['#546E7A'],
    stroke: {
      width: 3
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime'
    }
  };

  return (
    <ReactApexChart options={options} series={options.series} type="line" height={230} />
  );
};

export default LineChart;
