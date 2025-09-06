"use client"

import { useState, useEffect } from "react"
import { CloudRain, RefreshCw, ChevronDown, Clock, Loader2, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface WeatherHeaderProps {
  sensorId: string
  onSensorChange: (sensorId: string) => void
  dataPoints: number
  onDataPointsChange: (dataPoints: number) => void
  isLoading: boolean
}

export default function Header({
  sensorId,
  onSensorChange,
  dataPoints,
  onDataPointsChange,
  isLoading,
}: WeatherHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      )
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const sensors = [
    { id: "id-01", name: "Sensor 1" },
    { id: "id-02", name: "Sensor 2" },
    { id: "id-03", name: "Sensor 3" },
    { id: "id-04", name: "Sensor 4" },
    { id: "id-05", name: "Sensor 5" }
  ]

  const timeIntervals = [
    { value: 30, label: "30 Menit Terakhir" },
    { value: 60, label: "1 Jam Terakhir" },
    { value: 120, label: "2 Jam Terakhir" },
    { value: 240, label: "4 Jam Terakhir" },
    { value: 720, label: "12 Jam Terakhir" },
    { value: 1440, label: "24 Jam Terakhir" },
  ]

  const currentTimeInterval = timeIntervals.find((t) => t.value === dataPoints)?.label || `${dataPoints} Titik Data Terakhir`

  return (
    <>
      <Card className="bg-slate-400 dark:bg-[#1A2A80] border-none shadow-none w-full rounded-2xl mb-4">
        <CardContent className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Header Title */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                <img
                  src="/favicon.ico"
                  alt="Logo"
                  className="h-10 w-10"
                />
                </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Stasiun Meteorologi Jerukagung</h1>
                <p className="text-sm text-slate-900 dark:text-slate-100">Departemen Penelitian Sains Atmosfer</p>
              </div>
            </div>

            {/* Controls and Info */}
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              {/* Controls */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <CloudRain className="h-4 w-4 mr-1" />
                    {sensors.find((s) => s.id === sensorId)?.name || "Select Sensor"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                  <Button variant="outline" className="flex items-center gap-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {currentTimeInterval}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                className="border border-border shadow-md bg-card"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>

              {/* Local Time */}
              <Card className="border border-border shadow-md bg-card w-auto">
                <CardContent className="p-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-base font-bold tabular-nums">{currentTime}</p>
                    <p className="text-xs text-muted-foreground">{currentDate}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md border-2 border-primary/20 shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loading weather data...</h3>
              <p className="text-muted-foreground text-center">Fetching the latest weather information from the station.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
