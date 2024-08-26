import { BellIcon, CheckIcon } from "@radix-ui/react-icons"

import { category, cn, green } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { useActiveAuthContext } from "./DataProvider"

function calculateMaximumLoadFromObjectValues(demandObject) {
  // Extract values from the object and convert them to numbers
  const demandArray = Object.values(demandObject).map((value) => Number(value))

  // Calculate the maximum value
  return Math.max(...demandArray).toFixed(2)
}
function calculateCapacityUtilization(demandObject) {
  const demandArray = Object.values(demandObject).map((value) => Number(value))

  const averageDemand =
    demandArray.reduce((acc, demand) => acc + demand, 0) / demandArray.length
  const maxDemand = Math.max(...demandArray)
  return ((averageDemand / maxDemand) * 100).toFixed(2)
}
function calculateMinumumLoadFromObjectValues(demandObject) {
  // Extract values from the object and convert them to numbers
  const demandArray = Object.values(demandObject).map((value) => Number(value))

  // Calculate the maximum value
  return Math.min(...demandArray).toFixed(2)
}
function calculateDemandForecastAccuracy(actualArray, forecastArray) {
  const sumOfAbsoluteErrors = actualArray.reduce(
    (acc, actual, index) => acc + Math.abs(actual - forecastArray[index]),
    0
  )
  const sumOfActuals = actualArray.reduce((acc, actual) => acc + actual, 0)
  return 100 * (1 - sumOfAbsoluteErrors / sumOfActuals)
}
function calculateDelta(actualArray, forecastArray) {
  const sumOfAbsoluteErrors = actualArray.reduce(
    (acc, actual, index) => acc + Math.abs(actual - forecastArray[index]),
    0
  )
  const sumOfActuals = actualArray.reduce((acc, actual) => acc + actual, 0)
  return Math.abs(sumOfAbsoluteErrors / sumOfActuals)
}
function prepareDataAndCalculateAccuracy(data) {
  const { predicted, corrected } = data

  // Find common keys in both predicted and corrected objects
  const commonKeys = Object.keys(corrected).filter((key) =>
    predicted.hasOwnProperty(key)
  )

  // Extract values for these common keys from both objects
  const actualArray = commonKeys.map((key) =>
    Math.round(parseFloat(corrected[key]))
  )
  const forecastArray = commonKeys.map((key) =>
    Math.round(parseFloat(predicted[key]))
  )
  console.log(actualArray, forecastArray)
  if (actualArray.length === 0 || forecastArray.length === 0) {
    console.log("No valid data available for calculation.")
    return "N/A" // Or return a default value that makes sense for your application
  }
  // Calculate and return the forecast accuracy
  return calculateDemandForecastAccuracy(actualArray, forecastArray).toFixed(2)
}
function prepareDelta(data) {
  const { predicted, corrected } = data

  // Find common keys in both predicted and corrected objects
  const commonKeys = Object.keys(corrected).filter((key) =>
    predicted.hasOwnProperty(key)
  )

  // Extract values for these common keys from both objects
  const actualArray = commonKeys.map((key) =>
    Math.round(parseFloat(corrected[key]))
  )
  const forecastArray = commonKeys.map((key) =>
    Math.round(parseFloat(predicted[key]))
  )
  console.log(actualArray, forecastArray)
  if (actualArray.length === 0 || forecastArray.length === 0) {
    console.log("No valid data available for calculation.")
    return "N/A" // Or return a default value that makes sense for your application
  }
  // Calculate and return the forecast accuracy
  return calculateDelta(actualArray, forecastArray).toFixed(2)
}
function calculateRenewableEnergyIntegration(demandArray, renewableArray) {
  const totalRenewableGeneration = renewableArray.reduce(
    (acc, renewable, index) => acc + renewable,
    0
  )
  const totalDemand = demandArray.reduce((acc, demand) => acc + demand, 0)
  return (totalRenewableGeneration / totalDemand) * 100
}
function arraysToObject(a, b) {
  return a.reduce((obj, key, index) => ({ ...obj, [key]: b[index] }), {})
}
function prepareRenewableEnergyIntegration(corrected) {
  const predicted = arraysToObject(category, green)

  // Find common keys in both predicted and corrected objects
  const commonKeys = Object.keys(corrected).filter((key) =>
    predicted.hasOwnProperty(key)
  )

  // Extract values for these common keys from both objects
  const actualArray = commonKeys.map((key) =>
    Math.round(parseFloat(corrected[key]))
  )
  const forecastArray = commonKeys.map((key) =>
    Math.round(parseFloat(predicted[key]))
  )
  console.log(actualArray, forecastArray)
  if (actualArray.length === 0 || forecastArray.length === 0) {
    console.log("No valid data available for calculation.")
    return "N/A" // Or return a default value that makes sense for your application
  }
  // Calculate and return the forecast accuracy
  return calculateRenewableEnergyIntegration(
    actualArray,
    forecastArray
  ).toFixed(2)
}

export default function CardDemo({ className, ...props }) {
  const [maximumLoad, setMaximumLoad] = useState("")
  const [minumumLoad, setMinumumLoad] = useState("")
  const [capacityUtilisation, setCapacityUtilisation] = useState("")
  const [accuracy, setAccuracy] = useState("")
  const [deltaData, setDeltaData] = useState("")
  const [renewable, setRenewable] = useState("")
  const { actualData, setActualData } = useActiveAuthContext()
  useEffect(() => {
    if (actualData) {
      const maximumNewLoad = calculateMaximumLoadFromObjectValues(
        actualData?.actual
      )
      setMaximumLoad(maximumNewLoad)
      const minumumNewLoad = calculateMinumumLoadFromObjectValues(
        actualData?.actual
      )
      setMinumumLoad(minumumNewLoad)
      const newAccuracy = prepareDataAndCalculateAccuracy(actualData)
      setAccuracy(newAccuracy)

      const utilisation = calculateCapacityUtilization(actualData?.actual)
      setCapacityUtilisation(utilisation)

      const renewableData = prepareRenewableEnergyIntegration(
        actualData?.corrected
      )
      setRenewable(renewableData)

      const delta = prepareDelta(actualData)
      setDeltaData(delta)
    }
    console.log(actualData)
  }, [actualData])
  return (
    <div className="flex min-panel-height  p-6 flex-col">
      <Card className={cn("w-[380px] h-full", className)} {...props}>
        <CardHeader>
          <CardTitle>KPI's</CardTitle>
          <CardDescription>Last 24 Hours</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className=" flex gap-2.5">
              <Card className="w-full">
                <CardTitle className="flex gap-2.5">
                  {" "}
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <span>{maximumLoad} MW</span>
                </CardTitle>
                <CardContent className="p-2"> {"Maximum Load"}</CardContent>
              </Card>
              <Card className="w-full">
                <CardTitle className="flex gap-2.5">
                  {" "}
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <span>{minumumLoad} MW</span>
                </CardTitle>{" "}
                <CardContent className="p-2"> {"Minimum  Load"}</CardContent>
              </Card>
            </div>
            <CardHeader className="p-0">
          <CardTitle >Realtime Efficiency KPI's</CardTitle>
        </CardHeader>
            <Card>
              <CardTitle className="flex gap-2.5">
                {" "}
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <span>{accuracy} %</span>
              </CardTitle>{" "}
              <CardContent className="p-2">
                {" "}
                {"Demand Forecast  Accuracy"}
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="flex gap-2.5">
                {" "}
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <span>{renewable} %</span>
              </CardTitle>{" "}
              <CardContent className="p-2">
                {" "}
                {"Renewable Energy Integration"}
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="flex gap-2.5">
                {" "}
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <span> {capacityUtilisation} %</span>
              </CardTitle>{" "}
              <CardContent className="p-2">
                {" "}
                {"Capacity Utilisation"}
              </CardContent>
            </Card>
            <Card>
              <CardTitle className="flex gap-2.5">
                {" "}
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <span> {deltaData} MW</span>
              </CardTitle>{" "}
              <CardContent className="p-2">
                {" "}
                {"Delta Efficiency"}              </CardContent>
            </Card>
            
        </CardContent>
      </Card>
    </div>
  )
}
