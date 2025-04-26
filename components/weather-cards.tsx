"use client"

import { useState, useEffect } from "react"
import { Thermometer, Droplets, Gauge, CloudFog, Battery, CloudRain, Wind, Umbrella, Sun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WindCompass from "@/components/wind-compass"
import type { WeatherData } from "@/lib/use-weather-data"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface WeatherCardsProps {
  data: WeatherData
  isMobile: boolean
}

export default function WeatherCards({ data, isMobile }: WeatherCardsProps) {
  // Get the latest values
  const latestIndex = data.timestamps.length - 1
  const temperature = data.temperatures[latestIndex] || 0
  const humidity = data.humidity[latestIndex] || 0
  const pressure = data.pressure[latestIndex] || 0
  const dew = data.dew[latestIndex] || 0
  const volt = data.volt[latestIndex] || 0

  // Use real data from Firebase
  const currentRainfall = data.rainfall[latestIndex] || 0
  const currentRainRate = data.rainrate[latestIndex] || 0
  const sunlightIntensity = data.sunlight[latestIndex] || 0
  const windSpeed = data.windspeed[latestIndex] || 0
  const windDirection = data.windir[latestIndex] || 0

  // Calculate daily rainfall total
  const [dailyRainfallTotal, setDailyRainfallTotal] = useState<number>(0)
  const [rainStartTime, setRainStartTime] = useState<string>("")
  const [rainEndTime, setRainEndTime] = useState<string>("")
  const [rainDuration, setRainDuration] = useState<string>("")
  const [rainIntensity, setRainIntensity] = useState<string>("")
  const [hasRainToday, setHasRainToday] = useState<boolean>(false)

  useEffect(() => {
    // Get current date
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0] // YYYY-MM-DD format

    // Get indices of today's data
    const todayIndices = data.timestamps
      .map((timestamp, index) => {
        const [hours, minutes, seconds] = timestamp.split(":").map(Number)
        const timestampDate = new Date(today)
        timestampDate.setHours(hours, minutes, seconds)

        return timestampDate.toISOString().split("T")[0] === todayStr ? index : -1
      })
      .filter((index) => index !== -1)

    // Calculate total rainfall for today based on hourly rain rates
    let total = 0
    let maxRainRate = 0
    let firstRainTime = ""
    let lastRainTime = ""
    let hasRain = false

    // Process data points in chronological order
    for (let i = 0; i < todayIndices.length; i++) {
      const index = todayIndices[i]
      const rainrate = data.rainrate[index] || 0
      const timestamp = data.timestamps[index]

      // Track the maximum rain rate
      maxRainRate = Math.max(maxRainRate, rainrate)

      // Track rain start and end times
      if (rainrate > 0) {
        hasRain = true

        // If this is the first rain detection or we don't have a start time yet
        if (!firstRainTime) {
          firstRainTime = timestamp
        }

        // Always update the last rain time when rain is detected
        lastRainTime = timestamp
      }

      // Calculate rainfall amount for this time period
      if (i > 0) {
        const prevIndex = todayIndices[i - 1]
        const prevTimestamp = data.timestamps[prevIndex]
        const currentTimestamp = data.timestamps[index]

        // Calculate time difference in hours
        const [prevHours, prevMinutes, prevSeconds] = prevTimestamp.split(":").map(Number)
        const [currHours, currMinutes, currSeconds] = currentTimestamp.split(":").map(Number)

        // Convert to total seconds, then to fraction of hour
        const prevTimeInSeconds = prevHours * 3600 + prevMinutes * 60 + prevSeconds
        const currTimeInSeconds = currHours * 3600 + currMinutes * 60 + currSeconds

        // Handle day wrap (if current time is less than previous time)
        let diffInSeconds = currTimeInSeconds - prevTimeInSeconds
        if (diffInSeconds < 0) {
          diffInSeconds += 24 * 3600 // Add a full day in seconds
        }

        const diffInHours = diffInSeconds / 3600

        // Calculate rainfall for this period using average of previous and current rain rates
        const avgRainRate = (data.rainrate[prevIndex] + rainrate) / 2
        const rainfallAmount = avgRainRate * diffInHours

        total += rainfallAmount
      }
    }

    // Set rain intensity based on max rain rate
    if (maxRainRate === 0) {
      setRainIntensity("None")
    } else if (maxRainRate < 2.5) {
      setRainIntensity("Light")
    } else if (maxRainRate < 10) {
      setRainIntensity("Moderate")
    } else if (maxRainRate < 50) {
      setRainIntensity("Heavy")
    } else {
      setRainIntensity("Extreme")
    }

    // Calculate rain duration if we have both start and end times
    if (firstRainTime && lastRainTime) {
      const [startHours, startMinutes] = firstRainTime.split(":").map(Number)
      const [endHours, endMinutes] = lastRainTime.split(":").map(Number)

      let durationMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes)
      if (durationMinutes < 0) durationMinutes += 24 * 60 // Handle overnight

      const durationHours = Math.floor(durationMinutes / 60)
      const remainingMinutes = durationMinutes % 60

      setRainDuration(durationHours > 0 ? `${durationHours}h ${remainingMinutes}m` : `${remainingMinutes}m`)
      setRainStartTime(firstRainTime)
      setRainEndTime(lastRainTime)
      setHasRainToday(hasRain)
    } else {
      setRainDuration("")
      setRainStartTime("")
      setRainEndTime("")
      setHasRainToday(false)
    }

    // Round to 1 decimal place
    setDailyRainfallTotal(Math.round(total * 10) / 10)
  }, [data])

  // Calculate sunlight intensity percentage (assuming max is 120000 lux)
  const sunlightPercentage = Math.min(Math.round((sunlightIntensity / 120000) * 100), 100)

  // Determine sunlight intensity category
  const getSunlightCategory = (intensity: number) => {
    if (intensity < 1000) return "Low"
    if (intensity < 20000) return "Moderate"
    if (intensity < 50000) return "High"
    return "Very High"
  }

  // Determine rainfall intensity category
  const getRainfallCategory = (amount: number) => {
    if (amount === 0) return "None"
    if (amount < 0.5) return "Light"
    if (amount < 4) return "Moderate"
    if (amount < 8) return "Heavy"
    return "Very Heavy"
  }

  // Get wind speed description based on Beaufort scale
  const getWindDescription = (speed: number) => {
    if (speed < 1) return "Calm"
    if (speed < 6) return "Light Air"
    if (speed < 12) return "Light Breeze"
    if (speed < 20) return "Gentle Breeze"
    if (speed < 29) return "Moderate Breeze"
    if (speed < 39) return "Fresh Breeze"
    if (speed < 50) return "Strong Breeze"
    if (speed < 62) return "High Wind"
    if (speed < 75) return "Gale"
    if (speed < 89) return "Strong Gale"
    if (speed < 103) return "Storm"
    if (speed < 118) return "Violent Storm"
    return "Hurricane"
  }

  const basicCards = [
    {
      title: "Temperature",
      value: `${temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
      borderColor: "border-rose-200 dark:border-rose-800",
      description: "Current air temperature",
    },
    {
      title: "Humidity",
      value: `${humidity.toFixed(1)}%`,
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      description: "Relative humidity",
    },
    {
      title: "Pressure",
      value: `${pressure.toFixed(1)} hPa`,
      icon: Gauge,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      description: "Atmospheric pressure",
    },
    {
      title: "Dew Point",
      value: `${dew.toFixed(1)}°C`,
      icon: CloudFog,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      description: "Dew point temperature",
    },
    {
      title: "Battery",
      value: `${volt.toFixed(2)}V`,
      icon: Battery,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      description: "Sensor battery voltage",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      {/* Basic weather metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {basicCards.map((card, index) => (
          <Card
            key={index}
            className={cn(
              "overflow-hidden border-2 shadow-md hover:shadow-lg transition-shadow duration-300",
              card.borderColor,
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold">{card.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                </div>
                <div className={cn("p-2 rounded-full", card.bgColor)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced weather cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wind Card */}
        <Card className="border-2 border-sky-200 dark:border-sky-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Wind</span>
              <div className="p-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20">
                <Wind className="h-5 w-5 text-sky-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex justify-between items-center w-full mb-2">
                <div>
                  <span className="text-3xl font-bold">{windSpeed.toFixed(1)}</span>
                  <span className="text-lg ml-1">km/h</span>
                </div>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                  {getWindDescription(windSpeed)}
                </span>
              </div>

              <WindCompass direction={windDirection} speed={windSpeed} size={isMobile ? "sm" : "md"} className="my-2" />

              <div className="w-full mt-2">
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-300 via-sky-500 to-sky-700 rounded-full"
                    style={{
                      width: `${Math.min((windSpeed / 50) * 100, 100)}%`,
                      transition: "width 1s ease-in-out",
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Calm</span>
                  <span>Moderate</span>
                  <span>Strong</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rain Intensity Card (renamed from Current Rain Rate) */}
        <Card className="border-2 border-cyan-200 dark:border-cyan-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Rain Intensity</span>
              <div className="p-2 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20">
                <CloudRain className="h-5 w-5 text-cyan-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold">{currentRainRate.toFixed(1)}</span>
                  <span className="text-lg ml-1">mm/h</span>
                </div>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300">
                  {getRainfallCategory(currentRainRate)}
                </span>
              </div>

              <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Intensity Scale</p>
                    <p className="font-medium">
                      {currentRainRate === 0
                        ? "No rain"
                        : currentRainRate < 2.5
                          ? "Light rain"
                          : currentRainRate < 10
                            ? "Moderate rain"
                            : currentRainRate < 50
                              ? "Heavy rain"
                              : "Extreme rain"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Last Reading</p>
                    <p className="font-medium">{currentRainfall.toFixed(1)} mm</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Current rainfall intensity measured in millimeters per hour. This indicates how heavily it's raining
                right now.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Rainfall Total Card */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Daily Rainfall</span>
              <div className="p-2 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
                <Umbrella className="h-5 w-5 text-indigo-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-4xl font-bold">{dailyRainfallTotal.toFixed(1)}</span>
                  <span className="text-lg ml-1">mm</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    {rainIntensity}
                  </span>
                </div>
              </div>

              {hasRainToday && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Rainfall Period</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Start Time</p>
                      <p className="font-medium">{rainStartTime}</p>
                    </div>
                    {rainEndTime && rainEndTime !== rainStartTime && (
                      <div>
                        <p className="text-xs text-muted-foreground">End Time</p>
                        <p className="font-medium">{rainEndTime}</p>
                      </div>
                    )}
                  </div>
                  {rainDuration && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium">{rainDuration}</p>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {dailyRainfallTotal === 0
                  ? "No rainfall recorded today."
                  : "Total accumulated rainfall since midnight."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sunlight Intensity Card */}
        <Card className="border-2 border-yellow-200 dark:border-yellow-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Sunlight Intensity</span>
              <div className="p-2 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20">
                <Sun className="h-5 w-5 text-yellow-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold">{sunlightIntensity.toLocaleString()}</span>
                  <span className="text-lg ml-1">lux</span>
                </div>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                  {getSunlightCategory(sunlightIntensity)}
                </span>
              </div>

              <div className="space-y-2">
                <Progress value={sunlightPercentage} className="h-2 bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 rounded-full"
                    style={{ width: `${sunlightPercentage}%` }}
                  />
                </Progress>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Measured in lux. Typical daylight ranges from 10,000 to 25,000 lux. Full sunlight can reach 100,000+
                  lux.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
