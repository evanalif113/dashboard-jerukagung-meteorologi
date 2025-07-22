/**
 * Weather interpretation based on temperature, humidity, and pressure values
 */

export type WeatherCondition = {
  condition: string
  description: string
  icon: string // Lucide icon name
  color: string // Tailwind color class
}

export function interpretWeather(temperature: number, humidity: number, pressure: number): WeatherCondition {
  // Extreme heat conditions
  if (temperature >= 34 && humidity >= 60) {
    return {
      condition: "Tropical Heatwave",
      description: "Extremely hot and humid conditions. Stay hydrated and avoid prolonged outdoor activities.",
      icon: "sun",
      color: "text-red-500",
    }
  }

  // Heavy rain conditions
  if (humidity > 90 && pressure < 1000) {
    return {
      condition: "Heavy Rain",
      description: "High humidity and low pressure indicate heavy rainfall. Be cautious of potential flooding.",
      icon: "cloud-rain",
      color: "text-blue-700",
    }
  }

  // Thunderstorm conditions
  if (humidity > 85 && pressure < 1003 && temperature >= 25) {
    return {
      condition: "Thunderstorm",
      description: "High humidity and low pressure with warm temperatures suggest thunderstorms. Stay indoors.",
      icon: "cloud-lightning",
      color: "text-purple-600",
    }
  }

  // High humidity with moderate temperature
  if (temperature >= 28 && temperature <= 32 && humidity > 80) {
    return {
      condition: "Humid and Warm",
      description: "High humidity with warm temperatures. Stay cool and hydrated.",
      icon: "thermometer-sun",
      color: "text-orange-500",
    }
  }

  // Cool and rainy
  if (temperature < 25 && humidity > 85) {
    return {
      condition: "Cool and Rainy",
      description: "Cool temperatures with high humidity and possible rain. Carry an umbrella.",
      icon: "cloud-drizzle",
      color: "text-indigo-500",
    }
  }

  // Stable tropical weather
  if (pressure > 1010 && humidity <= 70 && temperature >= 26 && temperature <= 30) {
    return {
      condition: "Stable Tropical Weather",
      description: "Pleasant tropical weather with stable pressure and moderate humidity.",
      icon: "cloud-sun",
      color: "text-green-500",
    }
  }

  // Hot and dry (rare in tropical climates)
  if (temperature > 34 && humidity < 50) {
    return {
      condition: "Hot and Dry",
      description: "Unusually hot and dry conditions for a tropical climate. Stay hydrated.",
      icon: "sun",
      color: "text-yellow-600",
    }
  }

  // Monsoon-like conditions
  if (humidity > 90 && temperature >= 25 && pressure < 1005) {
    return {
      condition: "Monsoon",
      description: "High humidity and warm temperatures with low pressure indicate monsoon conditions.",
      icon: "cloud-rain",
      color: "text-blue-600",
    }
  }

  // Foggy conditions
  if (humidity > 95 && temperature < 24) {
    return {
      condition: "Foggy",
      description: "High humidity and cool temperatures causing fog. Visibility may be reduced.",
      icon: "cloud-fog",
      color: "text-gray-500",
    }
  }

  // Default - tropical moderate conditions
  return {
    condition: "Tropical Moderate",
    description: "Typical tropical weather with moderate temperature and humidity.",
    icon: "cloud",
    color: "text-green-400",
  }
}

// Function to determine if conditions are favorable for specific activities
export function getActivityRecommendations(temperature: number, humidity: number, pressure: number): string[] {
  const recommendations: string[] = []

  // Outdoor exercise
  if (temperature >= 20 && temperature <= 25 && humidity >= 40 && humidity <= 80) {
    recommendations.push("Good conditions for outdoor exercise")
  }

  // Drying clothes
  if (temperature > 28 && humidity <= 80) {
    recommendations.push("Favorable for drying clothes outdoors")
  }

  // Plant watering
  if (temperature > 25 && humidity <= 70) {
    recommendations.push("Plants may need extra watering")
  }

  // Air conditioning
  if (temperature > 28 || (temperature > 24 && humidity > 70)) {
    recommendations.push("Consider using air conditioning for comfort")
  }

  // Heating
  if (temperature < 20) {
    recommendations.push("Home heating recommended for comfort")
  }

  // Ventilation
  if (humidity > 70 && temperature > 20) {
    recommendations.push("Good ventilation recommended to reduce humidity")
  }

  // Beach day
  if (temperature > 30 && humidity <= 60) {
    recommendations.push("Perfect weather for a beach day")
  }

  // Stargazing
  if (temperature >= 15 && temperature <= 20 && humidity < 50 && pressure > 1010) {
    recommendations.push("Ideal conditions for stargazing")
  }

  // Hiking
  if (temperature >= 18 && temperature <= 25 && humidity <= 70) {
    recommendations.push("Great weather for hiking")
  }

  // Indoor activities
  if (temperature < 15 || humidity > 85) {
    recommendations.push("Consider indoor activities due to unfavorable weather")
  }

  // Gardening
  if (temperature >= 18 && temperature <= 26 && humidity >= 50 && humidity <= 70) {
    recommendations.push("Good weather for gardening")
  }

  // Snow activities
  if (temperature < 0) {
    recommendations.push("Perfect conditions for snow-related activities like skiing or snowboarding")
  }

  // Barbecue
  if (temperature >= 20 && temperature <= 30 && humidity <= 60) {
    recommendations.push("Great weather for a barbecue")
  }

  // Cycling
  if (temperature >= 16 && temperature <= 24 && humidity <= 70) {
    recommendations.push("Ideal conditions for cycling")
  }

  // Fishing
  if (temperature >= 15 && temperature <= 25 && humidity <= 80) {
    recommendations.push("Good weather for fishing")
  }

  return recommendations
}
