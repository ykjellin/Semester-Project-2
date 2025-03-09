import { BASE_URL } from "../constants.mjs";
import { renderAuctions } from "./auctionListHandler.mjs";

/**
 * Function to search auctions by title.
 * @param {string} title - The title to search for.
 * @returns {Promise<object>} - The search results from the API.
 */
export async function searchAuctionsByTitle(title) {
  try {
    const response = await fetch(
      `${BASE_URL}/auction/listings/search?q=${encodeURIComponent(title)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        displayError("No auctions found for the given title.");
      } else {
        displayError("Failed to fetch search results. Please try again.");
      }
      throw new Error(`Error fetching search results: ${response.status}`);
    }

    const data = await response.json();
    return data?.data ? data : { data: [] }; // ✅ Ensures `data` is always an object with `data: []`
  } catch (error) {
    displayError("Error occurred while fetching search results.");
    console.error("Error fetching auctions:", error);
    return { data: [] }; // ✅ Prevents undefined errors
  }
}

/**
 * Function to initialize the auction search event listener.
 */
export function initAuctionSearch() {
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-title");

  if (!searchBtn || !searchInput) {
    console.error("Search elements not found.");
    return;
  }

  searchBtn.addEventListener("click", async () => {
    const searchTitle = searchInput.value.trim();
    if (!searchTitle) {
      displayError("Please enter a title to search for.");
      return;
    }

    console.log(`Searching for auctions with title: "${searchTitle}"`);
    const results = await searchAuctionsByTitle(searchTitle);

    // ✅ Ensure `results.data` exists before passing it to `renderAuctions()`
    if (Array.isArray(results.data)) {
      renderAuctions(results.data);
    } else {
      displayError("No valid auctions found.");
    }
  });
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
