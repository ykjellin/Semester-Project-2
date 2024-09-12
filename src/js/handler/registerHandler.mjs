import { register } from "../api/auth/register.mjs";
import { createApiKey, storeToken } from "../api/auth/auth.mjs";

export function initRegisterForm() {
  const registerForm = document.getElementById("registrationForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      const token = await register(name, email, password);
      if (token) {
        storeToken(token);
        alert("Registration successful!");

        const apiKey = await createApiKey("default-key");
        if (apiKey) {
          console.log(`API Key created: ${apiKey}`);
        }

        window.location.href = "/login/index.html";
      } else {
        alert("Registration failed.");
      }
    });
  }
}
