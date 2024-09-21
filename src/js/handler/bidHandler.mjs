import { getItem } from "../storage.mjs";
import { BASE_URL } from "../constants.mjs";

export async function handleBidSubmission(auctionId) {
  const bidForm = document.getElementById("bid-form");

  if (!bidForm) {
    console.error("Bid form not found");
    return;
  }

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bidAmount = document.getElementById("bid-amount").value;
    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      const apiKey = getItem("apiKey");
      const authToken = getItem("authToken");

      if (!apiKey || !authToken) {
        console.error("API key or auth token is missing");
        return;
      }

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
        console.error("Error response from API:", errorResponse);
        console.error(
          "Detailed error message:",
          errorResponse.errors[0].message
        );
        throw new Error(`Error placing bid: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Bid placed successfully:", result);
      alert("Your bid has been placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error.message);
      alert(`Failed to place bid: ${error.message}`);
    }
  });
}
