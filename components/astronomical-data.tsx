"use client"

import { useEffect, useState } from "react"
import { Sunrise, Sunset, Moon, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import MoonPhaseIcon from "./moon-phase-icon"

interface AstronomicalDataProps {
  className?: string
}

interface AstronomicalApi {
  sunrise: string
  sunset: string
  solar_noon: string
  day_length: number
  astronomical_twilight_begin: string
  astronomical_twilight_end: string
}

interface MoonPhase {
  phase: string
  icon: string
  illumination: number
}

interface AstronomicalDataType {
  sunrise: string
  sunset: string
  solarNoon: string
  dayLength: string
  astronomicalTwilightBegin: string
  astronomicalTwilightEnd: string
  moonPhase: string
  moonPhaseIcon: string
  moonIllumination: number
}

// Utility: calculate moon phase
const LUNAR_CYCLE = 29.53
const NEW_MOON_REF = new Date(2000, 0, 6).getTime()
function calculateMoonPhase(date: Date): MoonPhase {
  const daysSinceRef = (date.getTime() - NEW_MOON_REF) / (1000 * 60 * 60 * 24)
  const phaseNorm = (daysSinceRef % LUNAR_CYCLE) / LUNAR_CYCLE
  const illumination = Math.sin(phaseNorm * Math.PI) * 100

  if (phaseNorm < 0.025 || phaseNorm >= 0.975) {
    return { phase: "New Moon", icon: "new-moon", illumination: 0 }
  } else if (phaseNorm < 0.25) {
    return { phase: "Waxing Crescent", icon: "waxing-crescent", illumination: Math.abs(illumination) }
  } else if (phaseNorm < 0.275) {
    return { phase: "First Quarter", icon: "first-quarter", illumination: 50 }
  } else if (phaseNorm < 0.475) {
    return { phase: "Waxing Gibbous", icon: "waxing-gibbous", illumination: Math.abs(illumination) }
  } else if (phaseNorm < 0.525) {
    return { phase: "Full Moon", icon: "full-moon", illumination: 100 }
  } else if (phaseNorm < 0.725) {
    return { phase: "Waning Gibbous", icon: "waning-gibbous", illumination: Math.abs(illumination) }
  } else if (phaseNorm < 0.775) {
    return { phase: "Last Quarter", icon: "last-quarter", illumination: 50 }
  }
  return { phase: "Waning Crescent", icon: "waning-crescent", illumination: Math.abs(illumination) }
}

// Custom hook
function useAstronomicalData(lat: number, lng: number) {
  const [data, setData] = useState<AstronomicalDataType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today&tzid=Asia/Jakarta&formatted=0`
        )
        const json = await res.json()
        if (json.status !== "OK") throw new Error("Failed to fetch astronomical data")
        const api: AstronomicalApi = json.results
        const moon = calculateMoonPhase(new Date())

        const format = (iso: string) =>
          new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })

        const formatted: AstronomicalDataType = {
          sunrise: format(api.sunrise),
          sunset: format(api.sunset),
          solarNoon: format(api.solar_noon),
          dayLength: `${Math.floor(api.day_length / 3600)}h ${Math.floor((api.day_length % 3600) / 60)}m`,
          astronomicalTwilightBegin: format(api.astronomical_twilight_begin),
          astronomicalTwilightEnd: format(api.astronomical_twilight_end),
          moonPhase: moon.phase,
          moonPhaseIcon: moon.icon,
          moonIllumination: Math.round(moon.illumination),
        }
        if (active) setData(formatted)
      } catch (e) {
        if (active) setError(e instanceof Error ? e : new Error("Unknown error"))
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 60 * 60 * 1000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [lat, lng])

  return { data, loading, error }
}

export default function AstronomicalData({ className }: AstronomicalDataProps) {
  const { data, loading, error } = useAstronomicalData(-7.736628913501616, 109.64609598596998)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const tick = () => setCurrentTime(new Date())
    tick()
    const iv = setInterval(tick, 60 * 1000)
    return () => clearInterval(iv)
  }, [])

  if (loading) {
    return (
      <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">Loading astronomical data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
        <CardContent className="p-6">
          <p className="text-sm text-destructive text-center">Error loading astronomical data</p>
        </CardContent>
      </Card>
    )
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
          {/* Sunrise */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-amber-500/20">
                <Sunrise className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-base font-medium">Sunrise</h3>
            </div>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{data.sunrise}</p>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Astronomical Twilight:</span>
                <span>{data.astronomicalTwilightBegin}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Solar Noon:</span>
                <span>{data.solarNoon}</span>
              </div>
            </div>
          </div>
          {/* Sunset */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-orange-500/20">
                <Sunset className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-base font-medium">Sunset</h3>
            </div>
            <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{data.sunset}</p>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Astronomical Twilight:</span>
                <span>{data.astronomicalTwilightEnd}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Day Length:</span>
                <span>{data.dayLength}</span>
              </div>
            </div>
          </div>
          {/* Moon Phase */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-indigo-500/20">
                <Moon className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-base font-medium">Moon Phase</h3>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{data.moonPhase}</p>
              <span className="text-sm text-muted-foreground">
                {data.moonIllumination}% illuminated
              </span>
            </div>
            <MoonPhaseIcon phase={data.moonPhaseIcon as any} size="lg" className="mx-auto mb-3" />
            <div className="w-full flex justify-between text-xs text-muted-foreground">
              {['new-moon','first-quarter','full-moon','last-quarter'].map(phase => (
                <div key={phase} className="flex flex-col items-center">
                  <MoonPhaseIcon phase={phase as any} size="sm"/>
                  <span className="mt-1 capitalize">{phase.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
