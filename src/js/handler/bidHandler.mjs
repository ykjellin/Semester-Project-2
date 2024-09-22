import { getItem } from "../storage.mjs";
import { BASE_URL } from "../constants.mjs";

/**
 * Function to handle bid submission for a specific auction.
 * @param {string} auctionId - The ID of the auction to place a bid on.
 */
export async function handleBidSubmission(auctionId) {
  const bidForm = document.getElementById("bid-form");
  const bidInput = document.getElementById("bid-amount");
  const errorFeedback = document.querySelector(".invalid-feedback");

  if (!bidForm || !bidInput || !errorFeedback) {
    console.error("Bid form or related elements not found");
    return;
  }

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bidAmount = bidInput.value;

    // Clear previous validation classes
    bidInput.classList.remove("is-invalid", "is-valid");
    errorFeedback.textContent = "";

    // Validate the bid amount
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

      // Disable the submit button to prevent duplicate submissions
      const submitButton = bidForm.querySelector("button[type='submit']");
      submitButton.disabled = true;

      const url = `${BASE_URL}/auction/listings/${auctionId}/bids`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": apiKey,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ amount: parseInt(bidAmount, 10) }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        bidInput.classList.add("is-invalid");
        errorFeedback.textContent =
          errorResponse.message || "Error placing bid.";
        displayError(errorResponse.message || "Error placing bid.");
        throw new Error(`Error placing bid: ${response.statusText}`);
      }

      // On success, add valid class
      bidInput.classList.add("is-valid");
      displaySuccess("Your bid has been placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error.message);
      displayError(`Failed to place bid: ${error.message}`);
    } finally {
      submitButton.disabled = false;
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
