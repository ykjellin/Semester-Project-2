import { removeItem, clearStorage, getItem } from "../storage.mjs";

export function handleAuthButton() {
  const authToken = getItem("authToken");
  const authButton = document.getElementById("auth-btn");

  if (authButton) {
    if (authToken) {
      authButton.textContent = "Logout";
      authButton.ariaLabel = "Logout";
      authButton.onclick = handleAuthLogout;
    } else {
      authButton.textContent = "Login";
      authButton.ariaLabel = "Login";
      authButton.onclick = function () {
        window.location.href = "/login/index.html";
      };
    }
  }
}

export function handleAuthLogout() {
  removeItem("authToken");
  removeItem("apiKey");
  removeItem("username");
  clearStorage();
  console.log("User logged out from auth button");
  window.location.href = "/home/index.html";
}
