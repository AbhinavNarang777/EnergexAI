"use client"

import { brown, category, getCurrentDateHour, green } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import { useActiveAuthContext } from "../DataProvider"
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AreaChart = () => {
  const currentDateTime = getCurrentDateHour()
  const lastDataPointDate =
    new Date(currentDateTime).getTime() + 12 * 60 * 60 * 1000
  console.log(lastDataPointDate)
  const { actualData, setActualData } = useActiveAuthContext()
  const [lastKey, setLastKey] = useState("")
  useEffect(() => {
    if(actualData){
    const keys = Object.keys(actualData.actual)

    // Get the last key from the keys array
    setLastKey(keys[keys.length - 1])}
  }, [actualData])
  const firstDataPointDate = lastDataPointDate - 24 * 60 * 60 * 1000 // 24 hours before the last data point

  const series = [
    {
      name: "Green Energy",
      data: green,
    },
    {
      name: "Brown Energy",
      data: brown,
    },
  ]

  const options = {
    title: {
      text: "Green  vs Brown Energy Forecast",
      align: "left",
      style: {
        color: "#000", // Setting title color
      },
    },
    chart: {
      height: 350,
      type: "area",
    },
    colors: ["#097969", "#AA4A44", "#097969"],

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: function (value) {
          // Format the value to show up to 2 decimal places only
          // Adjust the '2' below to change the number of decimal places as needed
          return value.toFixed(2)
        },
      },
    },
    xaxis: {
      type: "datetime",
      categories: category,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    annotations: {
      xaxis: [
        {
          // Assuming the latest timestamp in your combined chart is available here
          x: new Date().getTime(), // This needs to be dynamic based on your real-time data
          borderColor: "#999",
          label: {
            text: "Real-time Data Coverage",
            style: {
              color: "#fff",
              background: "#a4a0a0",
            },
          },
        },
      ],
      // Optionally, add a shaded region to highlight the area
      xaxis: [
        {
          x: firstDataPointDate, // Dynamic: latest timestamp of your data
          x2: new Date(lastKey).getTime(), // Example: fixed or could be dynamic as well
          fillColor: "#a4a0a0",
          opacity: 0.2,
          label: {
            borderColor: "#a4a0a0",
            style: {
              fontSize: "10px",
              color: "#fff",
              background: "#a4a0a0",
            },
            offsetY: -10,
            text: "Covered Range",
          },
        },
      ],
    },
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={220}
      />
    </div>
  )
}

export default AreaChart
