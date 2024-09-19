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
  } catch (error) {
    console.error("Error loading auction details:", error);
  }
}
