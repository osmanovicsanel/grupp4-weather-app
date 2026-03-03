import { getWeatherForecast } from "./api.js";
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

/**
* Visar det aktuella datumet i headern
* @author Alvina
* @returns {void} - Retunerar inget värde, uppdaterar bara DOM:en
*/
export function displayCurrentDate() {
    const now = new Date();
    const dateName = now.toLocaleDateString("en-US", { weekday: "long" });
    const date = now.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

    document.querySelector(".date").textContent = `${dateName}, ${date}`;
}

