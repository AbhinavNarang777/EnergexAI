import { getCurrentDateHour } from '@/lib/utils';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CombinedForecastChart = ({ currentData=[], predictedData=[],correctedData  }) => {
  const [zoomedXaxis, setZoomedXaxis] = useState({});
  const [userZoomed, setUserZoomed] = useState(false); // New state to track if the user has zoomed manually
  const lastDataPointXValue = currentData.length > 0 ? new Date(currentData[currentData.length - 1].x).getTime() : null;
  const lastDataPointYValue = currentData.length > 0 ? currentData[currentData.length - 1].y : null;

  const currentDataWithMarker = currentData.map((point, index) => {
    if (index === currentData.length - 1) { // Check if it's the last point
      return {
        ...point,
        marker: {
          size: 8,
          fillColor: '#fff',
          strokeColor: 'red',
          radius: 2,
          cssClass: 'apexcharts-custom-class'
        },
        label: {
          borderColor: '#FF4560',
          offsetY: 0,
          style: {
            color: '#fff',
            background: '#FF4560',
          },
          text: 'Point Annotation',
        }
      };
    }
    return point;
  });
  
  
  // useEffect(() => {
  //   if (currentData.length > 0) {
  //     const currentDateTime = getCurrentDateHour();
  //     const lastDataPointDate = new Date(currentDateTime).getTime() + (12 * 60 * 60 * 1000);
  //     console.log(lastDataPointDate)
  //     const firstDataPointDate = lastDataPointDate - (24 * 60 * 60 * 1000); // 24 hours before the last data point
  
  //     setZoomedXaxis({
  //       min: firstDataPointDate,
  //       max: lastDataPointDate,
  //     });
  //   }
  // }, 
  // [currentData])
  const titleColor = '#000'; // Tomato color for demonstration; change as needed

  const options = {
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: true
      },
     
    },
    colors: ['#000', '#AA4A44','#097969'],
    stroke: {
      width: [3, 3,3],
      dashArray: [0, 5], // Solid line for current, dashed for predicted
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
      min: zoomedXaxis.min,
      max: zoomedXaxis.max,
      labels: {
        style: {
          colors: titleColor,
        },
      },
      title: {
        style: {
          color: titleColor,
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: titleColor,
        },
        formatter: function (value) {
          // Format the value to show up to 2 decimal places only
          // Adjust the '2' below to change the number of decimal places as needed
          return value.toFixed(2);
        }
      },
      title: {
        text: 'Value',
        style: {
          color: titleColor,
        },
      },
    },
    tooltip: {
      shared: false,
      intersect: true,
    },
    legend: {
      labels: {
        colors: titleColor, // This will change the text color of the legend (series names)
        useSeriesColors: false,
      },
    },
    title: {
      text: 'Reinforced load forecast',
      align: 'left',
      style: {
        color: titleColor, // Setting title color
      },
    },
    annotations: {
     
      points: [{
        x: lastDataPointXValue,
        y: lastDataPointYValue,
        marker: {
          size: 8,
          fillColor: '#fff',
          strokeColor: 'red',
          radius: 2,
          cssClass: 'apexcharts-custom-class'
        },
        label: {
          borderColor: '#FF4560',
          offsetY: 0,
          style: {
            color: '#fff',

            background: 'rgba(255, 69, 96, 0.5)', // White color with 50% opacity
          },
    
          text: 'Current ',
        }
      }]
    },
  };

  const series = [
    {
      name: "Current",
      data: currentData,
    },
    {
      name: "Predicted",
      data: predictedData,
    },
    {
      name: "Corrected",
      data: correctedData,
    },

    
  ];

  // Options for the brush chart (smaller, area chart for selection)
 

  return (
    <>
      <ReactApexChart options={options} series={series} type="line" height={340} />
      {/* <ReactApexChart options={brushChartOptions} series={[{ data: [...currentData, ...predictedData, ...correctedData] }]} type="area" height={100} /> */}
    </>
  );
};
export default CombinedForecastChart