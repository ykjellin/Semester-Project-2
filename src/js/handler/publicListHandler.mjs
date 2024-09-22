import { BASE_URL } from "../constants.mjs";

/**
 * Function to load a list of public auctions.
 * @param {number} [limit=6] - The number of auctions to display per page.
 * @param {number} [page=1] - The current page to load auctions from.
 */
export async function loadPublicAuctionsList(limit = 6, page = 1) {
  const sort = document.getElementById("sort")
    ? document.getElementById("sort").value
    : "";
  const sortOrder = document.getElementById("sortOrder")
    ? document.getElementById("sortOrder").value
    : "asc";

  const filters = {
    sort: sort || undefined,
    sortOrder,
    limit,
    page,
  };

  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([key, value]) => value !== undefined && value !== ""
    )
  );

  try {
    const queryParams = new URLSearchParams(cleanedFilters).toString();
    const url = queryParams
      ? `${BASE_URL}/auction/listings?${queryParams}`
      : `${BASE_URL}/auction/listings`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching auctions: ${response.status}`);
    }

    const auctionData = await response.json();
    renderHomepageAuctions(auctionData.data);
  } catch (error) {
    console.error("Fetch Auctions Error: ", error);
  }
}

/**
 * Function to initialize the homepage auction search.
 */
export function initHomepageAuctionSearch() {
  const searchBtn = document.getElementById("homepage-search-btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      const searchTitle = document
        .getElementById("homepage-search-title")
        .value.trim();

      if (searchTitle) {
        const results = await searchAuctionsByTitlePublic(searchTitle);
        renderHomepageAuctions(results.data);
      } else {
        alert("Please enter a title to search for.");
      }
    });
  }
}

/**
 * Function to search public auctions by title.
 * @param {string} title - The title to search for.
 * @returns {Promise<object>} - The search results from the API.
 */
export async function searchAuctionsByTitlePublic(title) {
  const queryUrl = `${BASE_URL}/auction/listings/search?q=${encodeURIComponent(
    title
  )}`;

  try {
    const response = await fetch(queryUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
 * Function to render auctions on the homepage.
 * @param {Array} auctions - An array of auction objects to display.
 */
export function renderHomepageAuctions(auctions) {
  const auctionlistContainer = document.getElementById("homepage-auction-list");
  const template = document.getElementById("homepage-auction-card-template");

  if (!auctionlistContainer) {
    console.error("Homepage auction list container not found");
    return;
  }

  if (!template) {
    console.error("Homepage auction card template not found");
    return;
  }

  auctionlistContainer.innerHTML = "";

  auctions.forEach((auction) => {
    const auctionCard = document.importNode(template.content, true);

    auctionCard.querySelector("#homepage-auction-list-title").textContent =
      auction.title;
    auctionCard.querySelector(
      "#homepage-auction-list-description"
    ).textContent = auction.description;

    const auctionImg = auctionCard.querySelector("#homepage-auction-list-img");
    if (auction.media && auction.media.length > 0) {
      auctionImg.src = auction.media[0].url;
      auctionImg.alt = auction.media[0].alt || "Auction Image";
    } else {
      auctionImg.src = "https://picsum.photos/150/100?random=6";
    }

    const viewauctionBtn = auctionCard.querySelector(
      "#homepage-auction-list-view"
    );
    viewauctionBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const auctionId = auction.id;
      window.location.href = `/viewauction/index.html?auctionId=${auctionId}`;
    });

    auctionlistContainer.appendChild(auctionCard);
  });
}
