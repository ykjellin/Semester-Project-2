import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";

export async function loadAuctionDetails(auctionId) {
  try {
    const apiKey = getItem("apiKey");
    const authToken = getItem("authToken");

    if (!apiKey || !authToken) {
      console.error("API key or auth token is missing");
      return;
    }

    const url = `${BASE_URL}/auction/listings/${auctionId}`;
    console.log(`Fetching auction details from: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": apiKey,
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log(`API Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Error fetching auction details: ${response.statusText}`);
    }

    const auctionDataResponse = await response.json();
    const auctionData = auctionDataResponse.data;
    console.log("Auction Data:", auctionData);

    const auctionTitle = document.getElementById("auction-detail-title");
    if (auctionTitle) auctionTitle.textContent = auctionData.title;

    const auctionDescription = document.getElementById(
      "auction-detail-description"
    );
    if (auctionDescription)
      auctionDescription.textContent = auctionData.description;

    const auctionEndsAt = document.getElementById("auction-detail-endsAt");
    if (auctionEndsAt)
      auctionEndsAt.textContent = new Date(auctionData.endsAt).toLocaleString();

    const auctionBids = document.getElementById("auction-detail-bids");
    if (
      auctionBids &&
      auctionData._count &&
      auctionData._count.bids !== undefined
    ) {
      auctionBids.textContent = auctionData._count.bids;
    }

    const mediaContainer = document.getElementById("auction-detail-media");
    if (mediaContainer && auctionData.media && auctionData.media.length > 0) {
      mediaContainer.innerHTML = "";
      auctionData.media.forEach((media) => {
        const img = document.createElement("img");
        img.src = media.url || "https://via.placeholder.com/150";
        img.alt = media.alt || "Auction Image";
        img.classList.add("img-fluid", "mb-3");
        mediaContainer.appendChild(img);
      });
    } else {
      console.log("No media available for this auction.");
      mediaContainer.innerHTML = "<p>No images available for this auction.</p>";
    }
  } catch (error) {
    console.error("Error loading auction details:", error);
    alert("Failed to load auction details.");
  }
}
