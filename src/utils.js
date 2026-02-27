import { getWeatherForecast } from "./api.js";

// Hanterar data när användaren söker efter en stad - Alvina
export async function handleSearch() {
    const city = document.querySelector(".search-bar").value;

    // Hämtar väderdata och skriver ut stadens namn - Alvina
    const data = await getWeatherForecast(city);
    console.log(data);
    document.querySelector(".card-location").textContent = city;
}

const now = new Date();
const dateName = now.toLocaleDateString("en-US", {weekday: "long"});
const date = now.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric"});

document.querySelector(".date").textContent = `${dateName}, ${date}`;