import { getWeatherForecast } from "./api.js";
import { renderWeeklyForecast } from "./ui.js";

export async function handleSearch() {
    const city = document.querySelector(".search-bar").value.trim();
    if (!city) return;

    try {
        const data = await getWeatherForecast(city);

        // Uppdatera stadens namn
        document.querySelector(".card-location").textContent = data.location.name;
        document.querySelector(".header-left span").textContent = data.location.name;

        // Uppdatera temperaturen
        const current = data.current;
        document.querySelector(".temperature").textContent = Math.round(current.temp_c) + "°";
        document.querySelector(".feels-like").textContent = `Feels like ${Math.round(current.feelslike_c)}°`;
        document.querySelector(".condition").textContent = current.condition.text;

        // Rendera 7-dagarsprognosen
        renderWeeklyForecast(data.forecast.forecastday);

    } catch (error) {
        console.error("Fel vid sökning:", error);
    }
}

import {
  renderCurrentWeather,
  renderAirQuality,
  renderWeatherDetails,
  renderWeeklyForecast,
} from "./ui.js";

export async function handleSearch() {
  const city = document.querySelector(".search-bar").value;

  if (!city.trim()) {
    alert("Ange en stad att söka efter");
    return;
  }

  try {
    const weatherData = await getWeatherForecast(city);

    // Fortsätt endast om vi har current och air_quality
    if (!weatherData.current) {
      throw new Error("Ingen 'current' data i API-svaret");
    }

    const currentWeather = weatherData.current;
    const location = weatherData.location;
    const forecastDays = weatherData.forecast?.forecastday;

    if (!forecastDays) {
      throw new Error("Ingen prognosdata i API-svaret");
    }

    const todayForecast = forecastDays[0];

    // Anropa alla render-funktioner men med skydd mot undefined
    renderCurrentWeather(currentWeather, location);

    // Kolla om air_quality finns innan vi anropar renderAirQuality
    if (currentWeather.air_quality) {
      renderAirQuality(currentWeather.air_quality);
    } else {
      console.warn(`Ingen air quality data för ${city}`);
      // Visa "Ingen data" i Air Quality kortet
      document.querySelector(".aq-value").textContent = "—";
      document.querySelector(".aq-label").textContent = "Ingen data";

      // Sätt tomma värden
      const metrics = document.querySelectorAll(".aq-metric");
      metrics.forEach((metric) => {
        metric.querySelector(".aq-metric-value").textContent = "—";
      });
    }

    renderWeatherDetails(currentWeather, todayForecast);
    renderWeeklyForecast(forecastDays);

    // Uppdatera datum
    const date = new Date(location.localtime);
    document.querySelector(".date").textContent = date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    document.querySelector(".search-bar").value = "";
  } catch (error) {
    console.error("Sökning misslyckades:", error);
    alert(
      `Kunde inte hitta väder för "${city}". Kontrollera stavningen och försök igen.`,
    );
  }
}

