import React from 'react';
import ReactApexChart from 'react-apexcharts';

const EnergyComparisonChart = ({ energyData }) => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false, // Adjust based on preference
        borderRadius: 5,
      },
    },
    colors: ['#4CAF50', '#FFC107'], // Green for sustainable, Yellow for non-sustainable
    xaxis: {
      categories: ['Energy Source 1', 'Energy Source 2', 'Energy Source 3'],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };

  const series = [
    {
      name: 'Sustainable Energy',
      data: energyData.sustainable,
    },
    {
      name: 'Non-Sustainable Energy',
      data: energyData.nonSustainable,
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={150} />
    </div>
  );
};

export default EnergyComparisonChart;
