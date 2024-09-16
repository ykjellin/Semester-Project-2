import { KEY, LOGIN, REGISTER } from "../../constants.mjs";
import { storeItem, getItem } from "../../storage.mjs";

/**
 * Function to create an API key
 * @param {string} name - The name for the API key
 * @returns {string|null} - Returns the API key if successful, or null if failed
 */
export async function createApiKey(name) {
  try {
    const authToken = getItem("authToken");
    const response = await fetch(KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name }),
    });

    console.log("Response status:", response.status);
    console.log("Response:", response);

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Data received:", data);

    if (data.data && data.data.key) {
      storeItem("apiKey", data.data.key);
      return data.data.key;
    } else {
      throw new Error("Failed to create API key");
    }
  } catch (error) {
    console.error("Error creating API key", error);
    return null;
  }
}

/**
 * Function to store the authentication token
 * @param {string} token - The authentication token to store
 */
export function storeToken(token) {
  storeItem("authToken", token);
}

/**
 * Function to handle user login
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {object|null} - Returns the login data (token and apiKey) or null on failure
 */
export async function login(email, password) {
  try {
    const response = await fetch(LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
      storeToken(data.token);
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
 * Function to handle user registration
 * @param {string} name - The user's name
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {object|null} - Returns the registration data (token and apiKey) or null on failure
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
    console.log("Starting registration...");

    const requestBody = JSON.stringify({
      name,
      email,
      password,
      bio,
      avatar: { url: avatarUrl || "", alt: "" },
      banner: { url: bannerUrl || "", alt: "" },
      venueManager,
    });

    console.log("Request Body:", requestBody);

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
      if (apiKey) {
        console.log(`API Key created: ${apiKey}`);
      } else {
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
