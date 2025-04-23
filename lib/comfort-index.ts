/**
 * Utility functions for calculating weather comfort indices
 */

/**
 * Calculate Humidex (Canadian humidity index)
 * Humidex is an index used to express how hot the weather feels to the average person
 * by combining the effect of heat and humidity
 *
 * @param temperature Temperature in Celsius
 * @param humidity Relative humidity (%)
 * @returns Humidex value
 */
export function calculateHumidex(temperature: number, humidity: number): number {
  // Calculate dewpoint first
  const a = 17.27
  const b = 237.7
  const alpha = (a * temperature) / (b + temperature) + Math.log(humidity / 100)
  const dewPoint = (b * alpha) / (a - alpha)

  // Calculate humidex using the dewpoint
  const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (dewPoint + 273.16)))
  const humidex = temperature + 0.5555 * (e - 10)

  return Math.round(humidex * 10) / 10 // Round to 1 decimal place
}

/**
 * Get Humidex comfort level description
 *
 * @param humidex Humidex value
 * @returns Object with comfort level description and color
 */
export function getHumidexComfort(humidex: number): { level: string; description: string; color: string } {
  if (humidex < 29) {
    return {
      level: "Comfortable",
      description: "Little to no discomfort",
      color: "text-green-500",
    }
  } else if (humidex >= 29 && humidex < 35) {
    return {
      level: "Noticeable Discomfort",
      description: "Some discomfort, especially during physical activity",
      color: "text-yellow-500",
    }
  } else if (humidex >= 35 && humidex < 40) {
    return {
      level: "Evident Discomfort",
      description: "Evident discomfort; limit intense physical activity",
      color: "text-orange-500",
    }
  } else if (humidex >= 40 && humidex < 45) {
    return {
      level: "Intense Discomfort",
      description: "Intense discomfort; avoid exertion",
      color: "text-red-500",
    }
  } else if (humidex >= 45 && humidex < 54) {
    return {
      level: "Dangerous",
      description: "Dangerous levels of discomfort; avoid outdoor activities",
      color: "text-red-600",
    }
  } else {
    return {
      level: "Heat Stroke Risk",
      description: "Heat stroke imminent; seek cool environment immediately",
      color: "text-purple-600",
    }
  }
}
