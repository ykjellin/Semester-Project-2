import { route } from "./router.mjs";
import { togglePasswordVisibility } from "../js/utility/passwordVisibility.mjs";

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
      window.history.pushState({}, "", "/auctions");
      route();
    });
  }

  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.history.pushState({}, "", "/login");
      route();
    });
  }

  const registerBtn = document.getElementById("register-btn");
  if (registerBtn) {
    registerBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.history.pushState({}, "", "/register");
      route();
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
