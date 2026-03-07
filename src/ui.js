import { getWeatherIcon } from "./icons.js";
/**
 * Visar ett felmeddelande om staden inte hittas.
 * @author: Sanel
 * @param {string} message - Texten som ska visas i felmeddelandet.
 * @returns {void}
 */

export function showError(message) {
  const errorMessage = document.getElementById("error-message");
  const cityInput = document.getElementById("city-input");
  const weatherCard = document.getElementById("weather-card"); // För att rensa

  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");

  cityInput.value = "";
  if (weatherCard) {
    weatherCard.style.display = "none"; // Dölj väderkortet om det finns
  }
}

/**
 * Återställer vyn inför en ny sökning genom att dölja felmeddelanden.
 * @author: Sanel
 * @returns {void}
 */
export function clearError() {
  const errorMessage = document.getElementById("error-message");
  const weatherCard = document.getElementById("weather-card"); // För att visa igen

  errorMessage.classList.add("hidden");
  if (weatherCard) {
    weatherCard.style.display = "block"; // Visa väderkortet igen när vi söker igen.
  }
}
/**
 * Renderar 7-dagarsprognosen i DOM:en
 * @author Maryam
 * @param {Array} forecastDays - En array med dagobjekt från WeatherAPI
 * @returns {void} - Returnerar inget värde, uppdaterar bara DOM:en
 */
export function renderWeeklyForecast(forecastDays) {
  console.log(forecastDays.length); // debugging - visar bara 3 dagar
  console.log(forecastDays); // debugging
  // Hitta elementet i HTML där datan ska läggas in
  const forecastList = document.querySelector(".forecast-list");

  // Tömmer listan innan den fylls med ny data
  forecastList.innerHTML = "";

  // Loopa igenom varje dag i arrayen
  forecastDays.forEach((dayData) => {
    // Plocka ut datan vi behöver ur varje dagopbekt
    const date = new Date(dayData.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const dateStr = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    const maxTemp = Math.round(dayData.day.maxtemp_c);
    const minTemp = Math.round(dayData.day.mintemp_c);
    const precipitation = dayData.day.totalprecip_mm;
    const conditionText = dayData.day.condition.text;
    const iconClass = getWeatherIcon(conditionText, 1);

    // Skapar ett nytt HTML-element för den här dagen
    const dayElement = document.createElement("div");
    dayElement.classList.add("forecast-day");

    // Fyller HTML-elementet med innehåll (samma struktur som HTML-filen)
    dayElement.innerHTML = `
            <span class="day-name">${dayName}</span>
            <span class="day-date">${dateStr}</span>
            <i class="${iconClass}"></i>
            <div class="day-temps">
              <span class="temp-max">${maxTemp}°</span>
              <span class="temp-min">${minTemp}°</span>
            </div>
            <span class="precip-mm">${precipitation} mm</span>
        `;

    // Lägger till dagelementet i listan
    forecastList.appendChild(dayElement);
  });
}

/**
 * Uppdaterar nuvarande väder i UI:t
 * @author Ivana
 * @param {Object} currentWeather - Nuvarande väderdata från API
 * @param {Object} location - Platsinformation från API
 * @returns {void}
 */
export function renderCurrentWeather(currentWeather, location) {
  document.querySelector(".header-left span").textContent = location.name;
  document.querySelector(".card-location").textContent = location.name;
  document.querySelector(".temperature").textContent =
    `${Math.round(currentWeather.temp_c)}°`;
  document.querySelector(".feels-like").textContent =
    `Feels like ${Math.round(currentWeather.feelslike_c)}°`;
  document.querySelector(".condition").textContent =
    currentWeather.condition.text;

  const conditionDetail = document.querySelector(".condition-detail");
  if (conditionDetail) {
    conditionDetail.textContent = getConditionDescription(
      currentWeather.condition.text,
    );
  }

  /*
  // Uppdatera ikonen--> bara sätt src-attributet
  const weatherIcon = document.querySelector(".weather-icon");
  weatherIcon.src = `https:${currentWeather.condition.icon}`;
  weatherIcon.alt = currentWeather.condition.text; */
  const iconClass = getWeatherIcon(
    currentWeather.condition.text,
    currentWeather.is_day,
  );
  const weatherIcon = document.querySelector(".weather-icon");
  weatherIcon.className = `weather-icon ${iconClass}`;
  console.log(currentWeather.condition.text);
  console.log(currentWeather.is_day);
}

// Hjälpfunktion för att få beskrivningar på engelska
function getConditionDescription(condition) {
  const descriptions = {
    Sunny: "Clear skies with plenty of sunshine.",
    Clear: "Clear skies expected.",
    "Partly cloudy": "Expect partly cloudy skies.",
    Cloudy: "Cloudy conditions throughout the day.",
    Overcast: "Overcast skies with limited sunshine.",
    Mist: "Misty conditions with reduced visibility.",
    Rain: "Rain expected. Don't forget your umbrella!",
    "Light rain": "Light rain showers expected.",
    "Heavy rain": "Heavy rainfall expected.",
    Snow: "Snow expected. Bundle up!",
    Thunderstorm: "Thunderstorms possible. Stay safe!",
  };

  return descriptions[condition] || `${condition} conditions expected today.`;
}

/**
 * Uppdaterar air quality i UI:t
 * @author Ivana
 * @param {Object} airQuality - Luftkvalitetsdata från WeatherAPI
 * @returns {void}
 */
export function renderAirQuality(airQuality) {
  if (!airQuality || typeof airQuality !== "object") {
    document.querySelector(".aq-value").textContent = "—";
    document.querySelector(".aq-label").textContent = "No data";
    document.querySelector(".aq-label").className = "aq-label";
    return;
  }

  const usEpaIndex = airQuality["us-epa-index"];
  const pm25 = airQuality.pm2_5 || 0;

  document.querySelector(".aq-value").textContent = Math.round(pm25);

  const aqiLabel = document.querySelector(".aq-label");
  let labelText = "";
  let colorClass = "";

  if (usEpaIndex) {
    const aqiMap = {
      1: { text: "Good", class: "aq-good" },
      2: { text: "Moderate", class: "aq-moderate" },
      3: { text: "Unhealthy for Sensitive Groups", class: "aq-sensitive" },
      4: { text: "Unhealthy", class: "aq-unhealthy" },
      5: { text: "Very Unhealthy", class: "aq-very-unhealthy" },
      6: { text: "Hazardous", class: "aq-hazardous" },
    };
    labelText = aqiMap[usEpaIndex].text;
    colorClass = aqiMap[usEpaIndex].class;
  } else {
    if (pm25 <= 12) {
      labelText = "Good";
      colorClass = "aq-good";
    } else if (pm25 <= 35.4) {
      labelText = "Moderate";
      colorClass = "aq-moderate";
    } else if (pm25 <= 55.4) {
      labelText = "Unhealthy for Sensitive Groups";
      colorClass = "aq-sensitive";
    } else if (pm25 <= 150.4) {
      labelText = "Unhealthy";
      colorClass = "aq-unhealthy";
    } else if (pm25 <= 250.4) {
      labelText = "Very Unhealthy";
      colorClass = "aq-very-unhealthy";
    } else {
      labelText = "Hazardous";
      colorClass = "aq-hazardous";
    }
  }

  aqiLabel.textContent = labelText;
  aqiLabel.className = `aq-label ${colorClass}`;

  // Uppdatera metrics
  const metrics = document.querySelectorAll(".aq-metric");
  if (metrics.length >= 4) {
    metrics[0].querySelector(".aq-metric-value").textContent = Math.round(
      airQuality.pm2_5 || 0,
    );
    metrics[1].querySelector(".aq-metric-value").textContent = Math.round(
      airQuality.pm10 || 0,
    );
    metrics[2].querySelector(".aq-metric-value").textContent = Math.round(
      airQuality.o3 || 0,
    );
    metrics[3].querySelector(".aq-metric-value").textContent = Math.round(
      airQuality.no2 || 0,
    );
  }
}

/**
 * Uppdaterar väderdetaljer i UI:t
 * @author Ivana
 * @param {Object} currentWeather - Nuvarande väderdata
 * @param {Object} forecastDay - Dagens prognosdata
 * @returns {void}
 */
export function renderWeatherDetails(currentWeather, forecastDay) {
  const details = {
    humidity: `${currentWeather.humidity}%`,
    windSpeed: `${Math.round(currentWeather.wind_kph)} km/h`,
    visibility: `${currentWeather.vis_km} km`,
    pressure: `${currentWeather.pressure_mb} mb`,
    uvIndex: currentWeather.uv,
    precipitation: `${forecastDay.day.daily_chance_of_rain}%`,
    sunrise: forecastDay.astro.sunrise,
    sunset: forecastDay.astro.sunset,
  };

  // Hämta alla detail-card element
  const detailCards = document.querySelectorAll(".detail-card");

  // Uppdatera varje kort baserat på ikon eller label, (hur gör vi bäst det?)
  detailCards.forEach((card) => {
    const label = card.querySelector(".card-label span").textContent;
    const valueElement = card.querySelector(".card-value");

    switch (label) {
      case "Humidity":
        valueElement.textContent = details.humidity;
        break;
      case "Wind Speed":
        valueElement.textContent = details.windSpeed;
        break;
      case "Visibility":
        valueElement.textContent = details.visibility;
        break;
      case "Pressure":
        valueElement.textContent = details.pressure;
        break;
      case "UV Index":
        valueElement.textContent = details.uvIndex;
        break;
      case "Precipitation":
        valueElement.textContent = details.precipitation;
        break;
      case "Sunrise":
        valueElement.textContent = details.sunrise;
        break;
      case "Sunset":
        valueElement.textContent = details.sunset;
        break;
    }
  });
}
// Ska någon felhantering läggas in här eller gör vi det i en helt separat fil?

/**
 * Visar det aktuella datumet i headern
 * @author Alvina
 * @returns {void} - Retunerar inget värde, uppdaterar bara DOM:en
 */
export function displayCurrentDate() {
  const now = new Date();
  const dateName = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  document.querySelector(".date").textContent = `${dateName}, ${date}`;
}

/**
 * Renderar timvis prognos
 * @author Ivana
 * @param {Array} hours - Array med timdata från API (forecastday[0].hour)
 * @returns {void}
 */
export function renderHourlyForecast(hours) {
  console.log("renderHourlyForecast anropad med", hours?.length, "timmar");

  // Hitta rätt container (hourly-forecast)
  const hourlyContainer = document.querySelector(".hourly-forecast");

  if (!hourlyContainer) {
    console.error("Hourly container not found");
    return;
  }

  // Kontrollera att hours finns
  if (!hours || !Array.isArray(hours) || hours.length === 0) {
    console.warn("Ingen timdata tillgänglig");
    hourlyContainer.innerHTML = "<p>No hourly data available</p>";
    return;
  }

  // Töm befintlig data
  hourlyContainer.innerHTML = "";

  // Välj hur många timmar som ska visas (t.ex 12 eller 24)
  const hoursToShow = 24;

  // Loopar genom timmarna (börja från nuvarande timme)
  const now = new Date();
  const currentHour = now.getHours();

  // Hitta index för närmaste kommande timme
  let startIndex = hours.findIndex((hour) => {
    const hourTime = new Date(hour.time).getHours();
    return hourTime >= currentHour;
  });

  // Om ingen kommande timme hittas, börja från början
  if (startIndex === -1) startIndex = 0;

  // Visa 12 timmar framåt (eller färre om det inte finns 12)
  const hoursToShow_arr = hours.slice(startIndex, startIndex + hoursToShow);

  hoursToShow_arr.forEach((hour) => {
    // Formatera tiden (API returnerar "2024-01-15 14:00")
    const timeStr = hour.time.split(" ")[1]; // "14:00"
    const hourFormatted = timeStr.substring(0, 5); // "14:00"

    // Hämta temperatur och nederbörd
    const temp = Math.round(hour.temp_c);
    const precip = hour.chance_of_rain || 0;

    // Välj ikon (Alvinas ikonfunktion kan användas här tror jag, eller så gör vi en enklare mapping)
    let iconClass = "fa-solid fa-cloud"; // Default

    // Försök hämta ikonklass om funktionen finns
    if (typeof getWeatherIcon === "function") {
      iconClass = getWeatherIcon(hour.condition.text, hour.is_day);
    } else {
      // Annars använd en enkel mapping
      if (hour.condition.text.toLowerCase().includes("sun")) {
        iconClass = "fa-solid fa-sun";
      } else if (hour.condition.text.toLowerCase().includes("cloud")) {
        iconClass = "fa-solid fa-cloud";
      } else if (hour.condition.text.toLowerCase().includes("rain")) {
        iconClass = "fa-solid fa-cloud-rain";
      }
    }

    // Skapa hourly-item
    const hourlyItem = document.createElement("div");
    hourlyItem.classList.add("hourly-item");

    hourlyItem.innerHTML = `
      <span class="hour">${hourFormatted}</span>
      <i class="${iconClass}"></i>
      <span class="temp">${temp}°</span>
      <span class="precip">${precip}%</span>
    `;

    hourlyContainer.appendChild(hourlyItem);
  });
}
