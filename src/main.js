
import { getWeatherForecast } from "./api.js";
import {
  renderWeeklyForecast,
  renderCurrentWeather,
  renderAirQuality,
  renderWeatherDetails,
} from "./ui.js";
import { handleSearch } from "./utils.js";
import { showError, clearError } from "./ui.js";


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

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

/**
 *  Lyssna på klick på förstoringsglaset
 * @author Sanel
*/
document.getElementById("search-btn").addEventListener("click", async () => {
    await handleSearch();
});

/**
 *  Funktion för felhantering
 * @author Sanel
 * @returns {Promise<void>}
 */
 async function handleSearch() {
    const city = cityInput.value.trim();
    clearError();

if (!city) {
    showError("Please enter a city name.");
    return;
}

try {

    // TODO: HÄR SKA VI ANROPA API:ET OCH HÄMTA VÄDERDATA! Och även lägga till om API:et inte hittar staden. - Sanel

} catch (error) {
    showError("Could not fetch weather data. Please check the spelling.");
}
}

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
    console.error("Error fetching weather data:", error);
    // Visa felmeddelande för användaren
    alert("Could not fetch weather data. Please try again later.");
  }
}

loadWeather(DEFAULT_CITY);
