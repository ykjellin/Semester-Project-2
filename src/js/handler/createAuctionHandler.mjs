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

      try {
        const response = await fetch("/auction/listings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getItem("authToken")}`,
          },
          body: JSON.stringify(auctionData),
        });

        if (response.ok) {
          const result = await response.json();
          alert("Auction created successfully!");
          window.location.href = "/auctions";
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error creating auction:", error);
        alert("Failed to create auction. Please try again.");
      }
    });
  }
}
