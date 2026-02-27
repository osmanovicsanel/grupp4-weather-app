console.log("Systemet är redo och filerna är kopplade!");
// console.log behöver ligga efter import, kan jag flytta på den eller är det bättre om Sanel flyttar den?
import { getWeatherForecast } from "./api.js";
import {
  renderWeeklyForecast,
  renderCurrentWeather,
  renderAirQuality,
  renderWeatherDetails,
} from "./ui.js";
import { handleSearch } from "./utils.js";

// Vilken default stad ska vi visa när sidan laddas?
const DEFAULT_CITY = "Gothenburg";

// Lyssna på Enter-knapptryck - Alvina
document
  .querySelector(".search-bar")
  .addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  });

/**
 * Hämtar väderdata för en stad och uppdaterar hela sidan
 * @author Maryam & Ivana
 * @param {String} city - Stadens namn
 * @returns {Promise<void>}
 */
async function loadWeather(city) {
  try {
    const weatherData = await getWeatherForecast(city);

    // Extrahera all data vi behöver
    const currentWeather = weatherData.current;
    const location = weatherData.location;
    const forecastDays = weatherData.forecast.forecastday;
    const todayForecast = forecastDays[0];

    // Uppdatera alla delar av UI:t
    renderCurrentWeather(currentWeather, location); // Ivana
    renderAirQuality(currentWeather.air_quality); // Ivana
    renderWeatherDetails(currentWeather, todayForecast); // Ivana
    renderWeeklyForecast(forecastDays); // Maryam

    // Uppdatera datum i headern
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
  } catch (error) {
    console.error("Fel vid hämtning av väder:", error);
    // Visa felmeddelande för användaren
    alert("Kunde inte hämta väderdata. Försök igen senare.");
  }
}

loadWeather(DEFAULT_CITY);
