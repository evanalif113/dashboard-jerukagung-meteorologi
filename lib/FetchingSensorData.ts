"use client"

import { useState, useEffect } from "react"
import { database, ref, query, orderByKey, startAt, onValue } from "@/lib/FirebaseConfig"

export interface WeatherData {
  timestamps: string[]
  temperatures: number[]
  humidity: number[]
  pressure: number[]
  dew: number[]
  volt: number[]
  rainfall: number[]
  rainrate: number[]
  sunlight: number[]
  windspeed: number[]
  windir: number[]
}

export function useWeatherData(
  sensorId = "id-03",
  minutes =60,
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
    rainrate: [],
    sunlight: [],
    windspeed: [],
    windir: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const startTimestamp = Math.floor(Date.now() / 1000) - minutes * 60
    const dataRef = ref(database, `auto_weather_stat/${sensorId}/data`)
    const dataQuery = query(dataRef, orderByKey(), startAt(startTimestamp.toString()))

    const unsubscribe = onValue(
  dataQuery,
  (snapshot) => {
    try {
      const nowTimestamp = Math.floor(Date.now() / 1000) // waktu saat ini
      const minTimestamp = nowTimestamp - minutes * 60

      const rawData = snapshot.exists() ? snapshot.val() : {}
      const processed: WeatherData = {
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

      Object.values(rawData)
        .filter((entry: any) => entry.timestamp >= minTimestamp) // <<-- disaring di sini
        .forEach((entry: any) => {
          const t = new Date(entry.timestamp * 1000)
          processed.timestamps.push(
            t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
          )
          processed.temperatures.push(entry.temperature ?? 0)
          processed.humidity.push(entry.humidity ?? 0)
          processed.pressure.push(entry.pressure ?? 0)
          processed.dew.push(entry.dew ?? 0)
          processed.volt.push(entry.volt ?? 0)
          processed.rainfall.push(entry.rainfall ?? 0)
          processed.rainrate.push(entry.rainrate ?? 0)
          processed.sunlight.push(entry.sunlight ?? 0)
          processed.windspeed.push(entry.windspeed ?? 0)
          processed.windir.push(entry.windir ?? 0)
        })

      setData(processed)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Data processing error"))
      setLoading(false)
    }
  },
  (err) => {
    setError(err)
    setLoading(false)
  }
)


    return () => {
      unsubscribe()
    }
  }, [sensorId, minutes])

  return { data, loading, error }
}
