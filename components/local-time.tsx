"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function LocalTime() {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // Format time: HH:MM:SS
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })

      // Format date: Day, DD Month YYYY
      const dateString = now.toLocaleDateString([], {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })

      setCurrentTime(timeString)
      setCurrentDate(dateString)
    }

    // Update immediately
    updateTime()

    // Then update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border border-border shadow-md bg-card">
      <CardContent className="p-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-primary" />
        <div>
          <p className="text-lg font-bold tabular-nums">{currentTime}</p>
          <p className="text-xs text-muted-foreground">{currentDate}</p>
        </div>
      </CardContent>
    </Card>
  )
}
