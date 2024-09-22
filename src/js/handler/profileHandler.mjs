import { fetchProfile, fetchListings, fetchWins } from "../api/profileAPI.mjs";
import {
  updateProfileUI,
  populateListings,
  populateWins,
  loadEditProfileForm,
} from "./profileDOM.mjs";
import {
  addEditProfileListener,
  addFormSubmitListener,
} from "./profileEvents.mjs";
import { getItem } from "../storage.mjs";

let profileLoaded = false;

function displayErrorMessage(message) {
  const errorContainer = document.getElementById("error-container");
  if (!errorContainer) {
    const newErrorContainer = document.createElement("div");
    newErrorContainer.id = "error-container";
    newErrorContainer.className = "alert alert-danger mt-3";
    document.body.insertBefore(newErrorContainer, document.body.firstChild);
  }

  const container =
    errorContainer || document.getElementById("error-container");
  container.textContent = message;
  container.style.display = "block";

  setTimeout(() => {
    container.style.display = "none";
  }, 5000);
}

export async function loadProfile() {
  if (profileLoaded) {
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("user") || getItem("username");

    if (!username) {
      throw new Error("Username not found");
    }

    const profile = await fetchProfile(username);

    updateProfileUI(profile);

    const listings = await fetchListings(username);

    populateListings(listings.data);

    const wins = await fetchWins(username);

    populateWins(wins.data);

    const listingsCarousel = document.getElementById("listingsCarousel");
    const winsCarousel = document.getElementById("winsCarousel");

    if (listingsCarousel) {
      new bootstrap.Carousel(listingsCarousel);
    }

    if (winsCarousel) {
      new bootstrap.Carousel(winsCarousel);
    }

    addEditProfileListener();

    profileLoaded = true;
  } catch (error) {
    console.error("Error loading profile:", error);
    displayErrorMessage(
      "There was an error loading your profile. Please try again later."
    );
  }
}

export function initiateEditProfileForm() {
  const name = document.getElementById("name").textContent;
  const email = document.getElementById("email").textContent;
  const bio = document.getElementById("bio").textContent;
  const avatar = document.getElementById("avatar").src;
  const banner = document.getElementById("banner").src;

  loadEditProfileForm(name, email, bio, avatar, banner);
  addFormSubmitListener();
}
