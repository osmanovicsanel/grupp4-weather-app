import { handleSearch } from "./utils.js";

// Lyssna på Enter-knapptryck - Alvina
document.querySelector(".search-bar").addEventListener("keydown", async(event) => {
    if (event.key === "Enter") {
        await handleSearch();
    }
});