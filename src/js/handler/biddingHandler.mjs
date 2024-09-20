import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";

export async function placeBid(auctionId, bidAmount) {
  try {
    const apiKey = getItem("apiKey");
    const authToken = getItem("authToken");

    if (!apiKey || !authToken) {
      console.error("API key or auth token is missing");
      return;
    }

    const numericBidAmount = Number(bidAmount);
    if (isNaN(numericBidAmount) || numericBidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    console.log("Placing bid with amount:", numericBidAmount);

    const response = await fetch(
      `${BASE_URL}/auction/listings/${auctionId}/bids`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          amount: numericBidAmount,
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from API:", errorResponse);
      throw new Error(`Error placing bid: ${response.status}`);
    }

    const bidResult = await response.json();
    console.log("Bid placed successfully:", bidResult);
    alert("Bid placed successfully!");
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("Error placing bid. Please try again.");
  }
}
