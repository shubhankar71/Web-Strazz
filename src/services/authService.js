import { assertDataSourceReady, isParseModeRequested, Parse } from "./parseClient.js";

const DEMO_STORAGE_KEY = "webstarzz.demo.user";

export const DEMO_CREDENTIALS = Object.freeze({
  email: "demo@webstarzz.local",
  password: "demo1234",
});

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.get?.("email") || "",
    username: user.get?.("username") || user.get?.("email") || "User",
  };
}

function authError(error) {
  if (/Unsupported VITE_DATA_SOURCE/.test(error?.message || "")) {
    return new Error("Authentication is unavailable because the data source configuration is invalid.");
  }
  if (error?.message?.includes("VITE_PARSE_") || error?.message?.includes("Parse mode is selected")) {
    return new Error("Parse authentication is unavailable because the Parse application is not configured.");
  }
  if (error?.code === 101 || /invalid login|invalid username|password/i.test(error?.message || "")) {
    return new Error("The email or password is incorrect.");
  }
  if (isParseModeRequested()) {
    return new Error("Authentication is unavailable. Check the Parse Server connection and try again.");
  }
  return new Error("Demo authentication could not be completed in this browser.");
}

export function getAuthMode() {
  return isParseModeRequested() ? "parse" : "demo";
}

export async function getCurrentUser() {
  try {
    assertDataSourceReady();
    if (!isParseModeRequested()) {
      const value = window.localStorage.getItem(DEMO_STORAGE_KEY);
      return value ? JSON.parse(value) : null;
    }
    const user = await Parse.User.currentAsync();
    return toPublicUser(user);
  } catch (error) {
    throw authError(error);
  }
}

export async function login(identifier, password) {
  try {
    assertDataSourceReady();
  } catch (error) {
    throw authError(error);
  }
  const cleanIdentifier = identifier.trim();
  if (!cleanIdentifier || !password) throw new Error("Enter your email or username and password.");

  if (!isParseModeRequested()) {
    if (cleanIdentifier.toLowerCase() !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      throw new Error("The email or password is incorrect.");
    }
    const user = {
      id: "demo-user",
      email: DEMO_CREDENTIALS.email,
      username: "Demo User",
      isDemo: true,
    };
    try {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(user));
    } catch {
      throw new Error("Demo authentication could not be saved in this browser.");
    }
    return user;
  }

  try {
    return toPublicUser(await Parse.User.logIn(cleanIdentifier, password));
  } catch (error) {
    throw authError(error);
  }
}

export async function logout() {
  try {
    assertDataSourceReady();
  } catch (error) {
    throw authError(error);
  }
  if (!isParseModeRequested()) {
    try {
      window.localStorage.removeItem(DEMO_STORAGE_KEY);
      return;
    } catch {
      throw new Error("Demo sign-out could not be completed in this browser.");
    }
  }

  try {
    await Parse.User.logOut();
  } catch {
    throw new Error("Sign-out could not be completed because the Parse Server is unavailable. Please try again.");
  }
}
