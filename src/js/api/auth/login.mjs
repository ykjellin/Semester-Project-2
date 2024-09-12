import { storeToken } from "./auth.mjs";
import { LOGIN } from "../../constants.mjs";

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
      return data.token;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
}
