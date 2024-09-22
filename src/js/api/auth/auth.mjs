import { KEY, LOGIN, REGISTER } from "../../constants.mjs";
import { storeItem, getItem } from "../../storage.mjs";

/**
 * Function to create an API key.
 * @param {string} name - The name for the API key.
 * @returns {Promise<string|null>} - Returns the API key if successful, or null if failed.
 */
export async function createApiKey(name) {
  try {
    const authToken = getItem("authToken");

    const response = await fetch(KEY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.error(
          "403 Forbidden - You may already have an API key or lack permission."
        );
      }
      throw new Error(`Failed to create API key: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.data && data.data.key) {
      storeItem("apiKey", data.data.key);
      return data.data.key;
    } else {
      throw new Error("No API key returned from the server.");
    }
  } catch (error) {
    console.error("Error creating API key", error);
    return null;
  }
}

/**
 * Function to store the authentication token.
 * @param {string} token - The authentication token to store.
 */
export function storeToken(token) {
  storeItem("authToken", token);
}

/**
 * Function to handle user login.
 * @param {string} name - The user's name (username).
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object|null>} - Returns the login data (token and apiKey) or null on failure.
 */
export async function login(name, email, password) {
  try {
    const response = await fetch(LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.data && data.data.accessToken) {
      storeToken(data.data.accessToken);
      return data;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
}

/**
 * Function to handle user registration.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} [bio=""] - The user's bio (optional).
 * @param {string} [avatarUrl=""] - The user's avatar URL (optional).
 * @param {string} [bannerUrl=""] - The user's banner URL (optional).
 * @param {boolean} [venueManager=false] - Indicates if the user is a venue manager (optional).
 * @returns {Promise<object|null>} - Returns the registration data (token and apiKey) or null on failure.
 */
export async function register(
  name,
  email,
  password,
  bio = "",
  avatarUrl = "",
  bannerUrl = "",
  venueManager = false
) {
  try {
    const requestBody = JSON.stringify({
      name,
      email,
      password,
      bio,
      avatar: { url: avatarUrl || "", alt: "" },
      banner: { url: bannerUrl || "", alt: "" },
      venueManager,
    });

    const response = await fetch(REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      if (
        response.status === 400 &&
        errorMessage.includes("User already exists")
      ) {
        throw new Error("This email or username is already registered.");
      }
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.token) {
      storeToken(data.token);

      const apiKey = await createApiKey(name);
      if (!apiKey) {
        console.warn("Failed to create API key");
      }

      return data;
    } else {
      throw new Error("No token received from the API");
    }
  } catch (error) {
    console.error("Error registering:", error);
    return { success: false, message: error.message };
  }
}
