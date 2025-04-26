"use client"

import { useState, useEffect, useCallback } from "react"
import { database, ref, query, orderByKey, limitToLast, get } from "@/lib/firebase"

export interface WeatherData {
  timestamps: string[]
  temperatures: number[]
  humidity: number[]
  pressure: number[]
  dew: number[]
  volt: number[]
  rainfall: number[] // Daily accumulated rainfall
  rainrate: number[] // Hourly rainfall rate
  sunlight: number[]
  windspeed: number[]
  windir: number[]
}

export function useWeatherData(
  sensorId = "id-03",
  fetchCount = 1440, // Default to 24 hours (assuming 1-minute data points)
): {
  data: WeatherData
  loading: boolean
  error: Error | null
  lastUpdated: Date | null
  refreshData: () => Promise<void>
} {
  const [data, setData] = useState<WeatherData>({
    timestamps: [],
    temperatures: [],
    humidity: [],
    pressure: [],
    dew: [],
    volt: [],
    rainfall: [],
    rainrate: [],
    sunlight: [],
    windspeed: [],
    windir: [],
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  /**
   * Fetch weather data function
   * This function fetches data from Firebase and processes it
   */
  const fetchWeatherData = useCallback(async () => {
    setLoading(true)
    try {
      // Create a query to get the last 24 hours of data (fetchCount data points)
      const dataRef = query(ref(database, `auto_weather_stat/${sensorId}/data`), orderByKey(), limitToLast(fetchCount))

      // Get data snapshot
      const snapshot = await get(dataRef)

      if (snapshot.exists()) {
        const rawData = snapshot.val()

        const processedData: WeatherData = {
          timestamps: [],
          temperatures: [],
          humidity: [],
          pressure: [],
          dew: [],
          volt: [],
          rainfall: [],
          rainrate: [],
          sunlight: [],
          windspeed: [],
          windir: [],
        }

        // Process the data
        Object.values(rawData).forEach((entry: any) => {
          const timeFormatted = new Date(entry.timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })

          // Process core weather data
          processedData.timestamps.push(timeFormatted)
          processedData.temperatures.push(entry.temperature)
          processedData.humidity.push(entry.humidity)
          processedData.pressure.push(entry.pressure)
          processedData.dew.push(entry.dew)
          processedData.volt.push(entry.volt)

          // Process real data for rainfall, rainrate, sunlight, windspeed, and windir
          // Use nullish coalescing to provide fallbacks if data is missing
          processedData.rainfall.push(entry.rainfall ?? 0)
          processedData.rainrate.push(entry.rainrate ?? 0)
          processedData.sunlight.push(entry.sunlight ?? 0)
          processedData.windspeed.push(entry.windspeed ?? 0)
          processedData.windir.push(entry.windir ?? 0)
        })

        setData(processedData)
        setLastUpdated(new Date())
      }
      setLoading(false)
    } catch (err) {
      console.error("Error fetching Firebase data:", err)
      setError(err instanceof Error ? err : new Error("Unknown error processing data"))
      setLoading(false)
    }
  }, [sensorId, fetchCount])

  // Initial data fetch and setup auto-refresh
  useEffect(() => {
    // Fetch data immediately
    fetchWeatherData()

    // Set up 10-minute refresh interval
    const refreshInterval = setInterval(
      () => {
        console.log("Auto-refreshing weather data...")
        fetchWeatherData()
      },
      10 * 60 * 1000,
    ) // 10 minutes in milliseconds

    // Clean up on unmount
    return () => {
      clearInterval(refreshInterval)
    }
  }, [fetchWeatherData])

  // Function to manually refresh data
  const refreshData = async () => {
    console.log("Manually refreshing weather data...")
    await fetchWeatherData()
  }

  return { data, loading, error, lastUpdated, refreshData }
}
