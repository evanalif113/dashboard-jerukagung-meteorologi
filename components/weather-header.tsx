"use client"

import { useState } from "react"
import { Cloud, CloudRain, RefreshCw, ChevronDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface WeatherHeaderProps {
  sensorId: string
  onSensorChange: (sensorId: string) => void
  dataPoints: number
  onDataPointsChange: (dataPoints: number) => void
}

export default function WeatherHeader({
  sensorId,
  onSensorChange,
  dataPoints,
  onDataPointsChange,
}: WeatherHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh - in a real app, you might refetch data here
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const sensors = [
    { id: "id-01", name: "Sensor 1" },
    { id: "id-02", name: "Sensor 2" },
    { id: "id-03", name: "Sensor 3" },
    { id: "id-04", name: "Sensor 4" },
    { id: "id-05", name: "Sensor 5" },
    { id: "id-06", name: "Sensor 6" },
    { id: "id-07", name: "Sensor 7" },
    { id: "id-08", name: "Sensor 8" },
  ]

  // Time intervals instead of data points
  const timeIntervals = [
    { value: 30, label: "Last 30 minutes" },
    { value: 60, label: "Last 1 hour" },
    { value: 120, label: "Last 2 hours" },
    { value: 240, label: "Last 4 hours" },
    { value: 720, label: "Last 12 hours" },
    { value: 1440, label: "Last 24 hours" },
  ]

  // Find the current time interval label
  const currentTimeInterval = timeIntervals.find((t) => t.value === dataPoints)?.label || `Last ${dataPoints} minutes`

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center">
        <div className="mr-3 p-2 rounded-full bg-primary/10 dark:bg-primary/20">
          <Cloud className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AWS Jerukagung Meteorologi</h1>
          <p className="text-sm text-muted-foreground">Real-time weather monitoring</p>
        </div>
      </div>

      <div className="flex gap-2 mt-2 sm:mt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              <CloudRain className="h-4 w-4 mr-1" />
              {sensors.find((s) => s.id === sensorId)?.name || "Select Sensor"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-popover text-popover-foreground dark:bg-popover dark:text-popover-foreground"
          >
            {sensors.map((sensor) => (
              <DropdownMenuItem
                key={sensor.id}
                onClick={() => onSensorChange(sensor.id)}
                className={cn(
                  "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                  sensorId === sensor.id && "bg-primary/10 font-medium dark:bg-primary/20",
                )}
              >
                {sensor.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              <Clock className="h-4 w-4 mr-1" />
              {currentTimeInterval}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-popover text-popover-foreground dark:bg-popover dark:text-popover-foreground"
          >
            {timeIntervals.map((interval) => (
              <DropdownMenuItem
                key={interval.value}
                onClick={() => onDataPointsChange(interval.value)}
                className={cn(
                  "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                  dataPoints === interval.value && "bg-primary/10 font-medium dark:bg-primary/20",
                )}
              >
                {interval.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="hover:bg-primary/10 dark:hover:bg-primary/20"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>
    </div>
  )
}
