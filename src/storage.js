/**
 * Hämtar de 4 senaste sökta städerna.
 * @returns {Array} En array med de senaste sökta städerna (max 4).
 * @author Albrim
 */
export function getRecentSearches() {
    const recent = localStorage.getItem('weatherRecentSearches');
    return recent ? JSON.parse(recent) : [];
}

/**
 * Sparar en stad i senaste sökhistoriken (max 4 städer).
 * @param {string} city - Namnet på staden som söktes.
 * @returns {void}
 * @author Albrim
 */
export function saveRecentSearch(city) {
    let recent = getRecentSearches();
    // Ta bort om staden redan finns (för att flytta den till toppen)
    recent = recent.filter(c => c.toLowerCase() !== city.toLowerCase());
    recent.unshift(city);
    recent = recent.slice(0, 4); // Behåll max 4
    localStorage.setItem('weatherRecentSearches', JSON.stringify(recent));
}

/**
 * Hämtar listan med favoritstäder från webbläsarens lokala lagring.
 * @author Sanel
 * @returns {Array} En array med namnen på favoritstäderna.
 */
export function getFavorites() {
    const favorites = localStorage.getItem('weatherFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

/**
 * Sparar en ny stad i favoritlistan i den lokala lagringen.
 * @author Sanel
 * @param {string} city - Namnet på staden som ska sparas.
 * @return {void}
 */
export function saveFavorite(city) {
    const favorites = getFavorites();
    // Kontroll så det inte blir samma stad två gånger.
    if (!favorites.includes(city)) {
        favorites.push(city);
            localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        }
    }

/**
 * Tar bort stad från favoriter i lokala lagringen.
 * @author Sanel
 * @param {string} city - Namnet på staden som ska tas bort.
 * @returns {void}
 */
export function removeFavorite(city) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav !== city);
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}