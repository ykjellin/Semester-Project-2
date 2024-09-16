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

    const data = await response.json();

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
export async function register(name, email, password) {
  try {
    const response = await fetch(REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.token) {
      storeToken(data.token);
      return data;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Error registering:", error);
    return null;
  }
}
