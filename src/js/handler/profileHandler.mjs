import { getItem } from "../storage.mjs";

let profileLoaded = false;

/**
 * Function to load the user profile from the API and populate the page with profile data.
 */
export async function loadProfile() {
  if (profileLoaded) {
    return;
  }

  const username = getItem("username");
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");

  if (!username || !authToken || !apiKey) {
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch profile for ${username}`);
    }

    const profile = await response.json();

    document.getElementById("avatar").src =
      profile.data?.avatar?.url || "default_avatar_url";
    document.getElementById("name").textContent =
      profile.data?.name || "No name available";
    document.getElementById("email").textContent =
      profile.data?.email || "No email available";
    document.getElementById("bio").textContent =
      profile.data?.bio || "No bio available";
    document.getElementById("credits").textContent =
      profile.data?.credits || "N/A";
    document.getElementById("banner").src =
      profile.data?.banner?.url || "default_banner_url";

    await loadListings(username, authToken, apiKey);
    await loadWins(username, authToken, apiKey);

    new bootstrap.Carousel(document.getElementById("listingsCarousel"));
    new bootstrap.Carousel(document.getElementById("winsCarousel"));

    addEditProfileListener();

    profileLoaded = true;
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

/**
 * Function to load user listings from the API and populate the listings section.
 * @param {string} username - The username for which to load listings.
 * @param {string} authToken - The user's authentication token.
 * @param {string} apiKey - The API key for the request.
 */
async function loadListings(username, authToken, apiKey) {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${username}/listings`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch listings for ${username}`);
    }

    const listings = await response.json();
    populateListings(listings.data);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

/**
 * Function to populate the listings section with auction cards.
 * @param {Array} listings - The list of auction listings to display.
 */
function populateListings(listings) {
  const listingsContainer = document.getElementById("listings");
  listingsContainer.innerHTML = "";

  if (!listings || listings.length === 0) {
    listings = [
      {
        title: "Sample Listing 1",
        description: "This is a placeholder listing.",
        media: ["https://picsum.photos/150/100?random=1"],
      },
      {
        title: "Sample Listing 2",
        description: "Another placeholder listing.",
        media: ["https://picsum.photos/150/100?random=2"],
      },
      {
        title: "Sample Listing 3",
        description: "A third placeholder listing.",
        media: ["https://picsum.photos/150/100?random=3"],
      },
    ];
  }

  const itemsPerSlide = 3;
  for (let i = 0; i < listings.length; i += itemsPerSlide) {
    const slideListings = listings.slice(i, i + itemsPerSlide);
    const slideElement = document.createElement("div");
    slideElement.className = `carousel-item${i === 0 ? " active" : ""}`;

    const rowElement = document.createElement("div");
    rowElement.className = "row";

    slideListings.forEach((listing) => {
      const colElement = document.createElement("div");
      colElement.className = "col-md-4";
      colElement.innerHTML = `
        <div class="card listing-card">
          <img class="card-img-top" src="${
            listing.media[0] || "https://picsum.photos/150/100?placeholder"
          }" alt="${listing.title}" />
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description}</p>
          </div>
        </div>`;
      rowElement.appendChild(colElement);
    });
    slideElement.appendChild(rowElement);
    listingsContainer.appendChild(slideElement);
  }
}

/**
 * Function to load user wins from the API and populate the wins section.
 * @param {string} username - The username for which to load wins.
 * @param {string} authToken - The user's authentication token.
 * @param {string} apiKey - The API key for the request.
 */
async function loadWins(username, authToken, apiKey) {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${username}/wins`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch wins for ${username}`);
    }

    const wins = await response.json();
    populateWins(wins.data);
  } catch (error) {
    console.error("Error fetching wins:", error);
  }
}

/**
 * Function to populate the wins section with auction cards.
 * @param {Array} wins - The list of auction wins to display.
 */
function populateWins(wins) {
  const winsContainer = document.getElementById("wins");
  winsContainer.innerHTML = "";

  const itemsPerSlide = 3;
  for (let i = 0; i < wins.length; i += itemsPerSlide) {
    const slideWins = wins.slice(i, i + itemsPerSlide);
    const slideElement = document.createElement("div");
    slideElement.className = `carousel-item${i === 0 ? " active" : ""}`;

    const rowElement = document.createElement("div");
    rowElement.className = "row";

    slideWins.forEach((win) => {
      const colElement = document.createElement("div");
      colElement.className = "col-md-4";
      colElement.innerHTML = `
        <div class="card win-card">
          <img class="card-img-top" src="${
            win.media[0] || "https://picsum.photos/150/100?placeholder"
          }" alt="${win.title}" />
          <div class="card-body">
            <h5 class="card-title">${win.title}</h5>
            <p class="card-text">${win.description}</p>
          </div>
        </div>`;
      rowElement.appendChild(colElement);
    });

    slideElement.appendChild(rowElement);
    winsContainer.appendChild(slideElement);
  }
}

/**
 * Function to add the listener for editing profile details.
 */
function addEditProfileListener() {
  const editButton = document.getElementById("edit-profile-btn");
  if (editButton) {
    editButton.addEventListener("click", loadEditProfileForm);
  }
}

/**
 * Function to load the profile editing form and prefill it with current profile data.
 */
function loadEditProfileForm() {
  const profileContainer = document.getElementById("profile-page");
  const name = document.getElementById("name").textContent;
  const email = document.getElementById("email").textContent;
  const bio = document.getElementById("bio").textContent;
  const avatar = document.getElementById("avatar").src;
  const banner = document.getElementById("banner").src;

  profileContainer.innerHTML = `
    <h3>${name}</h3>
    <p>Email: ${email}</p>
    <form id="edit-profile-form">
      <div class="mb-3">
        <label for="edit-avatar" class="form-label">Avatar URL</label>
        <input type="url" class="form-control" id="edit-avatar" value="${avatar}">
      </div>
      <div class="mb-3">
        <label for="edit-banner" class="form-label">Banner URL</label>
        <input type="url" class="form-control" id="edit-banner" value="${banner}">
      </div>
      <div class="mb-3">
        <label for="edit-bio" class="form-label">Bio</label>
        <textarea class="form-control" id="edit-bio">${bio}</textarea>
      </div>
      <button type="submit" class="btn ">Save Changes</button>
      <button id="cancel-edit" class="btn ">Cancel</button>
    </form>
    <div id="formFeedback" class="alert d-none"></div>
  `;

  document
    .getElementById("edit-profile-form")
    .addEventListener("submit", handleEditProfileSubmit);
  document
    .getElementById("cancel-edit")
    .addEventListener("click", reloadProfileView);
}
function navigateToProfile() {
  window.location.href = "/profile/index.html";
}
/**
 * Function to handle the profile editing form submission and send updated data to the API.
 * @param {Event} event - The form submission event.
 */
async function handleEditProfileSubmit(event) {
  event.preventDefault();

  const updatedAvatarUrl = document.getElementById("edit-avatar").value;
  const updatedBannerUrl = document.getElementById("edit-banner").value;
  const updatedBio = document.getElementById("edit-bio").value;

  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");
  const username = getItem("username");

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${username}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: {
            url: updatedAvatarUrl,
            alt: "",
          },
          banner: {
            url: updatedBannerUrl,
            alt: "",
          },
          bio: updatedBio,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update profile", errorData);
      alert("Failed to update profile: " + errorData.message);
    } else {
      navigateToProfile();
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while updating the profile.");
  }
}

/**
 * Function to reload the profile view after editing or canceling the edit.
 */
function reloadProfileView() {
  profileLoaded = false;
  loadProfile();
}
