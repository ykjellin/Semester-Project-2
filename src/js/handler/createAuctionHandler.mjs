import { BASE_URL } from "../constants.mjs";
import { getItem } from "../storage.mjs";

/**
 * Function to initialize the create auction form submission.
 * Handles the creation of a new auction by sending the form data to the API.
 */
export function initcreateauctionForm() {
  const createauctionForm = document.getElementById("create-auction-form");

  if (createauctionForm) {
    createauctionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(createauctionForm);
      const title = formData.get("title").trim();
      const endsAt = formData.get("endsAt");
      const description = formData.get("description")?.trim(); // Optional
      const media = formData.get("media")?.trim(); // Optional
      const tags = formData.get("tags")
        ? formData
            .get("tags")
            .split(",")
            .map((tag) => tag.trim())
        : []; // Optional

      // Basic validation for required fields
      if (!title || !endsAt || isNaN(new Date(endsAt).getTime())) {
        displayError(
          "Please fill in the required fields: Title and End Date/Time."
        );
        return;
      }

      const auctionData = {
        title,
        endsAt: new Date(endsAt).toISOString(),
        description, // Optional
        tags, // Optional
        media: media ? [{ url: media, alt: "" }] : [], // Optional
      };

      const authToken = getItem("authToken");
      const apiKey = getItem("apiKey");

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

        if (response.ok) {
          const result = await response.json();
          displaySuccess("Auction created successfully!");
          window.location.href = "/auctionList/index.html"; // Update the redirect path as needed
        } else {
          const errorData = await response.json();
          displayError(`Error: ${errorData.message}`);
          console.error("Auction creation failed:", errorData);
        }
      } catch (error) {
        console.error("Error creating auction:", error);
        displayError("Failed to create auction. Please try again.");
      }
    });
  }
}

/**
 * Function to display error messages to the user using a Bootstrap alert.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
  const feedbackContainer = document.getElementById("formFeedback");
  feedbackContainer.classList.remove("d-none", "alert-success");
  feedbackContainer.classList.add("alert-danger");
  feedbackContainer.textContent = message;
}

/**
 * Function to display success messages to the user using a Bootstrap alert.
 * @param {string} message - The success message to display.
 */
function displaySuccess(message) {
  const feedbackContainer = document.getElementById("formFeedback");
  feedbackContainer.classList.remove("d-none", "alert-danger");
  feedbackContainer.classList.add("alert-success");
  feedbackContainer.textContent = message;
}
