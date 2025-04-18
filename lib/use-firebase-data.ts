"use client"

import { useState, useEffect } from "react"
import { database, ref, onValue, off } from "@/lib/firebase"

export interface DataPoint {
  timestamp: number
  value: number
}

export function useFirebaseData(path: string): {
  data: DataPoint[]
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    const dataRef = ref(database, path)

    const handleData = (snapshot: any) => {
      try {
        const val = snapshot.val()
        if (val) {
          // Transform the data into the format we need
          const transformedData: DataPoint[] = Object.entries(val).map(([key, value]: [string, any]) => ({
            timestamp: Number.parseInt(key, 10) || Date.parse(key),
            value: typeof value === "object" ? value.value : value,
          }))

          // Sort by timestamp
          transformedData.sort((a, b) => a.timestamp - b.timestamp)

          setData(transformedData)
        } else {
          setData([])
        }
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setLoading(false)
      }
    }

    onValue(dataRef, handleData, (err) => {
      setError(err)
      setLoading(false)
    })

    // Clean up listener on unmount
    return () => {
      off(dataRef)
    }
  }, [path])

  return { data, loading, error }
}
