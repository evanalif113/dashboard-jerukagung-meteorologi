"use client"

import { useState, useEffect } from "react"
import { database, ref, query, orderByKey, startAt, endAt, onValue, off } from "@/lib/firebase"

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
  minutes = 60,
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
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)

    const now = Math.floor(Date.now() / 1000) // waktu sekarang detik
    const startTimestamp = now - minutes * 60 // mundur X menit

    const refPath = ref(database, `auto_weather_stat/${sensorId}/data`)
    const queryPath = query(
      refPath,
      orderByKey(),
      startAt(startTimestamp.toString()),
      endAt(now.toString())
    )

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

            processedData.timestamps.push(timeFormatted)
            processedData.temperatures.push(entry.temperature)
            processedData.humidity.push(entry.humidity)
            processedData.pressure.push(entry.pressure)
            processedData.dew.push(entry.dew)
            processedData.volt.push(entry.volt)
            processedData.rainfall.push(entry.rainfall ?? 0)
            processedData.rainrate.push(entry.rainrate ?? 0)
            processedData.sunlight.push(entry.sunlight ?? 0)
            processedData.windspeed.push(entry.windspeed ?? 0)
            processedData.windir.push(entry.windir ?? 0)
          })

          setData(processedData)
        } else {
          // Kalau data kosong
          setData({
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
        }
        setLoading(false)
      } catch (err) {
        console.error("Error processing Firebase data:", err)
        setError(err instanceof Error ? err : new Error("Unknown error processing data"))
        setLoading(false)
      }
    }

    const unsub = onValue(queryPath, handleData, (err) => {
      console.error("Firebase onValue error:", err)
      setError(err)
      setLoading(false)
    })

    // Penting: cleanup listener pake refPath (bukan queryPath)
    return () => {
      off(refPath)
    }
  }, [sensorId, minutes])

  return { data, loading, error }
}
