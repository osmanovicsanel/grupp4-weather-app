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
import { getFavorites, saveFavorite, removeFavorite, getRecentSearches, saveRecentSearch } from "./storage.js"; // Albrim lade till getRecentsearches

const DEFAULT_CITY = "Gothenburg";

// Håller koll på om geolocation redan jobbar - Maryam
let geolocationStarted = false;

let currentActiveCity = ""; // Sanel

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

    const currentWeather = weatherData.current;
    const location = weatherData.location;
    currentActiveCity = location.name; // Sanel
    saveRecentSearch(location.name); // Albrim
    const forecastDays = weatherData.forecast.forecastday;
    const todayForecast = forecastDays[0];
    const hourlyData = todayForecast.hour; // Timdata för idag

    // Uppdatera alla delar av UI:t
    renderCurrentWeather(currentWeather, location);
    renderAirQuality(currentWeather.air_quality);
    renderWeatherDetails(currentWeather, todayForecast);
    renderWeeklyForecast(forecastDays);
    renderHourlyForecast(hourlyData); // <-- NY!
    updateStarState(currentActiveCity); // Sanel

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
 * @author Maryam & Ivana
 * @returns {void}
 */
async function loadWeatherByLocation() {
  // Rensar hårdkodade värden medan plats och väderdata hämtas - Alvina
  document.querySelector(".temperature").textContent = "-";
  document.querySelector(".card-location").textContent = "Fetching location...";
  document.querySelector(".header-left span").textContent =
    "Fetching location...";
  document.querySelector(".feels-like").textContent = "-";
  document.querySelector(".condition").textContent = "-";
  document.querySelector(".condition-detail").textContent = "-";
  document.querySelectorAll(".hour").forEach((el) => (el.textContent = "-"));
  document.querySelectorAll(".temp").forEach((el) => (el.textContent = "-"));
  document.querySelectorAll(".precip").forEach((el) => (el.textContent = "-"));
  document.querySelector(".aq-value").textContent = "-";
  document.querySelector(".aq-label").textContent = "-";
  document
    .querySelectorAll(".aq-metric-value")
    .forEach((el) => (el.textContent = "-"));
  document
    .querySelectorAll(".card-value")
    .forEach((el) => (el.textContent = "-"));

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
        const hourlyData = todayForecast.hour; // Timdata för användarens plats

        renderCurrentWeather(currentWeather, location);
        renderAirQuality(currentWeather.air_quality);
        renderWeatherDetails(currentWeather, todayForecast);
        renderWeeklyForecast(forecastDays);
        renderHourlyForecast(hourlyData); // <-- NY!
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
    renderSearchDropdown(); // Albrim — uppdatera dropdown
  }
});

// ── Dropdown-logik - Albrim 

function renderSearchDropdown() {
  const recent = getRecentSearches();
  const favorites = getFavorites();

  const recentList = document.getElementById("recent-list");
  const favoritesList = document.getElementById("favorites-list");
  const recentSection = document.getElementById("recent-section");
  const favoritesSection = document.getElementById("favorites-section");
  const dropdown = document.getElementById("search-dropdown");

  recentList.innerHTML = "";
  if (recent.length > 0) {
    recentSection.style.display = "block";
    recent.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city;
      li.addEventListener("click", () => {
        document.getElementById("city-input").value = city;
        closeDropdown();
        loadWeather(city);
      });
      recentList.appendChild(li);
    });
  } else {
    recentSection.style.display = "none";
  }

  favoritesList.innerHTML = "";
  if (favorites.length > 0) {
    favoritesSection.style.display = "block";
    favorites.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city;
      li.addEventListener("click", () => {
        document.getElementById("city-input").value = city;
        closeDropdown();
        loadWeather(city);
      });
      favoritesList.appendChild(li);
    });
  } else {
    favoritesSection.style.display = "none";
  }

  if (recent.length > 0 || favorites.length > 0) {
    dropdown.classList.remove("hidden");
  } else {
    dropdown.classList.add("hidden");
  }
}

function closeDropdown() {
  document.getElementById("search-dropdown").classList.add("hidden");
}

document.getElementById("city-input").addEventListener("focus", () => {
  renderSearchDropdown();
});

document.addEventListener("click", (e) => {
  const wrapper = document.querySelector(".search-wrapper");
  if (!wrapper.contains(e.target)) {
    closeDropdown();
  }
});