"use client"

import { useState, useEffect } from "react"
import { database, ref, query, orderByKey, startAt, onValue, set, update, remove } from "@/lib/FirebaseConfig"

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

export interface WeatherDataEntry {
  timestamp: number
  temperature: number
  humidity: number
  pressure: number
  dew: number
  volt: number
  rainfall: number
  rainrate: number
  sunlight: number
  windspeed: number
  windir: number
}

export function useWeatherData(
  sensorId = "id-03",
  minutes = 60
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
    if (!sensorId) {
      setLoading(false)
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
      return
    }

    setLoading(true)
    setError(null)

    const startTimestamp = Math.floor(Date.now() / 1000) - minutes * 60
    const dataRef = ref(database, `auto_weather_stat/${sensorId}/data`)
    const dataQuery = query(dataRef, orderByKey(), startAt(startTimestamp.toString()))

    const unsubscribe = onValue(
      dataQuery,
      (snapshot) => {
        try {
          const rawData = snapshot.exists() ? snapshot.val() : {}

          const processed = Object.values(rawData).reduce<WeatherData>(
            (acc, entry) => {
              const e = entry as WeatherDataEntry
              const t = new Date(e.timestamp * 1000)
              acc.timestamps.push(
                t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
              )
              acc.temperatures.push(e.temperature ?? 0)
              acc.humidity.push(e.humidity ?? 0)
              acc.pressure.push(e.pressure ?? 0)
              acc.dew.push(e.dew ?? 0)
              acc.volt.push(e.volt ?? 0)
              acc.rainfall.push(e.rainfall ?? 0)
              acc.rainrate.push(e.rainrate ?? 0)
              acc.sunlight.push(e.sunlight ?? 0)
              acc.windspeed.push(e.windspeed ?? 0)
              acc.windir.push(e.windir ?? 0)
              return acc
            },
            {
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
          )

          setData(processed)
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Data processing error"))
        } finally {
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

/**
 * Adds a new weather data entry for a specific sensor.
 * The timestamp is automatically generated.
 * @param sensorId The ID of the sensor.
 * @param data The weather data to add (without timestamp).
 */
export async function addWeatherData(
  sensorId: string,
  data: Omit<WeatherDataEntry, "timestamp">
): Promise<void> {
  const timestamp = Math.floor(Date.now() / 1000)
  const dataRef = ref(database, `auto_weather_stat/${sensorId}/data/${timestamp}`)
  await set(dataRef, { ...data, timestamp })
}

/**
 * Updates an existing weather data entry.
 * @param sensorId The ID of the sensor.
 * @param timestamp The timestamp of the entry to update.
 * @param data The data to update.
 */
export async function updateWeatherData(
  sensorId: string,
  timestamp: number,
  data: Partial<WeatherDataEntry>
): Promise<void> {
  const dataRef = ref(database, `auto_weather_stat/${sensorId}/data/${timestamp}`)
  await update(dataRef, data)
}

/**
 * Deletes a weather data entry.
 * @param sensorId The ID of the sensor.
 * @param timestamp The timestamp of the entry to delete.
 */
export async function deleteWeatherData(sensorId: string, timestamp: number): Promise<void> {
  const dataRef = ref(database, `auto_weather_stat/${sensorId}/data/${timestamp}`)
  await remove(dataRef)
}
