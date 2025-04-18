"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface WindCompassProps {
  direction: number // Wind direction in degrees (0-359)
  speed: number // Wind speed in km/h
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function WindCompass({ direction, speed, size = "md", className }: WindCompassProps) {
  const compassRef = useRef<HTMLDivElement>(null)

  // Convert wind direction to cardinal direction
  const getCardinalDirection = (degrees: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
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

  // Update compass rotation when direction changes
  useEffect(() => {
    if (compassRef.current) {
      compassRef.current.style.transform = `rotate(${direction}deg)`
    }
  }, [direction])

  // Size classes
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        {/* Static compass background */}
        <div className={cn("relative rounded-full border-2 border-slate-300 dark:border-slate-700", sizeClasses[size])}>
          {/* Cardinal directions */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-1 text-xs font-bold">N</div>
            <div className="absolute right-1 text-xs font-bold">E</div>
            <div className="absolute bottom-1 text-xs font-bold">S</div>
            <div className="absolute left-1 text-xs font-bold">W</div>
          </div>

          {/* Rotating compass rose */}
          <div
            ref={compassRef}
            className={cn("absolute inset-0 transition-transform duration-1000", sizeClasses[size])}
            style={{ transformOrigin: "center center" }}
          >
            {/* Wind direction arrow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-sky-500" />
            </div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-500" />
          </div>
        </div>
      </div>

      {/* Wind direction text */}
      <div className="mt-2 text-center">
        <div className="text-sm font-medium">{getCardinalDirection(direction)}</div>
        <div className="text-xs text-muted-foreground">{direction}°</div>
      </div>
    </div>
  )
}
