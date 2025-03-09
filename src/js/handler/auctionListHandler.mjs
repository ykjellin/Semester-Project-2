import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";

if (document.getElementById("auction-list")) {
  loadAuctionsList();
}

let currentPage = 1;

/**
 * Function to load a list of auctions.
 * @param {number} [page=1] - The current page to load auctions from.
 */
export async function loadAuctionsList(page = 1) {
  const sort = document.getElementById("sort")?.value || "";
  const sortOrder = document.getElementById("sortOrder")?.value || "";

  const _seller = document.getElementById("_seller")?.checked;
  const _bids = document.getElementById("_bids")?.checked;
  const _active = document.getElementById("_active")?.checked;
  const _tag = document.getElementById("tag")?.value || "";

  const filters = {
    sort: sort || undefined,
    sortOrder,
    page,
    _seller,
    _bids,
    _active,
    _tag: _tag || undefined,
  };

  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  );

  try {
    const apiKey = getItem("apiKey");
    const authToken = getItem("authToken");

    const headers = { "Content-Type": "application/json" };

    if (apiKey && authToken) {
      headers["X-Noroff-API-Key"] = apiKey;
      headers.Authorization = `Bearer ${authToken}`;
    }

    const queryParams = new URLSearchParams(cleanedFilters).toString();
    const url = queryParams
      ? `${BASE_URL}/auction/listings?${queryParams}`
      : `${BASE_URL}/auction/listings`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorMessages = {
        401: "Unauthorized access. Please log in to bid.",
        404: "No auctions found.",
      };
      displayError(
        errorMessages[response.status] ||
          `Error fetching auctions: ${response.status}`
      );
      throw new Error(`Error fetching auctions: ${response.status}`);
    }

    const auctionData = await response.json();
    renderAuctions(auctionData?.data ?? []);
  } catch (error) {
    displayError("Failed to load auctions. Please try again later.");
    console.error("Fetch Auctions Error:", error);
  }
}

/**
 * Function to render the auctions on the page.
 * @param {Array} auctions - An array of auction objects to display.
 */
export function renderAuctions(auctions) {
  if (!Array.isArray(auctions)) {
    console.error("renderAuctions received invalid data:", auctions);
    displayError("Error displaying auctions.");
    return;
  }

  const auctionlistContainer = document.getElementById("auction-list");
  const template = document.getElementById("auction-card-template");

  if (!auctionlistContainer || !template) {
    displayError("Missing auction list container or template.");
    console.error("Auction list container or template not found");
    return;
  }

  auctionlistContainer.innerHTML =
    auctions.length === 0 ? "<p>No auctions available at the moment.</p>" : "";

  auctions.forEach((auction) => {
    const auctionCard = document.importNode(template.content, true);

    auctionCard.querySelector("#auction-list-title").textContent =
      auction.title;
    auctionCard.querySelector("#auction-list-description").textContent =
      auction.description;

    const auctionImg = auctionCard.querySelector("#auction-list-img");
    if (auction.media && auction.media.length > 0) {
      auctionImg.src = auction.media[0].url;
      auctionImg.alt = auction.media[0].alt || "Auction Image";
    } else {
      auctionImg.src = "https://picsum.photos/150/100?random=6";
    }

    const viewauctionBtn = auctionCard.querySelector(".auction-list-view");
    if (viewauctionBtn) {
      viewauctionBtn.addEventListener("click", () => {
        const auctionId = auction.id;
        window.location.href = `/viewauction/index.html?auctionId=${auctionId}`;
      });
    } else {
      console.error("View Auction button not found inside auction card.");
    }

    auctionlistContainer.appendChild(auctionCard);
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
