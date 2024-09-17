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

  console.log("Username:", username);
  console.log("Auth Token:", authToken);
  console.log("API Key:", apiKey);

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

    console.log("API Response Status:", response.status);
    console.log("API Response Headers:", response.headers);

    if (!response.ok) {
      throw new Error(`Failed to fetch profile for ${username}`);
    }

    const profile = await response.json();
    console.log("Full profile data from API:", profile);

    const defaultAvatar = "https://picsum.photos/80/80/?blur=5";
    const defaultBanner = "https://picsum.photos/300/80/?blur=5";

    const avatarUrl = profile.data?.avatar?.url || defaultAvatar;
    const bannerUrl = profile.data?.banner?.url || defaultBanner;

    console.log("Avatar URL:", avatarUrl);
    console.log("Banner URL:", bannerUrl);

    document.getElementById("avatar").src = avatarUrl;
    document.getElementById("name").textContent =
      profile.data?.name || "No name available";
    document.getElementById("email").textContent =
      profile.data?.email || "No email available";
    document.getElementById("bio").textContent =
      profile.data?.bio || "No bio available";
    document.getElementById("credits").textContent =
      profile.data?.credits || "N/A";
    document.getElementById("banner").src = bannerUrl;

    await loadListings(username, authToken, apiKey);
    await loadWins(username, authToken, apiKey);
    new bootstrap.Carousel(document.getElementById("listingsCarousel"));
    new bootstrap.Carousel(document.getElementById("winsCarousel"));
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
    // Placeholder data
    listings = [
      {
        title: "Sample Listing 1",
        description:
          "This is a placeholder listing to show how items will appear.",
        media: ["https://picsum.photos/150/100?random=1"],
      },
      {
        title: "Sample Listing 2",
        description: "Another placeholder listing with different content.",
        media: ["https://picsum.photos/150/100?random=2"],
      },
      {
        title: "Sample Listing 3",
        description: "A third placeholder listing for demonstration.",
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
          }" alt="${listing.title}"/>
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description}</p>
          </div>
        </div>
    `;
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
    // Placeholder data
    wins = [
      {
        title: "Sample Win 1",
        description: "This is a placeholder win to show how items will appear.",
        media: ["https://picsum.photos/150/100?random=4"],
      },
      {
        title: "Sample Win 2",
        description: "Another placeholder win with different content.",
        media: ["https://picsum.photos/150/100?random=5"],
      },
      {
        title: "Sample Win 3",
        description: "A third placeholder win for demonstration.",
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
          }" alt="${win.title}"/>
          <div class="card-body">
            <h5 class="card-title">${win.title}</h5>
            <p class="card-text">${win.description}</p>
          </div>
        </div>
      `;
      rowElement.appendChild(colElement);
    });

    slideElement.appendChild(rowElement);
    winsContainer.appendChild(slideElement);
  }
}
