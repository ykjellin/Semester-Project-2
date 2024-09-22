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

  if (!authToken || !apiKey) {
    displayError("Please log in to perform the search.");
    return [];
  }

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
      if (response.status === 404) {
        displayError("No auctions found for the given title.");
      } else {
        displayError("Failed to fetch search results. Please try again.");
      }
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      displaySuccess(
        `Found ${data.data.length} auctions for the title "${title}"`
      );
      return data;
    } else {
      displayError("No auctions found matching the search criteria.");
      return { data: [] };
    }
  } catch (error) {
    displayError("Error occurred while fetching search results.");
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
        displayError("Please enter a title to search for.");
      }
    });
  }
}

/**
 * Function to display error messages to the user.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
  }
}

/**
 * Function to display success messages to the user.
 * @param {string} message - The success message to display.
 */
function displaySuccess(message) {
  const successContainer = document.getElementById("success-container");
  if (successContainer) {
    successContainer.textContent = message;
    successContainer.style.display = "block";
  }
}
