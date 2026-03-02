const STORAGE_KEY = "recentCities";
const MAX_CITIES = 4;

/**
 * Sparar en stad i sökhistoriken
 * @param {string} city - Stadens namn */
export function saveCity(city) {
    const cities = getRecentCities();

    // Ta bort staden om den redan finns
    const filtered = cities.filter(c => c.toLowerCase() !== city.toLowerCase());

    // Lägg till staden först i listan
    filtered.unshift(city);

    // Behåll bara de 4 senaste
    const trimmed = filtered.slice(0, MAX_CITIES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/**
 * Hämtar de senaste sökningarna
 * @returns {string[]} - Array med stadsnamn */
export function getRecentCities() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}