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
import { getFavorites, saveFavorite, removeFavorite, getRecentSearches } from "./storage.js";

const DEFAULT_CITY = "Gothenburg";

let geolocationStarted = false;

// Lyssna på Enter-knapptryck - Alvina
document
  .querySelector(".search-bar")
  .addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      closeDropdown();
      await handleSearch();
    }
  });

// Visar aktuellt datum i headern - Alvina
displayCurrentDate();

// Lyssna på klick på förstoringsglaset - Sanel
document.getElementById("search-btn").addEventListener("click", async () => {
  closeDropdown();
  await handleSearch();
});

/**
 * Hämtar väderdata för en stad och uppdaterar hela sidan
 * @author Maryam & Ivana
 */
async function loadWeather(city) {
  try {
    const weatherData = await getWeatherForecast(city);

    const currentWeather = weatherData.current;
    const location = weatherData.location;
    const forecastDays = weatherData.forecast.forecastday;
    const todayForecast = forecastDays[0];
    const hourlyData = todayForecast.hour;

    renderCurrentWeather(currentWeather, location);
    renderAirQuality(currentWeather.air_quality);
    renderWeatherDetails(currentWeather, todayForecast);
    renderWeeklyForecast(forecastDays);
    renderHourlyForecast(hourlyData);
    updateStarState(city);

    const date = new Date(location.localtime);
    document.querySelector(".date").textContent = date.toLocaleDateString(
      "en-US",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    );
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Could not fetch weather data. Please try again later.");
  }
}

/**
 * Hämtar användarens position och laddar vädret för den platsen
 * @author Maryam
 */
function loadWeatherByLocation() {
  if (!navigator.geolocation) {
    console.error("Browser does not support geolocation");
    loadWeather(DEFAULT_CITY);
    return;
  }

  geolocationStarted = true;

  navigator.geolocation.getCurrentPosition(
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
        loadWeather(DEFAULT_CITY);
      }
    },
    (error) => {
      console.error("Could not get location", error);
      loadWeather(DEFAULT_CITY);
    }
  );
}

loadWeatherByLocation();

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
  const isFavorite = favorites.some(fav => fav.toLowerCase() === city.toLowerCase()); // Albrim
  
  if (isFavorite) {
    favStar.classList.replace("fa-regular", "fa-solid");
  } else {
    favStar.classList.replace("fa-solid", "fa-regular");
  }
}

/**
 * Klick på stjärnan — sparar/tar bort favorit och uppdaterar dropdown
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
  // Uppdatera dropdown om den råkar vara öppen
  renderSearchDropdown();
});

// ── Dropdown-logik ──────────────────────────────────────────────

/**
 * Renderar dropdown med senaste sökningar och favoriter
 * @author Albrim
 */
function renderSearchDropdown() {
  const recent = getRecentSearches();
  const favorites = getFavorites();

  const recentList = document.getElementById("recent-list");
  const favoritesList = document.getElementById("favorites-list");
  const recentSection = document.getElementById("recent-section");
  const favoritesSection = document.getElementById("favorites-section");
  const dropdown = document.getElementById("search-dropdown");

  // Senaste sökningar
  recentList.innerHTML = "";
  if (recent.length > 0) {
    recentSection.style.display = "block";
    recent.forEach((city) => {
      const li = document.createElement("li");
      li.innerHTML = `${city}`;;
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

  // Favoriter - Albrim
  favoritesList.innerHTML = "";
  if (favorites.length > 0) {
    favoritesSection.style.display = "block";
    favorites.forEach((city) => {
      const li = document.createElement("li");
      li.innerHTML = `${city}`;;
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

  // Visa bara om det finns något
  if (recent.length > 0 || favorites.length > 0) {
    dropdown.classList.remove("hidden");
  } else {
    dropdown.classList.add("hidden");
  }
}

function closeDropdown() {
  document.getElementById("search-dropdown").classList.add("hidden");
}

// Öppna dropdown vid fokus på sökfältet
document.getElementById("city-input").addEventListener("focus", () => {
  renderSearchDropdown();
});

// Stäng dropdown vid klick utanför
document.addEventListener("click", (e) => {
  const wrapper = document.querySelector(".search-wrapper");
  if (!wrapper.contains(e.target)) {
    closeDropdown();
  }
});