import { handleRegisterSubmit } from "../../src/js/handler/registerHandler.mjs";
import { handleLoginSubmit } from "../../src/js/handler/loginHandler.mjs";
import { togglePasswordVisibility } from "../../src/js/utility/passwordVisibility.mjs";
import { loadProfile } from "../../src/js/handler/profileHandler.mjs";
import { loadAuctionDetails } from "../../src/js/handler/auctionHandler.mjs";
import { handleBidSubmission } from "./handler/bidHandler.mjs";
import { getItem, removeItem } from "./storage.mjs";
import { initAuctionSearch } from "./handler/auctionSearch.mjs";
import { initcreateauctionForm } from "./handler/createAuctionHandler.mjs";
import {
  renderHomepageAuctions,
  loadPublicAuctionsList,
  initHomepageAuctionSearch,
} from "./handler/publicListHandler.mjs";

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
 * Function to initialize the page based on the current path.
 * It attaches form handlers, loads auction data, and manages DOM interactions.
 */
function initializePage() {
  handleNavigationLinks();

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    handleRegisterSubmit();
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    handleLoginSubmit();
  }

  const profilePage = document.getElementById("profile-page");
  if (profilePage) {
    loadProfile();
  }

  if (window.location.pathname.includes("/viewauction/index.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get("auctionId");

    if (auctionId) {
      loadAuctionDetails(auctionId);
      handleBidSubmission(auctionId);
    }
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      removeItem("authToken");
      removeItem("apiKey");
      removeItem("username");
      removeItem("userProfile");
      window.location.href = "/home/index.html";
    });
  }

  const currentPath = window.location.pathname.replace(/\/$/, "/index.html");

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

  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    togglePasswordVisibility("password", "togglePassword", "toggleIcon");
  }

  const filterCollapse = document.getElementById("filterCollapse");
  const filterChevron = document.getElementById("filter-chevron");

  if (filterCollapse && filterChevron) {
    filterCollapse.addEventListener("shown.bs.collapse", () => {
      filterChevron.classList.remove("bi-chevron-down");
      filterChevron.classList.add("bi-chevron-up");
    });

    filterCollapse.addEventListener("hidden.bs.collapse", () => {
      filterChevron.classList.remove("bi-chevron-up");
      filterChevron.classList.add("bi-chevron-down");
    });
  }

  const searchCollapse = document.getElementById("searchCollapse");
  const searchChevron = document.getElementById("search-chevron");

  if (searchCollapse && searchChevron) {
    searchCollapse.addEventListener("shown.bs.collapse", () => {
      searchChevron.classList.remove("bi-chevron-down");
      searchChevron.classList.add("bi-chevron-up");
    });

    searchCollapse.addEventListener("hidden.bs.collapse", () => {
      searchChevron.classList.remove("bi-chevron-up");
      searchChevron.classList.add("bi-chevron-down");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
});
