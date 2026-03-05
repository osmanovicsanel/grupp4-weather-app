/**
 * Retunerar rätt Font Awsome ikon baserat på vilket väder det är och vilken tid på dygnet det är
 * @author Alvina
 * @param {string} conditionText - väderdatabeskrivning från WeatherAPI
 * @param {number} isDay - 1 för dag, 0 för natt
 * @returns {string} - Font Awsome klassträng
 */

export function getWeatherIcon(conditionText, isDay) {
    const dayIcons = {
        "Sunny": "fa-solid fa-sun",
        "Clear": "fa-solid fa_sun",
        "Partly cloudy": "fa-solid fa-cloud-sun",

        // Regn
        "Light rain": "fa-solid fa-cloud-rain",
    };

    const nightIcons = {
        "Sunny": "fa-solid fa-moon",
        "Clear": "fa-solid fa-moon",
        "Partly cloudy": "fa-solid fa-cloud-moon",

        // Regn
        "Light rain": "fa-solid fa-cloud-moon-rain",
    };

    const sharedIcons = {

        // Regn
        "Rain": "fa-solid fa-cloud-rain",
        "Patchy rain possible": "fa-solid fa-cloud-rain",
        "Heavy rain": "fa-solid fa-cloud-showers-heavy",
        "Heavy rain at times": "fa-solid fa-cloud-showers-heavy",
        "Patchy light drizzle": "fa-solid fa-cloud-rain",
        "Light drizzle": "fa-solid fa-cloud-rain",
        "Patchy light rain": "fa-solid fa-cloud-rain",
        "Light rain": "fa-solid fa-cloud-rain",
        "Moderate rain at times": "fa-solid fa-cloud-rain",
        "Moderate rain": "fa-solid fa-cloud-rain",
        "Light freezing rain": "fa-solid fa-cloud-rain",
        "Moderate or heavy freezing rain": "fa-solid fa-cloud-shower-rain",
        "Ice pellets": "fa-solid fa-cloud-meatball",
        "Light rain shower": "fa-solid fa-cloud-rain",
        "Moderate or heavy rain shower": "fa-solid fa-cloud-shower-rain",
        "Torrential rain shower": "fa-solid fa-cloud-shower-rain",
        "Light snowers of ice pellets": "fa-solid fa-cloud-rain",
        "Moderate or heavy showers of ice pellets": "fa-solid fa-cloud-shower-rain",

        // Snö
        "Patchy snow possible": "fa-solid fa-snowflake",
        "Patchy sleet possible": "fa-solid fa-snowflake",
        "Patchy freezing drizzle possible": "fa-solid fa-cloud-rain",
        "Blowing snow": "fa-solid fa-snowflake",
        "Blizzard": "fa solid fa-snowflake",
        "Freezing drizzle": "fa-solid fa-snowflake",
        "Heavy freezing drizzle": "fa-solid fa-snowflake",
        "Light snow": "fa-solid fa-snowflake",
        "Light sleet": "fa-solid fa-snowflake",
        "Moderate or heavy sleet": "fa-solid fa-snowflake",
        "Patchy light snow": "fa-solid fa-snowflake",
        "Patchy moderate snow": "fa-solid fa-snowflake",
        "Moderate snow": "fa-solid fa snowflake",
        "Patchy heavy snow": "fa-solid fa-snowflake",
        "Heavy snow": "fa-solid fa-snowflake",
        "Light sleet showers": "fa-solid fa-snowflake",
        "Moderate or heavy sleet showers": "fa-solid fa-snowflake",
        "Light snow showers": "fa-solid fa-snowflake",
        "Moderate or heavy snow showers": "fa-snowflake",



        //Molnigt
        "Cloudy": "fa-solid fa-cloud",
        "Overcast": "fa-solid fa-cloud",
        "Mist": "fa-solid fa-water",
        "Fog": "fa-solid fa-smog",
        "Freezing fog": "fa-solid fa-smog",

        // Åska
        "Thundery outbreak possible": "fa-solid fa-cloud-bolt",
        "Patchy light rain with thunder": "fa-solid fa-cloud-bolt",
        "Moderate or heavy rain with thunder": "fa-solid fa-cloud-bolt",
        "Patchy light snow with thunder": "fa-solid fa-cloud-bolt",
        "Moderate or heavy snow with thunder": "fa-solid fa-cloud-bolt",
    }


    if (isDay) {
        return dayIcons[conditionText] || sharedIcons[conditionText] || "fa-solid fa-cloud";
    } else {
        return nightIcons[conditionText] || sharedIcons[conditionText] || "fa-solid fa-cloud";
    }
}

