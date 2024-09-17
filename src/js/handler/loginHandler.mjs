import { login, createApiKey } from "../api/auth/auth.mjs";
import { storeItem, getItem } from "../storage.mjs";
import { route } from "../router.mjs";

export function handleLoginSubmit() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    console.log("Login form detected, attaching event listener.");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      const data = await login(name, email, password);
      console.log("Login API response:", data);

      if (data && data.data && data.data.accessToken) {
        storeItem("authToken", data.data.accessToken);
        storeItem("username", data.data.name);

        let apiKey = getItem("apiKey");
        if (!apiKey) {
          console.log("No API key found, attempting to create one...");
          try {
            apiKey = await createApiKey();
            if (apiKey) {
              console.log(`API key created: ${apiKey}`);
            } else {
              console.warn(
                "Failed to create API key, proceeding without it..."
              );
            }
          } catch (error) {
            console.warn("Error creating API key, but continuing login...");
          }
        }

        alert("Login successful!");
        window.history.pushState({}, "", "/profile");
        route();
      } else {
        alert("Login failed.");
      }
    });
  } else {
    console.log("Login form not found.");
  }
}
