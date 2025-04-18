"use client"

import { useState, useEffect } from "react"
import { Sunrise, Sunset, Moon, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import MoonPhaseIcon from "./moon-phase-icon"

interface AstronomicalDataProps {
  className?: string
}

interface AstronomicalDataType {
  sunrise: string
  sunset: string
  solar_noon: string
  day_length: number
  astronomical_twilight_begin: string
  astronomical_twilight_end: string
  moonPhase: string
  moonPhaseIcon: string
  moonIllumination: number
}

export default function AstronomicalData({ className }: AstronomicalDataProps) {
  const [astronomicalData, setAstronomicalData] = useState<AstronomicalDataType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Fetch astronomical data
  useEffect(() => {
    const fetchAstronomicalData = async () => {
      try {
        setLoading(true)
        // Fetch sunrise and sunset data
        const response = await fetch(
          "https://api.sunrise-sunset.org/json?lat=-7.736628913501616&lng=109.64609598596998&date=today&tzid=Asia/Jakarta&formatted=0",
        )
        const data = await response.json()

        if (data.status === "OK") {
          // Calculate moon phase
          const moonPhaseData = calculateMoonPhase(new Date())

          // Format times
          const formatTime = (isoString: string) => {
            const date = new Date(isoString)
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
          }

          setAstronomicalData({
            sunrise: formatTime(data.results.sunrise),
            sunset: formatTime(data.results.sunset),
            solar_noon: formatTime(data.results.solar_noon),
            day_length: data.results.day_length,
            astronomical_twilight_begin: formatTime(data.results.astronomical_twilight_begin),
            astronomical_twilight_end: formatTime(data.results.astronomical_twilight_end),
            moonPhase: moonPhaseData.phase,
            moonPhaseIcon: moonPhaseData.icon,
            moonIllumination: moonPhaseData.illumination,
          })
        } else {
          throw new Error("Failed to fetch astronomical data")
        }
      } catch (error) {
        console.error("Error fetching astronomical data:", error)
        setError(error instanceof Error ? error : new Error("Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchAstronomicalData()

    // Refresh data every hour
    const interval = setInterval(fetchAstronomicalData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date())
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate moon phase
  const calculateMoonPhase = (date: Date) => {
    // Moon cycle is approximately 29.53 days
    const LUNAR_CYCLE = 29.53

    // Jan 6, 2000 was a new moon
    const NEW_MOON_REFERENCE = new Date(2000, 0, 6).getTime()

    // Calculate days since reference new moon
    const daysSinceReference = (date.getTime() - NEW_MOON_REFERENCE) / (1000 * 60 * 60 * 24)

    // Calculate current phase (0 to 1)
    const phase = (daysSinceReference % LUNAR_CYCLE) / LUNAR_CYCLE

    // Calculate illumination percentage (simplified)
    // This is a simplified model - actual illumination follows a more complex curve
    const illumination = Math.sin(phase * Math.PI) * 100

    // Determine moon phase name and icon
    if (phase < 0.025 || phase >= 0.975) {
      return { phase: "New Moon", icon: "new-moon", illumination: 0 }
    } else if (phase < 0.25) {
      return { phase: "Waxing Crescent", icon: "waxing-crescent", illumination: Math.abs(illumination) }
    } else if (phase < 0.275) {
      return { phase: "First Quarter", icon: "first-quarter", illumination: 50 }
    } else if (phase < 0.475) {
      return { phase: "Waxing Gibbous", icon: "waxing-gibbous", illumination: Math.abs(illumination) }
    } else if (phase < 0.525) {
      return { phase: "Full Moon", icon: "full-moon", illumination: 100 }
    } else if (phase < 0.725) {
      return { phase: "Waning Gibbous", icon: "waning-gibbous", illumination: Math.abs(illumination) }
    } else if (phase < 0.775) {
      return { phase: "Last Quarter", icon: "last-quarter", illumination: 50 }
    } else {
      return { phase: "Waning Crescent", icon: "waning-crescent", illumination: Math.abs(illumination) }
    }
  }

  if (loading) {
    return (
      <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">Loading astronomical data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
        <CardContent className="p-6">
          <p className="text-sm text-destructive text-center">Error loading astronomical data</p>
        </CardContent>
      </Card>
    )
  }

  if (!astronomicalData) return null

  // Format day length for display
  const formatDayLength = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Astronomical Data</span>
          <div className="flex items-center text-sm font-normal text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sunrise Data */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-amber-500/20">
                <Sunrise className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-base font-medium">Sunrise</h3>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{astronomicalData.sunrise}</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Astronomical Twilight:</span>
                  <span className="text-sm font-medium">{astronomicalData.astronomical_twilight_begin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Solar Noon:</span>
                  <span className="text-sm font-medium">{astronomicalData.solar_noon}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sunset Data */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-orange-500/20">
                <Sunset className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-base font-medium">Sunset</h3>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{astronomicalData.sunset}</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Astronomical Twilight:</span>
                  <span className="text-sm font-medium">{astronomicalData.astronomical_twilight_end}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Day Length:</span>
                  <span className="text-sm font-medium">{formatDayLength(astronomicalData.day_length)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Moon Phase Data - Enhanced with CSS-based moon phase visualization */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-indigo-500/20">
                <Moon className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-base font-medium">Moon Phase</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{astronomicalData.moonPhase}</p>
                <span className="text-sm text-muted-foreground">
                  {Math.round(astronomicalData.moonIllumination)}% illuminated
                </span>
              </div>

              {/* Enhanced moon phase visualization */}
              <div className="flex flex-col items-center justify-center mt-2 space-y-3">
                <MoonPhaseIcon phase={astronomicalData.moonPhaseIcon as any} size="lg" />

                {/* Moon phase progression indicators */}
                <div className="w-full flex justify-between mt-2">
                  <div className="flex flex-col items-center">
                    <MoonPhaseIcon phase="new-moon" size="sm" />
                    <span className="text-xs mt-1">New</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MoonPhaseIcon phase="first-quarter" size="sm" />
                    <span className="text-xs mt-1">First</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MoonPhaseIcon phase="full-moon" size="sm" />
                    <span className="text-xs mt-1">Full</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MoonPhaseIcon phase="last-quarter" size="sm" />
                    <span className="text-xs mt-1">Last</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
