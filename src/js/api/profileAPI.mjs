import { getItem } from "../storage.mjs";

export async function fetchProfile(username) {
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");
  username = username || getItem("username");

  if (!username) {
    console.error("Username not provided for fetchProfile");
    throw new Error("Username not found");
  }

  const response = await fetch(
    `https://v2.api.noroff.dev/auction/profiles/${username}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch profile for ${username}`);
  }

  return await response.json();
}

export async function fetchListings(username) {
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");
  username = username || getItem("username");

  if (!username) {
    throw new Error("Username not found");
  }

  const response = await fetch(
    `https://v2.api.noroff.dev/auction/profiles/${username}/listings`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch profile", response);
    throw new Error(`Failed to fetch listings for ${username}`);
  }

  return await response.json();
}

export async function fetchWins(username) {
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");
  username = username || getItem("username");

  if (!username) {
    throw new Error("Username not found");
  }

  const response = await fetch(
    `https://v2.api.noroff.dev/auction/profiles/${username}/wins`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch wins for ${username}`);
  }

  return await response.json();
}

export async function updateProfile(profileData) {
  const authToken = getItem("authToken");
  const apiKey = getItem("apiKey");
  const username = getItem("username");

  console.log("Updating profile for username:", username);
  console.log("Profile data to update:", profileData);

  if (!username) {
    console.error("Username not found for profile update");
    throw new Error("Username not found");
  }

  const response = await fetch(
    `https://v2.api.noroff.dev/auction/profiles/${username}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  if (!response.ok) {
    console.error("Failed to update profile", response);
    const errorData = await response.json();
    throw new Error(`Failed to update profile: ${errorData.message}`);
  }

  const result = await response.json();
  console.log("Profile update response:", result);
  return result;
}
