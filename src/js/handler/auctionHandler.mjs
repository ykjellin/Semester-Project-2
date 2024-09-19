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

    document.getElementById("auction-title").textContent = auction.data.title;
    document.getElementById("auction-description").textContent =
      auction.data.description;
    document.getElementById("auction-endsAt").textContent = new Date(
      auction.data.endsAt
    ).toLocaleString();
  } catch (error) {
    console.error("Error loading auction details:", error);
  }
}
