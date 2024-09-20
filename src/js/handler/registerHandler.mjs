import { register } from "/api/auth/auth.mjs";
import { storeItem } from "/storage.mjs";

export function handleRegisterSubmit() {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const bio = formData.get("bio") || "";
      const avatarUrl = formData.get("avatar_url") || "";
      const bannerUrl = formData.get("banner_url") || "";

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

        alert("Registration successful!");
        window.location.href = "/login/index.html";
      } else {
        alert("Registration failed.");
      }
    });
  }
}
