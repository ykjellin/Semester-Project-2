import { getItem } from "../storage.mjs";

export async function loadProfile() {
  const username = getItem("username");
  const authToken = getItem("authToken");

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch profile for ${username}`);
    }

    const profile = await response.json();
    console.log("Profile data:", profile);

    document.getElementById("avatar").src = profile.avatar.url || "";
    document.getElementById("name").textContent = profile.name;
    document.getElementById("email").textContent = profile.email;
    document.getElementById("bio").textContent =
      profile.bio || "No bio available";
    document.getElementById("credits").textContent = profile.credits;
    document.getElementById("banner").src = profile.banner.url || "";

    await loadListings(username, authToken);

    await loadWins(username, authToken);
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

async function loadListings(username, authToken) {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${username}/listings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch listings for ${username}`);
    }

    const listings = await response.json();
    populateListings(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

async function loadWins(username, authToken) {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${username}/wins`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch wins for ${username}`);
    }

    const wins = await response.json();
    populateWins(wins);
  } catch (error) {
    console.error("Error fetching wins:", error);
  }
}

function populateListings(listings) {
  const listingsContainer = document.getElementById("listings");
  const listingTemplate = listingsContainer.querySelector(".listing");

  listings.forEach((listing) => {
    const newListing = listingTemplate.cloneNode(true);
    newListing.querySelector("#listing-img").src = listing.media[0]?.url || "";
    newListing.querySelector("#listing-img").alt = listing.media[0]?.alt || "";
    newListing.querySelector("#listing-title").textContent = listing.title;
    newListing.querySelector("#listing-description").textContent =
      listing.description;
    listingsContainer.appendChild(newListing);
  });

  listingTemplate.remove();
}

function populateWins(wins) {
  const winsContainer = document.getElementById("wins");
  const winTemplate = winsContainer.querySelector(".win");

  wins.forEach((win) => {
    const newWin = winTemplate.cloneNode(true);
    newWin.querySelector("#win-img").src = win.media[0]?.url || "";
    newWin.querySelector("#win-img").alt = win.media[0]?.alt || "";
    newWin.querySelector("#win-title").textContent = win.title;
    newWin.querySelector("#win-description").textContent = win.description;
    winsContainer.appendChild(newWin);
  });

  winTemplate.remove();
}
