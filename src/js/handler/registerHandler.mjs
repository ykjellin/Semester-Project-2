import { register } from "../api/auth/auth.mjs";
import { storeItem } from "../storage.mjs";

export function handleRegisterSubmit() {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const name = formData.get("name").trim();
      const email = formData.get("email").trim();
      const password = formData.get("password").trim();
      const bio = formData.get("bio") || "";
      const avatarUrl = formData.get("avatar_url") || "";
      const bannerUrl = formData.get("banner_url") || "";

      // Validate name
      if (!name) {
        displayError("Name is required.");
        return;
      }

      // Validate email
      if (!isValidEmail(email)) {
        displayError("Please enter a valid email.");
        return;
      }

      // Validate password (at least 8 characters, includes letters and numbers)
      if (!isValidPassword(password)) {
        displayError(
          "Password must be at least 8 characters and include both letters and numbers."
        );
        return;
      }

      const data = await register(
        name,
        email,
        password,
        bio,
        avatarUrl,
        bannerUrl
      );

      if (data && data.token) {
        storeItem("authToken", data.token);

        if (data.apiKey) {
          storeItem("apiKey", data.apiKey);
        }

        displaySuccess("Registration successful!");
        window.location.href = "/login/index.html";
      } else {
        displayError("Registration failed.");
      }
    });
  }
}

/**
 * Function to validate email format.
 * @param {string} email - The email to validate.
 * @returns {boolean} - Returns true if the email is valid.
 */
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Function to validate password strength.
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if the password meets the criteria.
 */
function isValidPassword(password) {
  // At least 8 characters, includes letters and numbers
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordPattern.test(password);
}

/**
 * Function to display error messages to the user.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
  const feedbackContainer = document.getElementById("formFeedback");
  feedbackContainer.classList.remove("d-none", "alert-success");
  feedbackContainer.classList.add("alert-danger");
  feedbackContainer.textContent = message;
}

/**
 * Function to display success messages to the user.
 * @param {string} message - The success message to display.
 */
function displaySuccess(message) {
  const feedbackContainer = document.getElementById("formFeedback");
  feedbackContainer.classList.remove("d-none", "alert-danger");
  feedbackContainer.classList.add("alert-success");
  feedbackContainer.textContent = message;
}
