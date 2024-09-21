import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";
import { renderAuctions } from "./auctionListHandler.mjs";

export async function searchAuctionsByTitle(title) {
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");

  console.log("Search Title:", title);
  console.log("Auth Token:", authToken);
  console.log("API Key:", apiKey);

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
    console.log("Search Results:", data);
    return data;
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
}

export function initAuctionSearch() {
  const searchBtn = document.getElementById("search-btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      const searchTitle = document.getElementById("search-title").value.trim();

      console.log("Search Button Clicked");
      console.log("Search Title Input:", searchTitle);

      if (searchTitle) {
        const results = await searchAuctionsByTitle(searchTitle);
        console.log("Rendering Auctions:", results); //
        renderAuctions(results.data);
      } else {
        alert("Please enter a title to search for.");
        console.log("No search title entered");
      }
    });
  }
}
