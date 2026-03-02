import { getWeatherForecast } from "./api.js";
import { renderWeeklyForecast } from "./ui.js";
import { saveCity, getRecentCities } from "./storage.js";

const searchBar = document.querySelector(".search-bar");
const dropdown = document.querySelector(".search-dropdown");

// Visa dropdown när användaren klickar på sökfältet
searchBar.addEventListener("focus", () => {
    showDropdown();
});

// Dölj dropdown när användaren klickar någon annanstans
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
        dropdown.classList.add("hidden");
    }
});

/*** Visar de 4 senaste sökningarna i dropdown */
function showDropdown() {
    const cities = getRecentCities();
    dropdown.innerHTML = "";

    if (cities.length === 0) {
        dropdown.classList.add("hidden");
        return;
    }

    cities.forEach(city => {
        const li = document.createElement("li");
        li.innerHTML = `${city}`;
        li.addEventListener("click", () => {
            searchBar.value = city;
            dropdown.classList.add("hidden");
            handleSearch();
        });
        dropdown.appendChild(li);
    });

    dropdown.classList.remove("hidden");
}

export async function handleSearch() {
    const city = searchBar.value.trim();
    if (!city) return;

    try {
        const data = await getWeatherForecast(city);

        // Spara staden i historiken
        saveCity(data.location.name);

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

        // Stäng dropdown efter sökning
        dropdown.classList.add("hidden");

    } catch (error) {
        console.error("Fel vid sökning:", error);
    }
}