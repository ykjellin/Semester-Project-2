import { handleRegisterSubmit } from "../../src/js/handler/registerHandler.mjs";
import { handleLoginSubmit } from "../../src/js/handler/loginHandler.mjs";
import { togglePasswordVisibility } from "../../src/js/utility/passwordVisibility.mjs";
import { loadProfile } from "../../src/js/handler/profileHandler.mjs";
import { loadAuctionDetails } from "../../src/js/handler/auctionHandler.mjs";
import { handleBidSubmission } from "./handler/bidHandler.mjs";
import { getItem } from "./storage.mjs";
import { initAuctionSearch } from "./handler/auctionSearch.mjs";
import { initcreateauctionForm } from "./handler/createAuctionHandler.mjs";
import {
  renderHomepageAuctions,
  loadPublicAuctionsList,
  initHomepageAuctionSearch,
} from "./handler/publicListHandler.mjs";

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

function initializePage() {
  console.log("Current path:", window.location.pathname);
  handleNavigationLinks();
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
    loadProfile();
  }

  if (window.location.pathname.includes("/viewauction/index.html")) {
    console.log("View auction page detected, loading auction details.");

    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get("auctionId");

    if (auctionId) {
      console.log(`Auction ID found: ${auctionId}`);
      loadAuctionDetails(auctionId);
      module.initAuctionSearch();
      handleBidSubmission(auctionId);
    } else {
      console.error("No auction ID found in the URL.");
    }
  }

  const currentPath = window.location.pathname.replace(/\/$/, "/index.html");

  if (currentPath === "/home/index.html") {
    console.log("Home page detected, loading public auctions.");

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

    const searchSection = document.getElementById("search-section");
    const toggleIcon = document.getElementById("toggle-icon");

    if (searchSection && toggleIcon) {
      searchSection.addEventListener("shown.bs.collapse", () => {
        toggleIcon.classList.remove("bi-chevron-down");
        toggleIcon.classList.add("bi-chevron-up");
      });

      searchSection.addEventListener("hidden.bs.collapse", () => {
        toggleIcon.classList.remove("bi-chevron-up");
        toggleIcon.classList.add("bi-chevron-down");
      });
    }
  }

  if (currentPath === "/auctionlist/index.html") {
    console.log("Auction list page detected, loading auctions.");

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
  } else {
    console.log("Not on the auction list page, skipping auction list loading.");
  }

  if (currentPath === "/createauction/index.html") {
    console.log("Create Auction page detected, initializing form.");
    initcreateauctionForm();
  }

  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    togglePasswordVisibility("password", "togglePassword", "toggleIcon");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
});
