"use client"

import { useState, useEffect } from "react"
import { database, ref, query, orderByKey, limitToLast, onValue, off } from "@/lib/firebase"

export interface WeatherData {
  timestamps: string[]
  temperatures: number[]
  humidity: number[]
  pressure: number[]
  dew: number[]
  volt: number[]
  rainfall: number[]
  rainrate: number[] // Changed from hourlyRainfall to rainrate to match Firebase field
  sunlight: number[]
  windspeed: number[] // Changed from windSpeed to windspeed to match Firebase field
  windir: number[] // Changed from windDirection to windir to match Firebase field
}

export function useWeatherData(
  sensorId = "id-03",
  fetchCount = 60,
): {
  data: WeatherData
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<WeatherData>({
    timestamps: [],
    temperatures: [],
    humidity: [],
    pressure: [],
    dew: [],
    volt: [],
    rainfall: [],
    rainrate: [], // Updated field name
    sunlight: [],
    windspeed: [], // Updated field name
    windir: [], // Updated field name
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    const dataRef = query(ref(database, `auto_weather_stat/${sensorId}/data`), orderByKey(), limitToLast(fetchCount))

    const handleData = (snapshot: any) => {
      try {
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
        }
        setLoading(false)
      } catch (err) {
        console.error("Error processing Firebase data:", err)
        setError(err instanceof Error ? err : new Error("Unknown error processing data"))
        setLoading(false)
      }
    }

    onValue(dataRef, handleData, (err) => {
      console.error("Firebase onValue error:", err)
      setError(err)
      setLoading(false)
    })

    // Clean up listener on unmount
    return () => {
      off(dataRef)
    }
  }, [sensorId, fetchCount])

  return { data, loading, error }
}
