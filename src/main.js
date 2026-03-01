import { getWeatherForecast } from "./api.js";
import { renderWeeklyForecast } from "./ui.js";
import { handleSearch } from "./utils.js";

console.log("Systemet är redo och filerna är kopplade!");

// Vilken default stad ska vi visa när sidan laddas?
const DEFAULT_CITY = "Gothenburg";

// Lyssna på Enter-knapptryck - Alvina
document.querySelector(".search-bar").addEventListener("keydown", async(event) => {
    if (event.key === "Enter") {
        const city = event.target.value; //Hämtar stadens namn från sökfältet. Sanel
        await handleSearch();
        updateStarState(city); // Uppdaterar stjärnan efter sökning. Sanel
    }
});


/**
 * Hämtar väderdata för en stad och uppdaterar sidan
 * @author Maryam
 * @param {String} city - Stadens namn
 * @returns {Promise<void>} - Returnerar inget värde, uppdaterar bara DOM
 */
async function loadWeather(city) {
    try {
        // Försöker hämta data
        // Och plockar ut 7-dagars prognosen
        const weatherData = await getWeatherForecast(city);
        const forecastDays = weatherData.forecast.forecastday;

        // Skickar datan till ui.js som skapar innehållet i DOM
        renderWeeklyForecast(forecastDays);

        // Kollar om staden är favorit och uppdaterar stjärnan också. Sanel
        updateStarState(city);

    } catch (error) {
        console.error("Fel vid hämtning av väder:", error);
    }
}

// Kör funktionen direkt när sidan laddas
loadWeather(DEFAULT_CITY);

// Hämtar element från HTML . Sanel
const favStar = document.getElementById('fav-star');
const cityNameDisplay = document.getElementById('city-name');

// Detta är funktionen för att hämta favoriter från LocalStorage. Sanel
function getFavorites() {
    const saved = localStorage.getItem('weather_favorites');
    return saved ? JSON.parse(saved) : [];
}

// Klick för att lägga till eller ta bort favorit. Sanel
favStar.addEventListener('click', () => {
    const city = cityNameDisplay.textContent;
    let favorites = getFavorites();

    // Kod för att dubbelkolla så den inte redan är en favorit. Sanel
    if (favorites.includes(city)) {
        favorites = favorites.filter(fav => fav !== city);
        favStar.classList.remove('is-favorite');
        favStar.classList.replace('fa-solid', 'fa-regular');
            console.log(`${city} Borttagen från favoriter`);
    } else {
        favorites.push(city);
        favStar.classList.add('is-favorite');
        favStar.classList.replace('fa-regular', 'fa-solid');
            console.log(`${city} Sparad som favorit!`);
        }

        // Spara uppdaterade favoriter i LocalStorage. Sanel
        localStorage.setItem('weather_favorites', JSON.stringify(favorites));
});

// Om staden är en favorit när sidan laddas, visa det visuellt. Sanel
function updateStarState(city) {
    const favorites = getFavorites();
    const favStar = document.getElementById('fav-star');

    if (favorites.includes(city)) {
        favStar.classList.add('is-favorite');
        favStar.classList.replace('fa-regular', 'fa-solid');
    } else {
        favStar.classList.remove('is-favorite');
        favStar.classList.replace('fa-solid', 'fa-regular');
    }
}
