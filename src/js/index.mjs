import { handleRegisterSubmit } from "../../src/js/handler/registerHandler.mjs";
import { handleLoginSubmit } from "../../src/js/handler/loginHandler.mjs";
import { togglePasswordVisibility } from "../../src/js/utility/passwordVisibility.mjs";
import { loadProfile } from "../../src/js/handler/profileHandler.mjs";
import { loadAuctionDetails } from "../../src/js/handler/auctionHandler.mjs";
import { handleBidSubmission } from "./handler/bidHandler.mjs";
import { getItem, removeItem, clearStorage } from "./storage.mjs";
import { initAuctionSearch } from "./handler/auctionSearch.mjs";
import { initcreateauctionForm } from "./handler/createAuctionHandler.mjs";
import {
  renderHomepageAuctions,
  loadPublicAuctionsList,
  initHomepageAuctionSearch,
} from "./handler/publicListHandler.mjs";
import { handleAuthButton } from "./handler/handleAuthButton.mjs";

/**
 * Function to handle navigation links visibility based on authentication.
 */
function handleNavigationLinks() {
  const createAuctionLink = document.getElementById("create-auction-link");
  const authToken = getItem("authToken");

  if (createAuctionLink) {
    if (authToken) {
      createAuctionLink.classList.remove("d-none");
    } else {
      createAuctionLink.classList.add("d-none");
    }
  }
}

/**
 * Function to navigate to the profile page based on user data.
 */
function navigateToProfile(user) {
  console.log("Attempting to navigate to profile for user:", user);
  if (typeof user === "object") {
    console.error("Incorrect user data type for navigation:", user);
    window.location.href = "/profile/index.html";
  } else if (typeof user === "string") {
    console.log(
      `Navigating to /profile/index.html?user=${encodeURIComponent(user)}`
    );
    window.location.href = `/profile/index.html?user=${encodeURIComponent(
      user
    )}`;
  } else {
    console.error("Invalid user data for navigation:", user);
    window.location.href = "/profile/index.html";
  }
}

/**
 * Function to initialize the page based on the current path.
 * It attaches form handlers, loads auction data, and manages DOM interactions.
 */
function initializePage() {
  handleNavigationLinks();

  const username = getItem("username");
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");

  if (!username || !authToken || !apiKey) {
    console.log("User not logged in");
  } else {
    const profilePage = document.getElementById("profile-page");
    if (profilePage) {
      loadProfile();
    }
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    handleRegisterSubmit();
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    handleLoginSubmit();
  }

  // Load auction details on auction view page
  if (window.location.pathname.includes("/viewauction/index.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get("auctionId");

    if (auctionId) {
      loadAuctionDetails(auctionId);
      handleBidSubmission(auctionId);
    }
  }

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      removeItem("authToken");
      removeItem("apiKey");
      removeItem("username");
      removeItem("userProfile");
      clearStorage();
      console.log("User logged out, navigating to home");
      window.location.href = "/home/index.html";
    });
  }

  // Profile link navigation
  const profileLink = document.getElementById("profile-link");
  if (profileLink) {
    profileLink.addEventListener("click", function (event) {
      event.preventDefault();
      const storedUsername = getItem("username");
      console.log("Profile link clicked, navigating for user:", storedUsername);
      navigateToProfile(storedUsername);
    });
  }

  // Load public auctions on home page
  const currentPath = window.location.pathname
    .replace(/\/$/, "/index.html")
    .toLowerCase();

  if (currentPath === "/home/index.html") {
    let currentPage = 1;
    const limit = 6;

    loadPublicAuctionsList(limit, currentPage)
      .then(() => {
        initHomepageAuctionSearch();
      })
      .catch((error) => {
        console.error("Failed to load public auctions:", error);
      });

    const loadMoreBtn = document.getElementById("load-more-home-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        currentPage++;
        loadPublicAuctionsList(limit, currentPage).catch((error) => {
          console.error("Failed to load more auctions:", error);
        });
      });
    }
  }

  // Load auctions list on auction list page
  if (currentPath === "/auctionlist/index.html") {
    import("./handler/auctionListHandler.mjs")
      .then((module) => {
        module.loadAuctionsList();
      })
      .catch((error) => {
        console.error("Failed to load auction list handler:", error);
      });

    const applyFiltersBtn = document.getElementById("apply-filters");
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", (event) => {
        event.preventDefault();

        import("./handler/auctionListHandler.mjs")
          .then((module) => {
            module.loadAuctionsList();
          })
          .catch((error) => {
            console.error(
              "Failed to reload auction list after applying filters:",
              error
            );
          });
      });
    }
    initAuctionSearch();
  }

  if (currentPath === "/createauction/index.html") {
    initcreateauctionForm();
  }

  // Toggle password visibility
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    togglePasswordVisibility("password", "togglePassword", "toggleIcon");
  }

  // Handle dropdown chevrons
  const handleChevronToggle = (collapseId, chevronId) => {
    const collapseElement = document.getElementById(collapseId);
    const chevronElement = document.getElementById(chevronId);

    if (collapseElement && chevronElement) {
      collapseElement.addEventListener("shown.bs.collapse", () => {
        chevronElement.classList.remove("bi-chevron-down");
        chevronElement.classList.add("bi-chevron-up");
      });

      collapseElement.addEventListener("hidden.bs.collapse", () => {
        chevronElement.classList.remove("bi-chevron-up");
        chevronElement.classList.add("bi-chevron-down");
      });
    }
  };

  handleChevronToggle("filterCollapse", "filter-chevron");
  handleChevronToggle("searchCollapse", "search-chevron");
}

// Ensure the auctions link works
document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  handleAuthButton();

  // Fix navigation link issue
  const auctionLink = document.getElementById("auctions-link");
  if (auctionLink) {
    auctionLink.addEventListener("click", (event) => {
      console.log("Auction link clicked!", event);
    });
  } else {
    console.warn("Element #auctions-link not found on page load.");
  }

  // Event delegation in case nav is dynamically changed
  document.addEventListener("click", (event) => {
    const target = event.target.closest("#auctions-link");
    if (target) {
      console.log("Auction link clicked via event delegation!", event);
    }
  });
});
