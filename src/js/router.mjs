import { loadAuctionDetails } from "./handler/auctionHandler.mjs";

export async function route() {
  const path = window.location.pathname;
  const mainContent = document.querySelector("#main-content");

  console.log(`Navigating to: ${path}`);

  async function loadContent(url) {
    try {
      console.log(`Loading content from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load content from ${url}`);
      }
      const html = await response.text();
      mainContent.innerHTML = html;
      if (url.includes("home")) {
        attachHomePageEventListeners();
      } else if (url.includes("auctionList")) {
        attachAuctionListEventListeners();
      }
    } catch (error) {
      console.error(error);
      mainContent.innerHTML = `
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for doesn't exist.</p>
        <a href="/">Go Home</a>
      `;
    }
  }

  if (path === "/" || path === "/home") {
    await loadContent("/home/index.html");
  } else if (path.includes("/login")) {
    await loadContent("../login/index.html");
  } else if (path.includes("/register")) {
    await loadContent("../register/index.html");
  } else if (path.includes("/profile")) {
    await loadContent("../profile/index.html");
  } else if (path.includes("/auctionList")) {
    await loadContent("../auctionList/index.html");
  } else if (path.includes("/createAuction")) {
    await loadContent("../createAuction/index.html");
  } else if (path.includes("/auction/")) {
    const auctionId = path.split("/auction/")[1];
    await loadContent("../auctionDetail/index.html");
    loadAuctionDetails(auctionId);
  } else {
    mainContent.innerHTML = `
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <a href="/">Go Home</a>
    `;
  }
}

/**
 * Function to attach event listeners for the auction list page
 */
function attachAuctionListEventListeners() {
  const applyFiltersBtn = document.getElementById("apply-filters");
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", (event) => {
      event.preventDefault();
      loadAuctionsList();
    });
  }
}

/**
 * Function to attach event listeners for the home page
 */
function attachHomePageEventListeners() {
  const registerBtn = document.getElementById("register-btn");
  if (registerBtn) {
    registerBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.history.pushState({}, "", "/register");
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
  } else {
    console.log("Login button not found");
  }
}
