/**
 * Renderar 7-dagarsprognosen i DOM:en
 * @author Maryam
 * @param {Array} forecastDays - En array med dagobjekt från WeatherAPI
 * @returns {void} - Returnerar inget värde, uppdaterar bara DOM:en
 */
export function renderWeeklyForecast(forecastDays) {
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
    const iconUrl = "https:" + dayData.day.condition.icon;
    const conditionText = dayData.day.condition.text;

    // Skapar ett nytt HTML-element för den här dagen
    const dayElement = document.createElement("div");
    dayElement.classList.add("forecast-day");

    // Fyller HTML-elementet med innehåll (samma struktur som HTML-filen)
    dayElement.innerHTML = `
            <span class="day-name">${dayName}</span>
            <span class="day-date">${dateStr}</span>
            <img src="${iconUrl}" alt="${conditionText}" class="weather-icon-small" />
            <div class="day-temps">
              <span class="precip-mm">${precipitation} mm</span>
              <span class="temp-max">${maxTemp}°</span>
              <span class="temp-min">${minTemp}°</span>
            </div>
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

  // Uppdatera ikonen--> bara sätt src-attributet
  const weatherIcon = document.querySelector(".weather-icon");
  weatherIcon.src = `https:${currentWeather.condition.icon}`;
  weatherIcon.alt = currentWeather.condition.text;
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
