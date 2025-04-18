"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WeatherData } from "@/lib/use-weather-data"
import { interpretWeather, getActivityRecommendations, type WeatherCondition } from "@/lib/weather-interpreter"
import { cn } from "@/lib/utils"
import {
  Sun,
  Cloud,
  CloudFog,
  CloudRain,
  Wind,
  Snowflake,
  ThermometerSun,
  CloudSun,
  type LucideIcon,
} from "lucide-react"

interface WeatherInterpretationProps {
  data: WeatherData
}

export default function WeatherInterpretation({ data }: WeatherInterpretationProps) {
  const [interpretation, setInterpretation] = useState<WeatherCondition | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    if (data.temperatures.length > 0 && data.humidity.length > 0 && data.pressure.length > 0) {
      // Get the latest values
      const latestIndex = data.timestamps.length - 1
      const temperature = data.temperatures[latestIndex] || 0
      const humidity = data.humidity[latestIndex] || 0
      const pressure = data.pressure[latestIndex] || 0

      // Interpret the weather
      const weatherInterpretation = interpretWeather(temperature, humidity, pressure)
      setInterpretation(weatherInterpretation)

      // Get activity recommendations
      const activityRecommendations = getActivityRecommendations(temperature, humidity, pressure)
      setRecommendations(activityRecommendations)
    }
  }, [data])

  if (!interpretation) return null

  // Map icon string to Lucide component
  const getIconComponent = (iconName: string): LucideIcon => {
    switch (iconName) {
      case "sun":
        return Sun
      case "cloud":
        return Cloud
      case "cloud-fog":
        return CloudFog
      case "cloud-rain":
        return CloudRain
      case "wind":
        return Wind
      case "snowflake":
        return Snowflake
      case "thermometer-sun":
        return ThermometerSun
      case "cloud-sun":
        return CloudSun
      default:
        return Cloud
    }
  }

  const IconComponent = getIconComponent(interpretation.icon)

  return (
    <Card className="border-2 border-primary/20 shadow-md mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <IconComponent className={cn("h-5 w-5", interpretation.color)} />
          Weather Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn("text-sm font-medium", interpretation.color)}>
                {interpretation.condition}
              </Badge>
            </div>
            <p className="text-muted-foreground">{interpretation.description}</p>
          </div>

          {recommendations.length > 0 && (
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-2">Recommendations:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
