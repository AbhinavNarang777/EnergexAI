"use client"
import React, { useEffect, useRef, useState } from "react"
import ForecastChart from "./Chart"
import BrushChart from "./BrushChart"
import LineChart from "./LineChart"
import CombinedForecastChart from "./CombinedChart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import StackedHistogramChart from "./Stacked Histogram"
import EnergyComparisonChart from "./Stacked Histogram"
import TimeSeriesStackedChart from "./Stacked Histogram"
import AreaChart from "./AreaChart"
import { useInterval } from 'primereact/hooks';
import { useActiveAuthContext } from "../DataProvider"

const Dashboard = () => {
  const {actualData,setActualData}=useActiveAuthContext()
  const actualDataRef = useRef(actualData) // Create a ref for actualData
  const [isPolling, setIsPolling] = useState(false)
  const [apiInProgress, setApiInProgress] = useState(false)
  // Update the ref every time actualData changes
  useEffect(() => {
    actualDataRef.current = actualData
  }, [actualData])
  function getPredictedValues(formattedDate) {
    const predictedData = actualDataRef.current.predicted || {}
    const keys = Object.keys(predictedData) // Assuming keys are in ISO string format and can be sorted as strings
    const dateIndex = keys.indexOf(formattedDate)
    const values = []

    // Retrieve the value for the formattedDate and the next 3 keys
    for (let i = dateIndex; i <= dateIndex + 3 && i < keys.length; i++) {
      if (predictedData[keys[i]] !== undefined) {
        values.push(predictedData[keys[i]])
      }
    }

    return values
  }
  const getData = async () => {
    let header = {
      "Content-Type": "application/json",
    }
    let body = {
      num_predict: 168,
    }

    //
    const resp = await fetch(`http://127.0.0.1:8000/analytics/predict`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: header,
      responseType: "application/json", // Set the response type to 'blob'
    })

    if (resp.ok) {
      const response = await resp.json()
      setActualData(response)
      setApiInProgress(true)

    }
  }
  const pollData = async () => {
    setApiInProgress(false)

    const lastEntry = Object.keys(actualDataRef.current.actual || {}).pop() // Get the last datetime key from actual
    if (!lastEntry) return // If there's no last entry, skip polling

    let lastDateTime = new Date(lastEntry)

    // Correctly increment by one hour considering local timezone
    lastDateTime.setHours(lastDateTime.getHours() + 1)

    // Manually format the date to "YYYY-MM-DDTHH:mm:ss" in local timezone
    const formattedDate = `${lastDateTime.getFullYear()}-${String(
      lastDateTime.getMonth() + 1
    ).padStart(2, "0")}-${String(lastDateTime.getDate()).padStart(
      2,
      "0"
    )}T${String(lastDateTime.getHours()).padStart(2, "0")}:${String(
      lastDateTime.getMinutes()
    ).padStart(2, "0")}:${String(lastDateTime.getSeconds()).padStart(2, "0")}`

    const body = {
      date: formattedDate, // Format as required by your API
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/analytics/get_actual_demand`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )

      if (response.ok) {
        const predictedValues = getPredictedValues(formattedDate)
        const newData = await response.json()

        const secondApiBody = {
          date: formattedDate,
          actual: newData.demand.toString(),
          predicted: predictedValues,
        }

        const secondApiResponse = await fetch(
          `http://127.0.0.1:8000/chat/get_corrected_load`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(secondApiBody),
          }
        )
        if (secondApiResponse.ok) {
          const newResponse = await secondApiResponse.json()
          setApiInProgress(true)

          // setActualData((prevData) => ({
          //   ...prevData,
          //   actual: { ...prevData.actual, [formattedDate]: newData.demand }, // Assuming newData contains the new value with a `value` key
          // }))
          const correctionData = newResponse.correction;
    const baseDate = new Date(formattedDate);
    const correctedEntries = {
      [formattedDate]: newData.demand
    };
    
    correctionData.reduce((acc, correctionValue, index) => {
      // Increment baseDate by 1 hour for each index
      const correctedDate = new Date(baseDate.getTime() + ((index + 1) * 60 * 60 * 1000));
      const correctedDateString = `${correctedDate.getFullYear()}-${String(correctedDate.getMonth() + 1).padStart(2, '0')}-${String(correctedDate.getDate()).padStart(2, '0')}T${String(correctedDate.getHours()).padStart(2, '0')}:${String(correctedDate.getMinutes()).padStart(2, '0')}:${String(correctedDate.getSeconds()).padStart(2, '0')}`;
    
      // Accumulate corrected date-value pairs
      acc[correctedDateString] = correctionValue;
      return acc;
    }, correctedEntries);
    setActualData((prevData) => ({
        ...prevData,
        corrected: correctedEntries, // Directly set corrected to new entries, replacing any old ones

        // Preserving the 'actual' key updates as previously implemented
        actual: { ...prevData.actual, [formattedDate]: newData.demand },
    }));
          // Handle success
        } else {
          // Handle error
        }
        // Update actualData with the new data
      }
    } catch (error) {
      console.error("Failed to poll data:", error)
    } 
  }
  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {}, [actualData])
  useInterval(
    () => {
      pollData() 
    },
    2000,
    apiInProgress
  );
  return (
    <div className="flex min-panel-height  p-6 flex-col">
      <Card className="mb-2" >
        <CardContent className="p-0">
          <CombinedForecastChart
            currentData={
              Object.keys(actualData).length > 0
                ? Object.entries(actualData.actual).map(([key, value]) => ({
                    x: key,
                    y: value,
                  }))
                : []
            }
            predictedData={
              Object.keys(actualData).length > 0
                ? Object.entries(actualData.predicted).map(([key, value]) => ({
                    x: key,
                    y: value,
                  }))
                : []
            }
            correctedData={
              actualData && actualData.corrected
                ? Object.entries(actualData.corrected).map(([key, value]) => ({
                    x: key,
                    y: value,
                  }))
                : []
            }
          />
        </CardContent>
      </Card>
      <Card >
      <CardContent className="p-0">
          
          <AreaChart />
        </CardContent>
      </Card>
      <div className="w-full"></div>
      {/* <span className="font-semibold w-full">
        <ForecastChart
          currentData={data}
          predictedData={data4}
        />{" "}
      </span> */}
    </div>
  )
}

export default Dashboard
