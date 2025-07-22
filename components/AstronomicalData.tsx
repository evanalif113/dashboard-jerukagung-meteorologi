"use client";

import { useEffect, useState } from "react";
import { Sunrise, Sunset, Moon, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MoonPhaseIcon from "./MoonPhaseIcon";

interface AstronomicalDataProps {
  className?: string;
}

interface AstronomicalApi {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: number;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
}

interface AstronomicalDataType {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  dayLength: string;
  astronomicalTwilightBegin: string;
  astronomicalTwilightEnd: string;
  moonPhase: string;
  moonPhaseIcon: string;
  moonIllumination: number;
}

// Custom hook
function useAstronomicalData(lat: number, lng: number) {
  const [data, setData] = useState<AstronomicalDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch sunrise/sunset data
        const resSun = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today&tzid=Asia/Jakarta&formatted=0`
        );
        var jsonSun = await resSun.json();
        if (jsonSun.status !== "OK") throw new Error("Failed to fetch astronomical data");
        const api: AstronomicalApi = jsonSun.results;

        // Fetch moon phase data from WeatherAPI
        const resMoon = await fetch(
          `https://api.weatherapi.com/v1/astronomy.json?key=2855a16152da4b5e8a6212335220304&q=${lat},${lng}&dt=today`
        );
        var jsonMoon = await resMoon.json();
        const moon = jsonMoon.astronomy.astro;

        const format = (iso: string) =>
          new Date(iso).toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: false 
          });

        const formatted: AstronomicalDataType = {
          sunrise: format(api.sunrise),
          sunset: format(api.sunset),
          solarNoon: format(api.solar_noon),
          dayLength: `${Math.floor(api.day_length / 3600)}h ${Math.floor((api.day_length % 3600) / 60)}m`,
          astronomicalTwilightBegin: format(api.astronomical_twilight_begin),
          astronomicalTwilightEnd: format(api.astronomical_twilight_end),
          moonPhase: moon.moon_phase, // Use moon phase from API
          moonPhaseIcon: moon.moon_phase.toLowerCase().replace(" ", "-"), // Convert to icon format
          moonIllumination: parseInt(moon.moon_illumination, 10), // Illumination percentage
        };

        if (active) setData(formatted);
      } catch (e) {
        if (active) setError(e instanceof Error ? e : new Error("Unknown error"));
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60 * 60 * 1000); // Refresh every hour
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [lat, lng]);

  return { data, loading, error };
}

export default function AstronomicalData({ className }: AstronomicalDataProps) {
  const { data, loading, error } = useAstronomicalData(-7.736628913501616, 109.64609598596998);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const tick = () => setCurrentTime(new Date());
    tick();
    const iv = setInterval(tick, 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  if (loading) {
    return (
      <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">Loading astronomical data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
        <CardContent className="p-6">
          <p className="text-sm text-destructive text-center">Error loading astronomical data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Astronomical Data</span>
          <div className="flex items-center text-sm font-normal text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{currentTime.toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit",
              hour12: false 
            })}</span>
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
              {["new-moon", 
                "first-quarter", 
                "full-moon", 
                "last-quarter"]
                .map((phase) => (
                <div key={phase} className="flex flex-col items-center">
                  <MoonPhaseIcon phase={phase as any} size="sm" />
                  <span className="mt-1 capitalize">{phase.replace("-", " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
