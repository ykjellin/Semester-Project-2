import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";

function showFeedback(message, isError = false) {
  const feedbackElement = document.getElementById("auction-feedback");
  if (feedbackElement) {
    feedbackElement.textContent = message;
    feedbackElement.classList.remove("alert-success", "alert-danger");
    feedbackElement.classList.add(isError ? "alert-danger" : "alert-success");
    feedbackElement.style.display = "block"; // Show feedback
  }
}

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
      showFeedback(
        "API key or authentication token is missing, please log in.",
        true
      );
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

    // Show loading message
    const loadingMessage = document.getElementById("loading-message");
    if (loadingMessage) {
      loadingMessage.style.display = "block";
    }

    showFeedback("Auction details loaded successfully.");

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
    if (bidsContainer) {
      if (auctionData.bids && auctionData.bids.length > 0) {
        bidsContainer.innerHTML = "";
        auctionData.bids.forEach((bid) => {
          const bidElement = document.createElement("p");
          bidElement.textContent = `Bidder: ${bid.bidder.name} - Amount: ${bid.amount}`;
          bidsContainer.appendChild(bidElement);
        });
      } else {
        bidsContainer.innerHTML =
          "<p>No bids placed yet. Be the first to bid!</p>";
      }
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

    if (loadingMessage) {
      loadingMessage.style.display = "none";
    }
  } catch (error) {
    console.error("Error loading auction details:", error);

    showFeedback("Failed to load auction details. Please try again.", true);

    const auctionError = document.getElementById("auction-error");
    if (auctionError) {
      auctionError.textContent =
        "We couldn't load the auction details. Please try again later.";
      auctionError.style.display = "block";
    }
  }
}
