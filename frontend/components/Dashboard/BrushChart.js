import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BrushChart = ({ data }) => {
  const optionsLine = {
    series: [{
      data: data
    }],
    chart: {
      id: 'chart1',
      height: 130,
      type: 'area',
      brush: {
        target: 'chart2',
        enabled: true
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date('19 Jun 2017').getTime(),
          max: new Date('14 Aug 2017').getTime()
        }
      },
    },
    colors: ['#008FFB'],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      }
    },
    xaxis: {
      type: 'datetime',
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      tickAmount: 2
    }
  };

  return (
    <ReactApexChart options={optionsLine} series={optionsLine.series} type="area" height={130} />
  );
};

export default BrushChart;
