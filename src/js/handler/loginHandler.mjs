import { login } from "../api/auth/auth.mjs";
import { storeItem } from "../storage.mjs";

export function handleLoginSubmit() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    console.log("Login form detected, attaching event listener.");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const email = formData.get("email");
      const password = formData.get("password");

      const data = await login(email, password);
      console.log("Login API response:", data);

      if (data && data.accessToken) {
        storeItem("authToken", data.accessToken);
        alert("Login successful!");
        window.location.href = "/profile/index.html";
      } else {
        alert("Login failed.");
      }
    });
  } else {
    console.log("Login form not found.");
  }
}
