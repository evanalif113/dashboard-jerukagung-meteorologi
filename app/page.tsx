"use client"

import { useState, useEffect } from "react"
import { useWeatherData } from "@/lib/use-weather-data"
import { useToast } from "@/lib/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { ThemeProvider } from "@/components/theme-provider"
import WeatherHeader from "@/components/weather-header"
import WeatherCards from "@/components/weather-cards"
import AstronomicalData from "@/components/astronomical-data"
import WeatherInterpretation from "@/components/weather-interpretation"
import WeatherCharts from "@/components/weather-charts"
import ErrorState from "@/components/error-state"
import { Toaster } from "@/components/ui/toaster"

export default function WeatherDashboard() {
  const [sensorId, setSensorId] = useState("id-03")
  const [dataPoints, setDataPoints] = useState(60)
  const { data, loading, error } = useWeatherData(sensorId, dataPoints)
  const { addToast: toast } = useToast()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleSensorChange = (newSensorId: string) => {
    setSensorId(newSensorId)
    toast({
      title: "Sensor changed",
      description: `Now showing data from sensor ${newSensorId}`,
    })
  }

  const handleDataPointsChange = (newDataPoints: number) => {
    setDataPoints(newDataPoints)

    let timeDescription = `${newDataPoints} minutes`
    if (newDataPoints === 60) timeDescription = "1 hour"
    else if (newDataPoints === 120) timeDescription = "2 hours"
    else if (newDataPoints === 240) timeDescription = "4 hours"
    else if (newDataPoints === 720) timeDescription = "12 hours"
    else if (newDataPoints === 1440) timeDescription = "24 hours"

    toast({
      title: "Time interval updated",
      description: `Now showing data from the last ${timeDescription}`,
    })
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="weather-theme-preference">
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <WeatherHeader
              sensorId={sensorId}
              onSensorChange={handleSensorChange}
              dataPoints={dataPoints}
              onDataPointsChange={handleDataPointsChange}
              isLoading={loading}
            />
          </div>

          {loading ? (
            null
          ) : error ? (
            <ErrorState error={error} />
          ) : (
            <>
              <WeatherCards data={data} isMobile={isMobile} />
              <AstronomicalData className="mb-6 mt-2" />
              <WeatherInterpretation data={data} />
              <WeatherCharts data={data} isMobile={isMobile} />
            </>
          )}
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
