import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";
import { renderAuctions } from "./auctionListHandler.mjs";

/**
 * Function to search auctions by title.
 * @param {string} title - The title to search for.
 * @returns {Promise<object>} - The search results from the API.
 */
export async function searchAuctionsByTitle(title) {
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");

  try {
    const response = await fetch(
      `${BASE_URL}/auction/listings/search?q=${encodeURIComponent(title)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
}

/**
 * Function to initialize the auction search event listener.
 */
export function initAuctionSearch() {
  const searchBtn = document.getElementById("search-btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      const searchTitle = document.getElementById("search-title").value.trim();

      if (searchTitle) {
        const results = await searchAuctionsByTitle(searchTitle);
        renderAuctions(results.data);
      } else {
        alert("Please enter a title to search for.");
      }
    });
  }
}
