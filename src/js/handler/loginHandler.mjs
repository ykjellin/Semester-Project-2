import { login } from "../api/auth/auth.mjs";
import { storeItem } from "../storage.mjs";

export function handleLoginSubmit() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const email = formData.get("email");
      const password = formData.get("password");

      const data = await login(email, password);
      if (data && data.token) {
        storeItem("authToken", data.token);

        if (data.apiKey) {
          storeItem("apiKey", data.apiKey);
        }

        alert("Login successful!");
        window.location.href = "/profile/index.html";
      } else {
        alert("Login failed.");
      }
    });
  }
}
