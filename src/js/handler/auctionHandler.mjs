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

    const mediaContainer = document.getElementById("auction-media");
    mediaContainer.innerHTML = "";
    auction.data.media.forEach((media) => {
      const img = document.createElement("img");
      img.src = media.url;
      img.alt = media.alt || "Auction Image";
      img.classList.add("img-fluid", "mb-3");
      mediaContainer.appendChild(img);
    });

    const tagsContainer = document.getElementById("auction-tags");
    tagsContainer.innerHTML = "";
    auction.data.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.classList.add("badge", "bg-secondary", "me-2");
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });

    const bidsContainer = document.getElementById("auction-bids");
    bidsContainer.innerHTML = "";
    auction.data.bids.forEach((bid) => {
      const bidElement = document.createElement("div");
      bidElement.textContent = `Bidder: ${bid.bidder.name}, Amount: ${bid.amount}`;
      bidsContainer.appendChild(bidElement);
    });

    const sellerInfo = auction.data.seller;
    document.getElementById("seller-name").textContent = sellerInfo.name;
    document.getElementById("seller-email").textContent = sellerInfo.email;
  } catch (error) {
    console.error("Error loading auction details:", error);
  }
}
