import { BASE_URL } from "./constants.mjs";
import { getItem } from "./storage.mjs";
import { placeBid } from "./biddingHandler.mjs";

export async function loadAuctionDetails(auctionId) {
  try {
    const response = await fetch(`${BASE_URL}/auction/listings/${auctionId}`, {
      headers: {
        Authorization: `Bearer ${getItem("authToken")}`,
        "X-Noroff-API-Key": getItem("apiKey"),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch auction details");
    }

    const auction = await response.json();
    console.log("Auction data:", auction);

    document.getElementById("auction-title").textContent =
      auction.data.title || "No title available";
    document.getElementById("auction-description").textContent =
      auction.data.description || "No description available";
    document.getElementById("auction-endsAt").textContent = new Date(
      auction.data.endsAt
    ).toLocaleString();

    const mediaContainer = document.getElementById("auction-media");
    mediaContainer.innerHTML = "";

    if (auction.data.media && auction.data.media.length > 0) {
      auction.data.media.forEach((media) => {
        const img = document.createElement("img");
        img.src = media.url;
        img.alt = media.alt || "Auction Image";
        img.classList.add("img-fluid", "mb-3");
        mediaContainer.appendChild(img);
      });
    } else {
      mediaContainer.innerHTML = "<p>No media available</p>";
    }

    const tagsContainer = document.getElementById("auction-tags");
    tagsContainer.innerHTML = "";

    if (auction.data.tags && auction.data.tags.length > 0) {
      auction.data.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.classList.add("badge", "bg-secondary", "me-2");
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    } else {
      tagsContainer.innerHTML = "<p>No tags available</p>";
    }

    const bidCount = auction.data._count.bids || 0;
    const bidsContainer = document.getElementById("auction-bids");
    bidsContainer.innerHTML = `<p>Number of bids: ${bidCount}</p>`;

    document.getElementById("seller-name").textContent =
      "Seller information not available";
    document.getElementById("seller-email").textContent = "Email not available";

    const bidForm = document.getElementById("bid-form");
    if (bidForm) {
      bidForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const bidAmount = document.getElementById("bid-amount").value;
        if (bidAmount) {
          placeBid(auctionId, bidAmount);
        } else {
          alert("Please enter a valid bid amount.");
        }
      });
    }
  } catch (error) {
    console.error("Error loading auction details:", error);
  }
}
