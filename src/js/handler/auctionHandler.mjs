export async function loadAuctionDetails(auctionId) {
  try {
    const response = await fetch(`/api/auction/listings/${auctionId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch auction details");
    }

    const auction = await response.json();

    document.getElementById("auction-title").textContent = auction.title;
    document.getElementById("auction-description").textContent =
      auction.description;
    document.getElementById("auction-endsAt").textContent = new Date(
      auction.endsAt
    ).toLocaleString();

    const mediaContainer = document.getElementById("auction-media");
    auction.media.forEach((media) => {
      const img = document.createElement("img");
      img.src = media.url;
      img.alt = media.alt;
      img.classList.add("img-fluid", "mb-3");
      mediaContainer.appendChild(img);
    });
  } catch (error) {
    console.error("Error loading auction details:", error);
    alert("Failed to load auction details.");
  }
}
