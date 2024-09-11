import { KEY } from "../../constants.mjs";
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
