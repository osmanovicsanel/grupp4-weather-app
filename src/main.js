import { getWeatherForecast, getWeatherByCoords } from "./api.js";
import {
  renderWeeklyForecast,
  renderCurrentWeather,
  renderAirQuality,
  renderWeatherDetails,
  displayCurrentDate,
  showError,
  clearError,
  renderHourlyForecast,
} from "./ui.js";
import { handleSearch } from "./utils.js";
import { getFavorites, saveFavorite, removeFavorite } from "/src/storage.js";


const DEFAULT_CITY = "Gothenburg";

// Håller koll på om geolocation redan jobbar - Maryam
let geolocationStarted = false;

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

    const currentWeather = weatherData.current;
    const location = weatherData.location;
    const forecastDays = weatherData.forecast.forecastday;
    const todayForecast = forecastDays[0];
    const hourlyData = todayForecast.hour; // Timdata för idag

    // Uppdatera alla delar av UI:t
    renderCurrentWeather(currentWeather, location);
    renderAirQuality(currentWeather.air_quality);
    renderWeatherDetails(currentWeather, todayForecast);
    renderWeeklyForecast(forecastDays);
    renderHourlyForecast(hourlyData); // <-- NY!
    updateStarState(city);

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
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Could not fetch weather data. Please try again later.");
  }
}
/**
 * Hämtar användarens position och laddar vädret för den platsen
 * @author Maryam
 * @returns {void}
 */
    async function loadWeatherByLocation() {
        // Rensar hårdkodade värden medan plats och väderdata hämtas - Alvina
    document.querySelector(".temperature").textContent = "-";
    document.querySelector(".card-location").textContent = "Fetching location...";
    document.querySelector(".header-left span").textContent = "Fetching location...";
    document.querySelector(".feels-like").textContent = "-";
    document.querySelector(".condition").textContent = "-";
    document.querySelector(".condition-detail").textContent = "-";
    document.querySelectorAll(".hour").forEach(el => el.textContent = "-");
    document.querySelectorAll(".temp").forEach(el => el.textContent = "-");
    document.querySelectorAll(".precip").forEach(el => el.textContent = "-");
    document.querySelector(".aq-value").textContent = "-";
    document.querySelector(".aq-label").textContent = "-";
    document.querySelectorAll(".aq-metric-value").forEach(el => el.textContent = "-");
    document.querySelectorAll(".card-value").forEach(el => el.textContent = "-");

    // Kontrollerar först att webbläsaren stödjer geolocation
    if (!navigator.geolocation) {
        console.error("Browser does not support geolocation");
        loadWeather(DEFAULT_CITY); // Visar i så fall defaultstaden
        return;
    }

  geolocationStarted = true;

  // Frågar användaren om tillstånd att använda platsen
  navigator.geolocation.getCurrentPosition(
    // Om användaren godkänner
    async (position) => {
      try {
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
      } catch (error) {
        console.error("Could not get location", error);
        loadWeather(DEFAULT_CITY); // Faller tillbaka på default om något går fel
      }
    },
    // Om användaren nekar eller något går fel med geolocation
    (error) => {
      console.error("Could not get location", error);
      loadWeather(DEFAULT_CITY);
    },
  );
}

// Skriver över med användarens plats när geolocation svarar
loadWeatherByLocation();

// Kör bara default om geolocation inte startade
if (!geolocationStarted) {
  loadWeather(DEFAULT_CITY);
}

/**
 * Ändrar stjärnans utseende beroende på om staden är en favorit.
 * @author Sanel
 */
function updateStarState(city) {
  const favStar = document.getElementById("fav-star");
  if (!favStar) return;

  const favorites = getFavorites();
  if (favorites.includes(city)) {
    favStar.classList.replace("fa-regular", "fa-solid");
  } else {
    favStar.classList.replace("fa-solid", "fa-regular");
  }
}

/** Klick, sparar/tarbort favoriter
 * @author Sanel
 */
document.getElementById("fav-star")?.addEventListener("click", () => {
  const city = document.getElementById("city-name").textContent;
  const favorites = getFavorites();

  if (favorites.includes(city)) {
    removeFavorite(city);
  } else {
    saveFavorite(city);
  }
  updateStarState(city);
});
