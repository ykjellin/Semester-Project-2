import { REGISTER } from "../../constants.mjs";
import { storeToken } from "../../storage.mjs";

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
      return data.token;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Error registering:", error);
    return null;
  }
}
