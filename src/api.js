import { CONFIG } from "./config.js";

export async function getWeatherForecast(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${CONFIG.API_KEY}&q=${city}&days=7&lang=eng&aqi=yes`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Couldn't get weatherdata");
  }

  const data = await response.json();
  return data;
}

/**
 * Hämtar väderdata baserat på koordinater
 * @author Maryam
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<Object>} - Objekt med väderdata
 */
export async function getWeatherByCoords(lat, lon) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${CONFIG.API_KEY}&q=${lat},${lon}&days=7&aqi=yes`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Couldn't get weatherdata");
    }

    const data = await response.json();
    return data;
}