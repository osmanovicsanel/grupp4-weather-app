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
        const dayName = date.toLocaleDateString("sv-SE", { weekday: "long" });
        const dateStr = date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
        const maxTemp = Math.round(dayData.day.maxtemp_c);
        const minTemp = Math.round(dayData.day.mintemp_c);
        const rainChance = dayData.day.daily_chance_of_rain;
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
              <span class="precip-percent">${rainChance}%</span>
              <span class="temp-max">${maxTemp}°</span>
              <span class="temp-min">${minTemp}°</span>
            </div>
        `;
        
        // Lägger till dagelementet i listan
        forecastList.appendChild(dayElement);
    });
}

// Ska någon felhantering läggas in här eller gör vi det i en helt separat fil?