import { login, createApiKey } from "../api/auth/auth.mjs";
import { storeItem, getItem } from "../storage.mjs";

/**
 * Function to handle the login form submission.
 * Sends login request to the API and stores authentication data on success.
 */
export function handleLoginSubmit() {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

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

        alert("Login successful!");
        window.location.href = "/profile/index.html";
      } else {
        alert("Login failed.");
      }
    });
  }
}
