import { getItem } from "../storage.mjs";

let profileLoaded = false;

export async function loadProfile() {
  if (profileLoaded) {
    console.log("Profile already loaded. Skipping.");
    return;
  }

  const username = getItem("username");
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");

  if (!username || !authToken || !apiKey) {
    console.log(
      "User is not logged in or missing API key. Skipping profile loading."
    );
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

function populateWins(wins) {
  const winsContainer = document.getElementById("wins");
  winsContainer.innerHTML = "";

  if (!wins || wins.length === 0) {
    wins = [
      {
        title: "Sample Win 1",
        description: "This is a placeholder win.",
        media: ["https://picsum.photos/150/100?random=4"],
      },
      {
        title: "Sample Win 2",
        description: "Another placeholder win.",
        media: ["https://picsum.photos/150/100?random=5"],
      },
      {
        title: "Sample Win 3",
        description: "A third placeholder win.",
        media: ["https://picsum.photos/150/100?random=6"],
      },
    ];
  }

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

function addEditProfileListener() {
  const editButton = document.getElementById("edit-profile-btn");
  if (editButton) {
    editButton.addEventListener("click", loadEditProfileForm);
  }
}

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
      <!-- Editable Avatar URL -->
      <div class="mb-3">
        <label for="edit-avatar" class="form-label">Avatar URL</label>
        <input type="url" class="form-control" id="edit-avatar" value="${avatar}">
      </div>
      <!-- Editable Banner URL -->
      <div class="mb-3">
        <label for="edit-banner" class="form-label">Banner URL</label>
        <input type="url" class="form-control" id="edit-banner" value="${banner}">
      </div>
      <!-- Editable Bio -->
      <div class="mb-3">
        <label for="edit-bio" class="form-label">Bio</label>
        <textarea class="form-control" id="edit-bio">${bio}</textarea>
      </div>
      <!-- Save and Cancel buttons -->
      <button type="submit" class="btn btn-success">Save Changes</button>
      <button id="cancel-edit" class="btn btn-secondary">Cancel</button>
    </form>
  `;

  document
    .getElementById("edit-profile-form")
    .addEventListener("submit", handleEditProfileSubmit);
  document
    .getElementById("cancel-edit")
    .addEventListener("click", reloadProfileView);
}

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
      console.log("Profile updated successfully.");
      navigateToProfile();
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while updating the profile.");
  }
}

function reloadProfileView() {
  profileLoaded = false;
  loadProfile();
}
