import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";

export function initcreateauctionForm() {
  const createauctionForm = document.getElementById("create-auction-form");

  if (createauctionForm) {
    createauctionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(createauctionForm);
      const auctionData = {
        title: formData.get("title"),
        description: formData.get("description"),
        endsAt: new Date(formData.get("endsAt")).toISOString(),
        tags: formData
          .get("tags")
          .split(",")
          .map((tag) => tag.trim()),
        media: formData.get("media")
          ? [{ url: formData.get("media"), alt: "" }]
          : [],
      };

      const authToken = getItem("authToken");
      const apiKey = getItem("apiKey");
      console.log("Auth Token:", authToken);
      console.log("API Key:", apiKey);

      try {
        const response = await fetch(`${BASE_URL}/auction/listings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Noroff-API-Key": apiKey,
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(auctionData),
        });
        console.log("Auction data being sent:", auctionData);

        if (response.ok) {
          const result = await response.json();
          alert("Auction created successfully!");
          console.log("Auction creation response:", result);
          window.location.href = "/auctions";
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
          console.error("Auction creation failed:", errorData);
        }
      } catch (error) {
        console.error("Error creating auction:", error);
        alert("Failed to create auction. Please try again.");
      }
    });
  }
}
