export interface AstronomicalApi {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: number;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
}

export interface AstronomicalDataType {
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

export async function fetchSunriseSunsetData(lat: number, lng: number): Promise<AstronomicalApi> {
  const response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today&tzid=Asia/Jakarta&formatted=0`
  );
  const json = await response.json();
  
  if (json.status !== "OK") {
    throw new Error("Failed to fetch astronomical data");
  }
  
  return json.results;
}

export async function fetchMoonData(lat: number, lng: number) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/astronomy.json?key=2855a16152da4b5e8a6212335220304&q=${lat},${lng}&dt=today`
  );
  const json = await response.json();
  return json.astronomy.astro;
}

export function formatTimeFromISO(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: false 
  });
}

export function formatDayLength(seconds: number): string {
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export async function fetchAstronomicalData(lat: number, lng: number): Promise<AstronomicalDataType> {
  const [sunData, moonData] = await Promise.all([
    fetchSunriseSunsetData(lat, lng),
    fetchMoonData(lat, lng)
  ]);

  return {
    sunrise: formatTimeFromISO(sunData.sunrise),
    sunset: formatTimeFromISO(sunData.sunset),
    solarNoon: formatTimeFromISO(sunData.solar_noon),
    dayLength: formatDayLength(sunData.day_length),
    astronomicalTwilightBegin: formatTimeFromISO(sunData.astronomical_twilight_begin),
    astronomicalTwilightEnd: formatTimeFromISO(sunData.astronomical_twilight_end),
    moonPhase: moonData.moon_phase,
    moonPhaseIcon: moonData.moon_phase.toLowerCase().replace(" ", "-"),
    moonIllumination: parseInt(moonData.moon_illumination, 10),
  };
}
