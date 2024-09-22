import { initiateEditProfileForm } from "./profileHandler.mjs";
import { updateProfile } from "../api/profileAPI.mjs";
import { getItem } from "../storage.mjs";

export function addEditProfileListener() {
  const editButton = document.getElementById("edit-profile-btn");
  if (editButton) {
    editButton.addEventListener("click", () => {
      console.log("Edit profile button clicked");
      initiateEditProfileForm();
    });
  }
}

export function addFormSubmitListener() {
  const form = document.getElementById("edit-profile-form");
  if (form) {
    form.addEventListener("submit", handleEditProfileSubmit);
  }
}

async function handleEditProfileSubmit(event) {
  event.preventDefault();
  console.log("Profile edit form submitted");

  const updatedAvatarUrl = document.getElementById("edit-avatar").value;
  const updatedBannerUrl = document.getElementById("edit-banner").value;
  const updatedBio = document.getElementById("edit-bio").value;

  try {
    const result = await updateProfile({
      avatar: {
        url: updatedAvatarUrl,
        alt: "",
      },
      banner: {
        url: updatedBannerUrl,
        alt: "",
      },
      bio: updatedBio,
    });

    console.log("Profile update result:", result);

    const username = getItem("username");
    console.log("Navigating to profile for user:", username);
    window.location.href = `/profile/index.html?user=${encodeURIComponent(
      username
    )}`;
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while updating the profile.");
  }
}
