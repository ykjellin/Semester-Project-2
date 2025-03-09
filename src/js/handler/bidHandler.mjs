import { getItem } from "../storage.mjs";
import { BASE_URL } from "../constants.mjs";

/**
 * Function to handle bid submission for an auction.
 * @param {string} auctionId - The ID of the auction to place a bid on.
 */
export async function handleBidSubmission(auctionId) {
  const bidForm = document.getElementById("bid-form");
  const bidInput = document.getElementById("bid-amount");
  const errorFeedback = document.querySelector(".invalid-feedback");

  if (!bidForm || !bidInput || !errorFeedback) {
    console.error("Bid form or related elements not found.");
    return;
  }

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bidAmount = parseFloat(bidInput.value.trim());

    bidInput.classList.remove("is-invalid", "is-valid");
    errorFeedback.textContent = "";

    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      bidInput.classList.add("is-invalid");
      errorFeedback.textContent =
        "Please enter a valid bid amount greater than 0.";
      return;
    }

    try {
      const apiKey = getItem("apiKey");
      const authToken = getItem("authToken");

      if (!apiKey || !authToken) {
        displayError("Authentication error. Please log in to place a bid.");
        return;
      }

      const submitButton = bidForm.querySelector("button[type='submit']");
      if (submitButton) submitButton.disabled = true;

      const auctionDetailsResponse = await fetch(
        `${BASE_URL}/auction/listings/${auctionId}?_bids=true&_seller=true`,
        {
          method: "GET",
          headers: {
            "X-Noroff-API-Key": apiKey,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!auctionDetailsResponse.ok) {
        displayError("Could not verify auction status. Try again later.");
        throw new Error("Failed to fetch auction details.");
      }

      const auctionData = await auctionDetailsResponse.json();
      const auction = auctionData.data;

      if (!auction || new Date(auction.endsAt) < new Date()) {
        displayError("Bidding is closed for this auction.");
        throw new Error("Bidding is closed for this auction.");
      }

      const currentHighestBid =
        auction.bids.length > 0
          ? Math.max(...auction.bids.map((bid) => bid.amount))
          : 0;

      if (bidAmount <= currentHighestBid) {
        bidInput.classList.add("is-invalid");
        errorFeedback.textContent = `Your bid must be higher than the current highest bid: ${currentHighestBid}`;
        if (submitButton) submitButton.disabled = false;
        return;
      }

      const bidResponse = await fetch(
        `${BASE_URL}/auction/listings/${auctionId}/bids`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Noroff-API-Key": apiKey,
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ amount: bidAmount }),
        }
      );

      if (!bidResponse.ok) {
        const errorResponse = await bidResponse.json();
        displayError(errorResponse.message || "Error placing bid.");
        throw new Error(`Error placing bid: ${errorResponse.message}`);
      }

      bidInput.classList.add("is-valid");
      bidInput.value = "";
      displaySuccess("Your bid has been placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error.message);
      displayError(`Failed to place bid: ${error.message}`);
    } finally {
      if (submitButton) submitButton.disabled = false;
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
