console.log("Systemet är redo och filerna är kopplade!");
// console.log behöver ligga efter import, kan jag flytta på den eller är det bättre om Sanel flyttar den?
import { getWeatherForecast } from "./api.js";
import { renderWeeklyForecast } from "./ui.js";

// Vilken default stad ska vi visa när sidan laddas?
const DEFAULT_CITY = "Gothenburg";

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
    } catch (error) {
        console.error("Fel vid hämtning av väder:", error);
    }
}

// Kör funktionen direkt när sidan laddas
loadWeather(DEFAULT_CITY);