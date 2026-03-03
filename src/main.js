
import { getWeatherForecast, getWeatherByCoords } from "./api.js";
import {
  renderWeeklyForecast,
  renderCurrentWeather,
  renderAirQuality,
  renderWeatherDetails,
} from "./ui.js";
import { handleSearch } from "./utils.js";
import { displayCurrentDate } from "./ui.js";
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

// Visar aktuellt datum i headern - Alvina
displayCurrentDate();


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

/**
 * Hämtar användarens position och laddar vädret för den platsen
 * @author Maryam
 * @returns {void}
 */
function loadWeatherByLocation() {
    // Kontrollerar först att webbläsaren stödjer geolocation
    if (!navigator.geolocation) {
        console.error("Browser does not support geolocation");
        loadWeather(DEFAULT_CITY); // Visar i så fall defaultstaden
        return;
    }

    // Frågar användaren om tillstånd att använda platsen
    navigator.geolocation.getCurrentPosition(
        // Om användaren godkänner
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weatherData = await getWeatherByCoords(lat, lon);

            const currentWeather = weatherData.current;
            const location = weatherData.location;
            const forecastDays = weatherData.forecast.forecastday;
            const todayForecast = forecastDays[0];

            renderCurrentWeather(currentWeather, location);
            renderAirQuality(currentWeather.air_quality);
            renderWeatherDetails(currentWeather, todayForecast);
            renderWeeklyForecast(forecastDays);
        },
        // Om användaren nekar eller nåt går fel
        (error) => {
            console.error("Could not get location", error);
            loadWeather(DEFAULT_CITY); // Visar i så fall defaultstaden
        }
    );
}

loadWeatherByLocation();
