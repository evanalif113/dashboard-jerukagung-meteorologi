"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { WeatherData } from "@/lib/use-weather-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js").then((mod) => mod.default), { ssr: false })

interface WeatherChartsProps {
  data: WeatherData
  isMobile: boolean
}

type HeatmapVariable = "temperature" | "humidity" | "pressure" | "dew" | "rainfall" | "sunlight" | "windspeed"

export default function WeatherCharts({ data, isMobile }: WeatherChartsProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("temperature")
  const [tablePageSize, setTablePageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [heatmapVariable, setHeatmapVariable] = useState<HeatmapVariable>("temperature")

  // Ensure component is mounted before rendering Plotly
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const chartHeight = isMobile ? 300 : 400

  const commonLayout = {
    autosize: true,
    margin: { l: 60, r: 40, t: 40, b: 60 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: {
      family: "Inter, sans-serif",
      color: "#64748b",
    },
    xaxis: {
      gridcolor: "rgba(203, 213, 225, 0.2)",
      title: {
        text: "Time (HH:MM:SS)",
        font: {
          size: 14,
          color: "#475569",
        },
        standoff: 15,
      },
    },
    yaxis: {
      gridcolor: "rgba(203, 213, 225, 0.2)",
      title: {
        font: {
          size: 14,
          color: "#475569",
        },
        standoff: 15,
      },
    },
    legend: {
      orientation: "h",
      y: -0.2,
      font: {
        size: 12,
      },
    },
    hovermode: "closest",
  }

  // Common line and marker styles for consistency
  const lineStyle = {
    width: 3,
  }

  const markerStyle = {
    size: 6,
  }

  // Update temperature config to only show temperature
  const temperatureConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.temperatures,
        type: "scatter",
        mode: "lines+markers",
        name: "Temperature",
        line: { color: "#f43f5e", ...lineStyle },
        marker: { color: "#f43f5e", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Temperature Over Time",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Temperature (°C)",
        },
      },
    },
  }

  const humidityConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.humidity,
        type: "scatter",
        mode: "lines+markers",
        name: "Humidity",
        line: { color: "#3b82f6", ...lineStyle },
        marker: { color: "#3b82f6", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Humidity Over Time",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Humidity (%)",
        },
      },
    },
  }

  const pressureConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.pressure,
        type: "scatter",
        mode: "lines+markers",
        name: "Pressure",
        line: { color: "#f59e0b", ...lineStyle },
        marker: { color: "#f59e0b", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Atmospheric Pressure Over Time",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Pressure (hPa)",
        },
      },
    },
  }

  const voltageConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.volt,
        type: "scatter",
        mode: "lines+markers",
        name: "Battery",
        line: { color: "#8b5cf6", ...lineStyle },
        marker: { color: "#8b5cf6", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Battery Voltage Over Time",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Voltage (V)",
        },
      },
    },
  }

  // New comparison charts
  const tempVsDewConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.temperatures,
        type: "scatter",
        mode: "lines+markers",
        name: "Temperature",
        line: { color: "#f43f5e", ...lineStyle },
        marker: { color: "#f43f5e", ...markerStyle },
      },
      {
        x: data.timestamps,
        y: data.dew,
        type: "scatter",
        mode: "lines+markers",
        name: "Dew Point",
        line: { color: "#10b981", ...lineStyle },
        marker: { color: "#10b981", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Temperature vs Dew Point Comparison",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Temperature (°C)",
        },
      },
    },
  }

  const tempVsHumidityConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.temperatures,
        type: "scatter",
        mode: "lines+markers",
        name: "Temperature (°C)",
        line: { color: "#f43f5e", ...lineStyle },
        marker: { color: "#f43f5e", ...markerStyle },
        yaxis: "y",
      },
      {
        x: data.timestamps,
        y: data.humidity,
        type: "scatter",
        mode: "lines+markers",
        name: "Humidity (%)",
        line: { color: "#3b82f6", ...lineStyle },
        marker: { color: "#3b82f6", ...markerStyle },
        yaxis: "y2",
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Temperature vs Humidity Comparison",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Temperature (°C)",
        },
        gridcolor: "rgba(203, 213, 225, 0.2)",
      },
      yaxis2: {
        title: {
          text: "Humidity (%)",
          font: {
            size: 14,
            color: "#3b82f6",
          },
          standoff: 15,
        },
        titlefont: { color: "#3b82f6" },
        tickfont: { color: "#3b82f6" },
        overlaying: "y",
        side: "right",
        gridcolor: "rgba(203, 213, 225, 0.1)",
      },
    },
  }

  // Add new charts for rainfall, sunlight, and wind speed
  const rainfallConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.rainfall,
        type: "scatter",
        mode: "lines+markers",
        name: "Rainfall",
        line: { color: "#0ea5e9", ...lineStyle }, // sky-500
        marker: { color: "#0ea5e9", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Rainfall Over Time",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Rainfall (mm)",
        },
      },
    },
  }

  const rainrateConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.rainrate,
        type: "scatter",
        mode: "lines+markers",
        name: "Rain Rate",
        line: { color: "#6366f1", ...lineStyle }, // indigo-500
        marker: { color: "#6366f1", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Rain Rate Over Time",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Rain Rate (mm/h)",
        },
      },
    },
  }

  const sunlightConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.sunlight,
        type: "scatter",
        mode: "lines+markers",
        name: "Sunlight",
        line: { color: "#eab308", ...lineStyle }, // yellow-500
        marker: { color: "#eab308", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Sunlight Intensity Over Time",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Sunlight (lux)",
        },
      },
    },
  }

  const windspeedConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.windspeed,
        type: "scatter",
        mode: "lines+markers",
        name: "Wind Speed",
        line: { color: "#14b8a6", ...lineStyle }, // teal-500
        marker: { color: "#14b8a6", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Wind Speed Over Time",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Time (HH:MM:SS)",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Wind Speed (km/h)",
        },
      },
    },
  }

  // Create heatmap data for different variables
  const createHeatmapData = (variable: HeatmapVariable) => {
    // Initialize a 24x60 matrix (hours x minutes) with zeros
    const heatmapMatrix = Array(24)
      .fill(0)
      .map(() => Array(60).fill(null))
    const countMatrix = Array(24)
      .fill(0)
      .map(() => Array(60).fill(0))

    // Get the appropriate data array based on the selected variable
    let dataArray: number[]
    switch (variable) {
      case "temperature":
        dataArray = data.temperatures
        break
      case "humidity":
        dataArray = data.humidity
        break
      case "pressure":
        dataArray = data.pressure
        break
      case "dew":
        dataArray = data.dew
        break
      case "rainfall":
        dataArray = data.rainfall
        break
      case "sunlight":
        dataArray = data.sunlight
        break
      case "windspeed":
        dataArray = data.windspeed
        break
      default:
        dataArray = data.temperatures
    }

    // Process timestamps to extract hour and minute
    data.timestamps.forEach((timestamp, index) => {
      try {
        // Parse the timestamp (format: "HH:MM:SS")
        const [hours, minutes] = timestamp.split(":").map(Number)

        if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
          // Add value to the corresponding cell
          if (heatmapMatrix[hours][minutes] === null) {
            heatmapMatrix[hours][minutes] = dataArray[index]
          } else {
            heatmapMatrix[hours][minutes] += dataArray[index]
          }
          countMatrix[hours][minutes]++
        }
      } catch (error) {
        console.error("Error parsing timestamp:", timestamp)
      }
    })

    // Calculate averages for cells with multiple values
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        if (countMatrix[hour][minute] > 0) {
          heatmapMatrix[hour][minute] /= countMatrix[hour][minute]
        }
      }
    }

    return heatmapMatrix
  }

  // Get the appropriate color scale and title based on the selected variable
  const getHeatmapConfig = (variable: HeatmapVariable) => {
    let colorscale: string
    let title: string
    let unit: string

    switch (variable) {
      case "temperature":
        colorscale = "RdBu" // cool-warm
        title = "Temperature"
        unit = "°C"
        break
      case "humidity":
        colorscale = "Blues" // blue-white
        title = "Humidity"
        unit = "%"
        break
      case "pressure":
        colorscale = "Viridis" // viridis
        title = "Pressure"
        unit = "hPa"
        break
      case "dew":
        colorscale = "YlGnBu" // cool-warm
        title = "Dew Point"
        unit = "°C"
        break
      case "rainfall":
        colorscale = "Blues" // blue-white
        title = "Rainfall"
        unit = "mm"
        break
      case "sunlight":
        colorscale = "YlOrRd" // yellow-orange-red
        title = "Sunlight"
        unit = "lux"
        break
      case "windspeed":
        colorscale = "Greens" // greens
        title = "Wind Speed"
        unit = "km/h"
        break
      default:
        colorscale = "RdBu"
        title = "Temperature"
        unit = "°C"
    }

    return { colorscale, title, unit }
  }

  const heatmapData = createHeatmapData(heatmapVariable)
  const { colorscale, title, unit } = getHeatmapConfig(heatmapVariable)

  // Create x and y axis labels
  const minuteLabels = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))
  const hourLabels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))

  const heatmapConfig = {
    data: [
      {
        z: heatmapData,
        x: minuteLabels,
        y: hourLabels,
        type: "heatmap",
        colorscale: colorscale,
        showscale: true,
        hoverongaps: false,
        colorbar: {
          title: {
            text: `${title} (${unit})`,
            font: {
              size: 14,
            },
          },
          titleside: "right",
        },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: `Daily ${title} Heatmap`,
        font: {
          size: 16,
        },
      },
      xaxis: {
        title: {
          text: "Minute",
          font: {
            size: 14,
            color: "#475569",
          },
          standoff: 15,
        },
        tickmode: "array",
        tickvals: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59],
        ticktext: ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "59"],
      },
      yaxis: {
        title: {
          text: "Hour",
          font: {
            size: 14,
            color: "#475569",
          },
          standoff: 15,
        },
        tickmode: "array",
        tickvals: Array.from({ length: 24 }, (_, i) => i),
        ticktext: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
      },
      height: chartHeight * 1.5,
    },
  }

  // Prepare data for the table
  const tableData = data.timestamps
    .map((time, index) => ({
      time,
      temperature: data.temperatures[index]?.toFixed(1) || "N/A",
      humidity: data.humidity[index]?.toFixed(1) || "N/A",
      pressure: data.pressure[index]?.toFixed(1) || "N/A",
      dew: data.dew[index]?.toFixed(1) || "N/A",
      volt: data.volt[index]?.toFixed(2) || "N/A",
      rainfall: data.rainfall[index]?.toFixed(2) || "N/A",
      rainrate: data.rainrate[index]?.toFixed(2) || "N/A",
      sunlight: data.sunlight[index]?.toLocaleString() || "N/A",
      windspeed: data.windspeed[index]?.toFixed(1) || "N/A",
      windir: data.windir[index]?.toFixed(0) || "N/A",
    }))
    .reverse() // Most recent first

  // Calculate pagination for table
  const totalPages = Math.ceil(tableData.length / tablePageSize)
  const paginatedData = tableData.slice(0, currentPage * tablePageSize)

  const loadMore = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // Update the table content section
  const TableContent = () => (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Temp (°C)</TableHead>
            <TableHead>Humidity (%)</TableHead>
            <TableHead>Pressure (hPa)</TableHead>
            <TableHead>Dew (°C)</TableHead>
            <TableHead>Battery (V)</TableHead>
            <TableHead>Rainfall (mm)</TableHead>
            <TableHead>Rain Rate (mm/h)</TableHead>
            <TableHead>Solar Radiation (lux)</TableHead>
            <TableHead>Wind (km/h)</TableHead>
            <TableHead>Direction (°)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.temperature}</TableCell>
              <TableCell>{row.humidity}</TableCell>
              <TableCell>{row.pressure}</TableCell>
              <TableCell>{row.dew}</TableCell>
              <TableCell>{row.volt}</TableCell>
              <TableCell>{row.rainfall}</TableCell>
              <TableCell>{row.rainrate}</TableCell>
              <TableCell>{row.sunlight}</TableCell>
              <TableCell>{row.windspeed}</TableCell>
              <TableCell>{row.windir}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {currentPage < totalPages && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )

  // Add chart descriptions
  const ChartDescription = ({ description }: { description: string }) => (
    <div className="text-sm text-muted-foreground mb-4">{description}</div>
  )

  // Heatmap variable selector
  const HeatmapVariableSelector = () => (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Select Variable:</h3>
      <RadioGroup
        value={heatmapVariable}
        onValueChange={(value) => setHeatmapVariable(value as HeatmapVariable)}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="temperature" id="temperature" />
          <Label
            htmlFor="temperature"
            className={cn("cursor-pointer", heatmapVariable === "temperature" ? "font-medium text-primary" : "")}
          >
            Temperature
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="humidity" id="humidity" />
          <Label
            htmlFor="humidity"
            className={cn("cursor-pointer", heatmapVariable === "humidity" ? "font-medium text-primary" : "")}
          >
            Humidity
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pressure" id="pressure" />
          <Label
            htmlFor="pressure"
            className={cn("cursor-pointer", heatmapVariable === "pressure" ? "font-medium text-primary" : "")}
          >
            Pressure
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dew" id="dew" />
          <Label
            htmlFor="dew"
            className={cn("cursor-pointer", heatmapVariable === "dew" ? "font-medium text-primary" : "")}
          >
            Dew Point
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="rainfall" id="rainfall" />
          <Label
            htmlFor="rainfall"
            className={cn("cursor-pointer", heatmapVariable === "rainfall" ? "font-medium text-primary" : "")}
          >
            Rainfall
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sunlight" id="sunlight" />
          <Label
            htmlFor="sunlight"
            className={cn("cursor-pointer", heatmapVariable === "sunlight" ? "font-medium text-primary" : "")}
          >
            Sunlight
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="windspeed" id="windspeed" />
          <Label
            htmlFor="windspeed"
            className={cn("cursor-pointer", heatmapVariable === "windspeed" ? "font-medium text-primary" : "")}
          >
            Wind Speed
          </Label>
        </div>
      </RadioGroup>
    </div>
  )

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="border-2 border-primary/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Weather Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temperature" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
              <TabsTrigger value="pressure">Pressure</TabsTrigger>
              <TabsTrigger value="rainfall">Rainfall</TabsTrigger>
              <TabsTrigger value="rainrate">Rain Rate</TabsTrigger>
              <TabsTrigger value="sunlight">Solar Radiation</TabsTrigger>
              <TabsTrigger value="windspeed">Wind Speed</TabsTrigger>
              <TabsTrigger value="voltage">Battery</TabsTrigger>
              <TabsTrigger value="temp-dew">Temp vs Dew</TabsTrigger>
              <TabsTrigger value="temp-humidity">Temp vs Humidity</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="table">Data Table</TabsTrigger>
            </TabsList>

            <TabsContent value="temperature" className="mt-0">
              <ChartDescription description="This chart shows temperature readings over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows temperature in degrees Celsius (°C)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={temperatureConfig.data}
                  layout={{ ...temperatureConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="humidity" className="mt-0">
              <ChartDescription description="This chart shows humidity readings over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows relative humidity as a percentage (%)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={humidityConfig.data}
                  layout={{ ...humidityConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="pressure" className="mt-0">
              <ChartDescription description="This chart shows atmospheric pressure readings over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows pressure in hectopascals (hPa)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={pressureConfig.data}
                  layout={{ ...pressureConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="voltage" className="mt-0">
              <ChartDescription description="This chart shows battery voltage readings over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows voltage in volts (V)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={voltageConfig.data}
                  layout={{ ...voltageConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="rainfall" className="mt-0">
              <ChartDescription description="This chart shows rainfall measurements over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows rainfall in millimeters (mm)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={rainfallConfig.data}
                  layout={{ ...rainfallConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="rainrate" className="mt-0">
              <ChartDescription description="This chart shows rain rate measurements over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows rain rate in millimeters per hour (mm/h)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={rainrateConfig.data}
                  layout={{ ...rainrateConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="sunlight" className="mt-0">
              <ChartDescription description="This chart shows sunlight intensity measurements over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows sunlight intensity in lux." />
              <div className="w-full h-[400px]">
                <Plot
                  data={sunlightConfig.data}
                  layout={{ ...sunlightConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="windspeed" className="mt-0">
              <ChartDescription description="This chart shows wind speed measurements over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows wind speed in kilometers per hour (km/h)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={windspeedConfig.data}
                  layout={{ ...windspeedConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="temp-dew" className="mt-0">
              <ChartDescription description="This chart compares temperature and dew point readings over time. The X-axis represents time (HH:MM:SS) and the Y-axis shows temperature in degrees Celsius (°C)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={tempVsDewConfig.data}
                  layout={{ ...tempVsDewConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="temp-humidity" className="mt-0">
              <ChartDescription description="This chart compares temperature and humidity readings over time. The X-axis represents time (HH:MM:SS), the left Y-axis shows temperature in degrees Celsius (°C), and the right Y-axis shows humidity as a percentage (%)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={tempVsHumidityConfig.data}
                  layout={{ ...tempVsHumidityConfig.layout, height: chartHeight }}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="heatmap" className="mt-0">
              <ChartDescription description="This heatmap visualizes data patterns throughout the day. The X-axis represents minutes (MM), the Y-axis represents hours (HH), and the color intensity indicates the value of the selected variable." />
              <HeatmapVariableSelector />
              <div className="w-full h-[600px]">
                <Plot
                  data={heatmapConfig.data}
                  layout={heatmapConfig.layout}
                  config={{ responsive: true }}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="mt-0">
              <ChartDescription description="This table displays all recorded weather data in chronological order, with the most recent readings at the top." />
              <TableContent />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
