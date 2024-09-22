import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";

/**
 * Function to load auction details.
 * @param {string} auctionId - The ID of the auction to load details for.
 */
export async function loadAuctionDetails(auctionId) {
  try {
    const apiKey = getItem("apiKey");
    const authToken = getItem("authToken");

    if (!apiKey || !authToken) {
      console.error("API key or auth token is missing");
      return;
    }

    const url = `${BASE_URL}/auction/listings/${auctionId}?_bids=true&_seller=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": apiKey,
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching auction details: ${response.statusText}`);
    }

    const auctionDataResponse = await response.json();
    const auctionData = auctionDataResponse.data;

    // Set auction title
    const auctionTitle = document.getElementById("auction-detail-title");
    if (auctionTitle) auctionTitle.textContent = auctionData.title;

    // Set auction description
    const auctionDescription = document.getElementById(
      "auction-detail-description"
    );
    if (auctionDescription)
      auctionDescription.textContent = auctionData.description;

    // Set auction end date
    const auctionEndsAt = document.getElementById("auction-detail-endsAt");
    if (auctionEndsAt)
      auctionEndsAt.textContent = new Date(auctionData.endsAt).toLocaleString();

    // Display number of bids
    const auctionBids = document.getElementById("auction-detail-bids");
    if (
      auctionBids &&
      auctionData._count &&
      auctionData._count.bids !== undefined
    ) {
      auctionBids.textContent = auctionData._count.bids;
    }

    // Display individual bids
    const bidsContainer = document.getElementById("auction-bids-list");
    if (bidsContainer && auctionData.bids && auctionData.bids.length > 0) {
      bidsContainer.innerHTML = "";
      auctionData.bids.forEach((bid) => {
        const bidElement = document.createElement("p");
        bidElement.textContent = `Bidder: ${bid.bidder.name} - Amount: ${bid.amount}`;
        bidsContainer.appendChild(bidElement);
      });
    } else if (bidsContainer) {
      bidsContainer.innerHTML = "<p>No bids placed yet.</p>";
    }

    // Display seller information
    const sellerContainer = document.getElementById("auction-seller");
    if (sellerContainer && auctionData.seller) {
      sellerContainer.innerHTML = `
        <p><strong>Seller Name:</strong> ${auctionData.seller.name}</p>
        <p><strong>Seller Email:</strong> ${auctionData.seller.email}</p>
        <p><strong>Seller Bio:</strong> ${
          auctionData.seller.bio || "No bio available"
        }</p>
        <img src="${auctionData.seller.avatar.url}" alt="${
        auctionData.seller.avatar.alt || "Seller Avatar"
      }" class="img-fluid" />
      `;
    } else if (sellerContainer) {
      sellerContainer.innerHTML = "<p>No seller information available.</p>";
    }

    // Display auction media
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
    } else if (mediaContainer) {
      mediaContainer.innerHTML = "<p>No images available for this auction.</p>";
    }
  } catch (error) {
    console.error("Error loading auction details:", error);
    alert("Failed to load auction details.");
  }
}
