import { login, createApiKey } from "../api/auth/auth.mjs";
import { storeItem, getItem } from "../storage.mjs";

/**
 * Function to handle the login form submission.
 * Sends login request to the API and stores authentication data on success.
 */
export function handleLoginSubmit() {
  const loginForm = document.getElementById("loginForm");
  const feedbackElement = document.getElementById("loginFeedback");
  const loader = document.getElementById("loginLoader");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      feedbackElement.textContent = "";
      loader.style.display = "block";

      const formData = new FormData(loginForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      // Basic validation
      if (!name || !email || !password) {
        (feedbackElement.textContent = "All fields are required!"), true;
        loader.style.display = "none";
        return;
      }

      try {
        const data = await login(name, email, password);

        if (data && data.data && data.data.accessToken) {
          storeItem("authToken", data.data.accessToken);
          storeItem("username", data.data.name);

          let apiKey = getItem("apiKey");
          if (!apiKey) {
            try {
              apiKey = await createApiKey();
            } catch (error) {
              console.warn("Error creating API key, but continuing login...");
            }
          }
          const username = getItem("username");
          console.log("Navigating to profile for user:", username);
          window.location.href = `/profile/index.html?user=${encodeURIComponent(
            username
          )}`;
        } else {
          feedbackElement.textContent =
            "Login failed. Please check your credentials.";
        }
      } catch (error) {
        feedbackElement.textContent =
          "An error occurred while trying to log in. Please try again.";
        console.error("Login error:", error);
      } finally {
        loader.style.display = "none";
      }
    });
  }
}
