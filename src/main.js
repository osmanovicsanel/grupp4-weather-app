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
import { getFavorites, saveFavorite, removeFavorite } from "/src/storage.js";

let currentActiveCity = "";


const DEFAULT_CITY = "Gothenburg";

// Håller koll på om geolocation redan jobbar - Maryam
let geolocationStarted = false;

// Lyssna på Enter-knapptryck - Alvina
document
  .querySelector(".search-bar")
  .addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      const city = event.target.value;
      if (city) {
        await loadWeather(city);
        event.target.value = "";
      }
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
  const city = document.getElementById("city-input").value;
  if (city) {
    await loadWeather(city);
    document.getElementById("city-input").value = "";
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
    currentActiveCity = location.name; // Sanel
    const forecastDays = weatherData.forecast.forecastday;
    const todayForecast = forecastDays[0];

    // Uppdatera alla delar av UI:t
    renderCurrentWeather(currentWeather, location); // Ivana
    renderAirQuality(currentWeather.air_quality); // Ivana
    renderWeatherDetails(currentWeather, todayForecast); // Ivana
    renderWeeklyForecast(forecastDays); // Maryam
    updateStarState(currentActiveCity); // Sanel

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
                currentActiveCity = location.name; // Sanel
                updateStarState(currentActiveCity); // Sanel
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
        }
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
  const favStar = document.getElementById('fav-star');
  if (!favStar) return;

  const favorites = getFavorites();
  if (favorites.includes(city)) {
    favStar.className = "fa-solid fa-star";
  } else {
    favStar.className = "fa-regular fa-star";
  }
}

/**
 * Klick, sparar/tarbort favoriter
 * @author Sanel
 */
document.addEventListener('click', (event) => {
  if (event.target && event.target.id === 'fav-star') {

    if (!currentActiveCity) return;
    
    const favorites = getFavorites();

    if (favorites.includes(currentActiveCity)) {
      removeFavorite(currentActiveCity);
    } else {
      saveFavorite(currentActiveCity);
    }

    updateStarState(currentActiveCity);
    }
  });