export function togglePasswordVisibility(
  passwordInputId,
  toggleButtonId,
  iconElementId
) {
  const passwordInput = document.getElementById(passwordInputId);
  const toggleButton = document.getElementById(toggleButtonId);
  const toggleIcon = document.getElementById(iconElementId);

  if (!passwordInput || !toggleButton || !toggleIcon) {
    console.error("Elements for password toggle not found.");
    return;
  }

  toggleButton.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    toggleIcon.classList.toggle("bi-eye");
    toggleIcon.classList.toggle("bi-eye-slash");
  });
}
