"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { WeatherData } from "@/lib/FetchingSensorData"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Menu, Thermometer, Droplets, Gauge, Sprout } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface WeatherChartsProps {
  data: WeatherData
  isMobile: boolean
}

type HeatmapVariable = "temperature" | "humidity" | "pressure" | "dew" | "rainfall" | "sunlight" | "windspeed"

export default function WeatherCharts({ data, isMobile }: WeatherChartsProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
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
        text: "",
        font: {
          size: 14,
          color: "#475569",
        },
        standoff: 15,
      },
      nticks: 10,
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

  const commonConfig = {
    responsive: true,
    displayModeBar: false,
  }

  // Update temperature config to only show temperature
  const temperatureConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.temperatures,
        type: "scatter",
        mode: "lines+markers",
        name: "Suhu",
        line: { color: "#f43f5e", ...lineStyle },
        marker: { color: "#f43f5e", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      height: chartHeight,
      title: {
        text: "",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Suhu (°C)",
        },
      },
    },
    config: commonConfig,
  }

  const humidityConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.humidity,
        type: "scatter",
        mode: "lines+markers",
        name: "Kelembapan",
        line: { color: "#3b82f6", ...lineStyle },
        marker: { color: "#3b82f6", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Kelembapan (%)",
        },
      },
    },
    config: commonConfig,
  }

  const pressureConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.pressure,
        type: "scatter",
        mode: "lines+markers",
        name: "Tekanan",
        line: { color: "#f59e0b", ...lineStyle },
        marker: { color: "#f59e0b", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Tekanan (hPa)",
        },
      },
    },
    config: commonConfig,
  }

  const voltageConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.volt,
        type: "scatter",
        mode: "lines+markers",
        name: "Baterai",
        line: { color: "#8b5cf6", ...lineStyle },
        marker: { color: "#8b5cf6", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Tegangan Baterai Seiring Waktu",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Tegangan (V)",
        },
      },
    },
    config: commonConfig,
  }

  // New comparison charts
  const tempVsDewConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.temperatures,
        type: "scatter",
        mode: "lines+markers",
        name: "Suhu",
        line: { color: "#f43f5e", ...lineStyle },
        marker: { color: "#f43f5e", ...markerStyle },
      },
      {
        x: data.timestamps,
        y: data.dew,
        type: "scatter",
        mode: "lines+markers",
        name: "Titik Embun",
        line: { color: "#10b981", ...lineStyle },
        marker: { color: "#10b981", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      height: chartHeight,
      title: {
        text: "",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Suhu (°C)",
        },
      },
    },
    config: commonConfig,
  }

  const tempVsHumidityConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.temperatures,
        type: "scatter",
        mode: "lines+markers",
        name: "Suhu (°C)",
        line: { color: "#f43f5e", ...lineStyle },
        marker: { color: "#f43f5e", ...markerStyle },
        yaxis: "y",
      },
      {
        x: data.timestamps,
        y: data.humidity,
        type: "scatter",
        mode: "lines+markers",
        name: "Kelembapan (%)",
        line: { color: "#3b82f6", ...lineStyle },
        marker: { color: "#3b82f6", ...markerStyle },
        yaxis: "y2",
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Perbandingan Suhu vs Kelembapan",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Suhu (°C)",
        },
        gridcolor: "rgba(203, 213, 225, 0.2)",
      },
      yaxis2: {
        title: {
          text: "Kelembapan (%)",
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
    config: commonConfig,
  }

  // Add new charts for rainfall, sunlight, and wind speed
  const rainfallAndRateConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.rainfall,
        type: "bar",
        name: "Curah Hujan (mm)",
        marker: { color: "#0ea5e9" },
        yaxis: "y",
      },
      {
        x: data.timestamps,
        y: data.rainrate,
        type: "scatter",
        mode: "lines+markers",
        name: "Laju Hujan (mm/j)",
        line: { color: "#FFCC00", ...lineStyle },
        marker: { color: "FFCC00", ...markerStyle },
        yaxis: "y2",
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Curah Hujan & Laju Hujan Seiring Waktu",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Curah Hujan (mm)",
        },
      },
      yaxis2: {
        title: "Laju Hujan (mm/j)",
        titlefont: { color: "#6366f1" },
        tickfont: { color: "#6366f1" },
        overlaying: "y",
        side: "right",
        gridcolor: "rgba(203, 213, 225, 0.1)",
      },
      barmode: "group",
    },
    config: commonConfig,
  }

  const sunlightConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.sunlight,
        type: "scatter",
        mode: "lines+markers",
        name: "Cahaya Matahari",
        line: { color: "#eab308", ...lineStyle }, // yellow-500
        marker: { color: "#eab308", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Intensitas Cahaya Matahari Seiring Waktu",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Cahaya Matahari (lux)",
        },
      },
    },
    config: commonConfig,
  }

  const windspeedConfig = {
    data: [
      {
        x: data.timestamps,
        y: data.windspeed,
        type: "scatter",
        mode: "lines+markers",
        name: "Kecepatan Angin",
        line: { color: "#14b8a6", ...lineStyle }, // teal-500
        marker: { color: "#14b8a6", ...markerStyle },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Kecepatan Angin Seiring Waktu",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Kecepatan Angin (km/j)",
        },
      },
    },
    config: commonConfig,
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
        title = "Suhu"
        unit = "°C"
        break
      case "humidity":
        colorscale = "Blues" // blue-white
        title = "Kelembapan"
        unit = "%"
        break
      case "pressure":
        colorscale = "Viridis" // viridis
        title = "Tekanan"
        unit = "hPa"
        break
      case "dew":
        colorscale = "YlGnBu" // cool-warm
        title = "Titik Embun"
        unit = "°C"
        break
      case "rainfall":
        colorscale = "Blues" // blue-white
        title = "Curah Hujan"
        unit = "mm"
        break
      case "sunlight":
        colorscale = "YlOrRd" // yellow-orange-red
        title = "Cahaya Matahari"
        unit = "lux"
        break
      case "windspeed":
        colorscale = "Greens" // greens
        title = "Kecepatan Angin"
        unit = "km/j"
        break
      default:
        colorscale = "RdBu"
        title = "Suhu"
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
        text: `Peta Panas ${title} Harian`,
        font: {
          size: 16,
        },
      },
      xaxis: {
        title: {
          text: "Menit",
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
          text: "Jam",
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
    config: commonConfig,
  }

  // Prepare data for the table
  const tableData = data.timestamps
    .map((time, index) => ({
      time,
      temperature: data.temperatures[index]?.toFixed(2) || "N/A",
      humidity: data.humidity[index]?.toFixed(2) || "N/A",
      pressure: data.pressure[index]?.toFixed(2) || "N/A",
      dew: data.dew[index]?.toFixed(3) || "N/A",
      volt: data.volt[index]?.toFixed(3) || "N/A",
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
            <TableHead>Waktu</TableHead>
            <TableHead>Suhu (°C)</TableHead>
            <TableHead>Kelembapan (%)</TableHead>
            <TableHead>Tekanan (hPa)</TableHead>
            <TableHead>Embun (°C)</TableHead>
            <TableHead>Baterai (V)</TableHead>
            <TableHead>Curah Hujan (mm)</TableHead>
            <TableHead>Laju Hujan (mm/j)</TableHead>
            <TableHead>Radiasi Surya (lux)</TableHead>
            <TableHead>Angin (km/j)</TableHead>
            <TableHead>Arah (°)</TableHead>
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
            Muat Lebih Banyak
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
      <h3 className="text-sm font-medium mb-2">Pilih Variabel:</h3>
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
            Suhu
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="humidity" id="humidity" />
          <Label
            htmlFor="humidity"
            className={cn("cursor-pointer", heatmapVariable === "humidity" ? "font-medium text-primary" : "")}
          >
            Kelembapan
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pressure" id="pressure" />
          <Label
            htmlFor="pressure"
            className={cn("cursor-pointer", heatmapVariable === "pressure" ? "font-medium text-primary" : "")}
          >
            Tekanan
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dew" id="dew" />
          <Label htmlFor="dew" className={cn("cursor-pointer", heatmapVariable === "dew" ? "font-medium text-primary" : "")}>
            Titik Embun
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="rainfall" id="rainfall" />
          <Label
            htmlFor="rainfall"
            className={cn("cursor-pointer", heatmapVariable === "rainfall" ? "font-medium text-primary" : "")}
          >
            Curah Hujan
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sunlight" id="sunlight" />
          <Label
            htmlFor="sunlight"
            className={cn("cursor-pointer", heatmapVariable === "sunlight" ? "font-medium text-primary" : "")}
          >
            Cahaya Matahari
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="windspeed" id="windspeed" />
          <Label
            htmlFor="windspeed"
            className={cn("cursor-pointer", heatmapVariable === "windspeed" ? "font-medium text-primary" : "")}
          >
            Kecepatan Angin
          </Label>
        </div>
      </RadioGroup>
    </div>
  )

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="border-2 border-primary/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Tren Cuaca</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            {isMobile ? (
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-muted-foreground">
                  {activeTab === "overview" && "Tinjauan"}
                  {activeTab === "precipitation" && "Presipitasi"}
                  {activeTab === "sunlight" && "Radiasi Surya"}
                  {activeTab === "windspeed" && "Kecepatan Angin"}
                  {activeTab === "voltage" && "Baterai"}
                  {activeTab === "temp-humidity" && "Suhu vs Kelembapan"}
                  {activeTab === "heatmap" && "Peta Panas"}
                  {activeTab === "table" && "Tabel Data"}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Buka menu grafik</span>
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Tren Cuaca</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setActiveTab("overview")}
                      className={cn(activeTab === "overview" && "bg-muted")}
                    >
                      Tinjauan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                      Presipitasi
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setActiveTab("precipitation")}
                      className={cn(activeTab === "precipitation" && "bg-muted")}
                    >
                      Curah Hujan & Laju
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                      Pengukuran Lain
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setActiveTab("sunlight")}
                      className={cn(activeTab === "sunlight" && "bg-muted")}
                    >
                      Radiasi Surya
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveTab("windspeed")}
                      className={cn(activeTab === "windspeed" && "bg-muted")}
                    >
                      Kecepatan Angin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveTab("voltage")}
                      className={cn(activeTab === "voltage" && "bg-muted")}
                    >
                      Baterai
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                      Perbandingan & Analisis
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setActiveTab("temp-humidity")}
                      className={cn(activeTab === "temp-humidity" && "bg-muted")}
                    >
                      Suhu VS Kelembapan
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveTab("heatmap")}
                      className={cn(activeTab === "heatmap" && "bg-muted")}
                    >
                      Peta Panas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveTab("table")}
                      className={cn(activeTab === "table" && "bg-muted")}
                    >
                      Tabel Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <TabsList className="mb-4 grid h-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap">
                <TabsTrigger value="overview">Tinjauan</TabsTrigger>
                <TabsTrigger value="precipitation">Presipitasi</TabsTrigger>
                <TabsTrigger value="sunlight">Radiasi Surya</TabsTrigger>
                <TabsTrigger value="windspeed">Kecepatan Angin</TabsTrigger>
                <TabsTrigger value="voltage">Baterai</TabsTrigger>
                <TabsTrigger value="temp-humidity">Suhu vs Kelembapan</TabsTrigger>
                <TabsTrigger value="heatmap">Peta Panas</TabsTrigger>
                <TabsTrigger value="table">Tabel Data</TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-primary/20 dark:border-primary/40 border-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-base font-medium">Suhu</CardTitle>
                    <Thermometer className="h-5 w-5 text-rose-500" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="w-full h-[350px]">
                      <Plot
                        data={temperatureConfig.data}
                        layout={temperatureConfig.layout}
                        config={temperatureConfig.config}
                        className="w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 dark:border-primary/40 border-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-base font-medium">Kelembapan</CardTitle>
                    <Droplets className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="w-full h-[350px]">
                      <Plot
                        data={humidityConfig.data}
                        layout={{ ...humidityConfig.layout, height: chartHeight }}
                        config={humidityConfig.config}
                        className="w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 dark:border-primary/40 border-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-base font-medium">Tekanan</CardTitle>
                    <Gauge className="h-5 w-5 text-amber-500" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="w-full h-[350px]">
                      <Plot
                        data={pressureConfig.data}
                        layout={{ ...pressureConfig.layout, height: chartHeight }}
                        config={pressureConfig.config}
                        className="w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 dark:border-primary/40 border-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-base font-medium">Titik Embun</CardTitle>
                    <Sprout className="h-5 w-5 text-emerald-500" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="w-full h-[350px]">
                      <Plot
                        data={tempVsDewConfig.data}
                        layout={{ ...tempVsDewConfig.layout, height: chartHeight }}
                        config={tempVsDewConfig.config}
                        className="w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="voltage" className="mt-0">
              <ChartDescription description="Grafik ini menunjukkan pembacaan tegangan baterai dari waktu ke waktu. Sumbu X mewakili waktu (JJ:MM:DD) dan sumbu Y menunjukkan tegangan dalam volt (V)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={voltageConfig.data}
                  layout={{ ...voltageConfig.layout, height: chartHeight }}
                  config={voltageConfig.config}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="precipitation" className="mt-0">
              <ChartDescription description="Grafik ini menunjukkan curah hujan (batang) dan laju hujan (garis) dari waktu ke waktu. Sumbu Y kiri untuk curah hujan (mm) dan sumbu Y kanan untuk laju hujan (mm/j)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={rainfallAndRateConfig.data}
                  layout={{ ...rainfallAndRateConfig.layout, height: chartHeight }}
                  config={rainfallAndRateConfig.config}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="sunlight" className="mt-0">
              <ChartDescription description="Grafik ini menunjukkan pengukuran intensitas cahaya matahari dari waktu ke waktu. Sumbu X mewakili waktu (JJ:MM:DD) dan sumbu Y menunjukkan intensitas cahaya matahari dalam lux." />
              <div className="w-full h-[400px]">
                <Plot
                  data={sunlightConfig.data}
                  layout={{ ...sunlightConfig.layout, height: chartHeight }}
                  config={sunlightConfig.config}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="windspeed" className="mt-0">
              <ChartDescription description="Grafik ini menunjukkan pengukuran kecepatan angin dari waktu ke waktu. Sumbu X mewakili waktu (JJ:MM:DD) dan sumbu Y menunjukkan kecepatan angin dalam kilometer per jam (km/j)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={windspeedConfig.data}
                  layout={{ ...windspeedConfig.layout, height: chartHeight }}
                  config={windspeedConfig.config}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="temp-humidity" className="mt-0">
              <ChartDescription description="Grafik ini membandingkan pembacaan suhu dan kelembapan dari waktu ke waktu. Sumbu X mewakili waktu (JJ:MM:DD), sumbu Y kiri menunjukkan suhu dalam derajat Celsius (°C), dan sumbu Y kanan menunjukkan kelembapan dalam persentase (%)." />
              <div className="w-full h-[400px]">
                <Plot
                  data={tempVsHumidityConfig.data}
                  layout={{ ...tempVsHumidityConfig.layout, height: chartHeight }}
                  config={tempVsHumidityConfig.config}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="heatmap" className="mt-0">
              <ChartDescription description="Peta panas ini memvisualisasikan pola data sepanjang hari. Sumbu X mewakili menit (MM), sumbu Y mewakili jam (JJ), dan intensitas warna menunjukkan nilai dari variabel yang dipilih." />
              <HeatmapVariableSelector />
              <div className="w-full h-[600px]">
                <Plot
                  data={heatmapConfig.data}
                  layout={heatmapConfig.layout}
                  config={heatmapConfig.config}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="mt-0">
              <ChartDescription description="Tabel ini menampilkan semua data cuaca yang tercatat dalam urutan kronologis, dengan pembacaan terbaru di bagian atas." />
              <TableContent />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}