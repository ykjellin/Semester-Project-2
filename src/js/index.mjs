import { route } from "../../src/js/router.mjs";
import { getItem } from "../../src/js/storage.mjs";
import { handleRegisterSubmit } from "../../src/js/handler/registerHandler.mjs";
import { handleLoginSubmit } from "../../src/js/handler/loginHandler.mjs";
import { togglePasswordVisibility } from "../../src/js/utility/passwordVisibility.mjs";
import { loadProfile } from "../../src/js/handler/profileHandler.mjs";
import { loadAuctionsList } from "../../src/js/handler/auctionListHandler.mjs";

/**
 * Initializes the routing when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  route();

  const homeLink = document.getElementById("home-link");
  if (homeLink) {
    homeLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.history.pushState({}, "", "/");
      route();
      loadProfile();
    });
  }

  const profileLink = document.getElementById("profile-link");
  if (profileLink) {
    profileLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.history.pushState({}, "", "/profile");
      route();
    });
  }

  const auctionsLink = document.getElementById("auctions-link");
  if (auctionsLink) {
    auctionsLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.history.pushState({}, "", "/auctionList");
      route();
      loadAuctionsList();
    });
  }

  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.history.pushState({}, "", "/login");
      route();
    });
  } else {
    console.log("Login button not found");
  }

  //const registerBtn = document.getElementById("register-btn");
  //if (registerBtn) {
  // registerBtn.addEventListener("click", (event) => {
  //   event.preventDefault();
  //   window.history.pushState({}, "", "/register");
  //  route();
  //});
  //} else {
  //  console.log("Register button not found");
  //}

  const mainContent = document.getElementById("main-content");
  const observer = new MutationObserver(() => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      console.log("Register form detected, attaching handler.");
      handleRegisterSubmit();
    }
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      console.log("Login form detected, attaching handler.");
      handleLoginSubmit();
    }

    const profilePage = document.getElementById("profile-page");
    if (profilePage) {
      console.log("Profile page detected, loading profile data.");

      const username = getItem("username");
      const authToken = getItem("authToken");
      if (username && authToken) {
        loadProfile();
      } else {
        console.log("User is not logged in. Skipping profile loading.");
      }
    }
  });

  observer.observe(mainContent, { childList: true, subtree: true });

  const applyFiltersBtn = document.getElementById("apply-filters");
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", (event) => {
      event.preventDefault();
      loadAuctionsList();
    });
  }

  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    togglePasswordVisibility("password", "togglePassword", "toggleIcon");
  }
});

/**
 * Handle browser back/forward navigation
 */
window.addEventListener("popstate", () => {
  route();
});
