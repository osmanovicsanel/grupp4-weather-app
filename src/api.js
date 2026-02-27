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
