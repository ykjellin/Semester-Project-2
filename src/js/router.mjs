import { handleLoginSubmit } from "./handler/loginHandler.mjs";
import { handleRegisterSubmit } from "./handler/registerHandler.mjs";

/**
 * Function to handle routing logic based on the current folder (path).
 * This function initializes the page-specific logic.
 */
export function route() {
  const path = window.location.pathname; // Get the current path

  if (path.includes("/login")) {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLoginSubmit);
    }
  } else if (path.includes("/register")) {
    const registerForm = document.getElementById("registrationForm");
    if (registerForm) {
      registerForm.addEventListener("submit", handleRegisterSubmit);
    }
  } else {
    console.warn("No specific logic to handle this page.");
  }
}
