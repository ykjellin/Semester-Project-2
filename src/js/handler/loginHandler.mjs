import { login } from "../api/auth/login.mjs";
import { createApiKey, storeToken } from "../api/auth/auth.mjs";

export function initLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const email = formData.get("email");
      const password = formData.get("password");

      const token = await login(email, password);
      if (token) {
        storeToken(token);
        alert("Login successful!");

        const apiKey = await createApiKey("default-key");
        if (apiKey) {
          console.log(`API Key created: ${apiKey}`);
        }

        window.location.href = "/profile/index.html";
      } else {
        alert("Login failed.");
      }
    });
  }
}
