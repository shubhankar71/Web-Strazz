import Parse from "parse";

/**
 * Centralized Parse Client Initialization Module
 * 
 * Safely initializes Parse JavaScript SDK using environment configuration.
 * Parse is selected only by explicit configuration. Missing credentials never
 * switch the application to Demo mode, which could mix unrelated data.
 */

const env = (typeof import.meta !== "undefined" && import.meta.env)
  ? import.meta.env
  : (typeof process !== "undefined" && process.env)
  ? process.env
  : {};

const DATA_SOURCE = env.VITE_DATA_SOURCE || "demo";
const APP_ID = env.VITE_PARSE_APPLICATION_ID || "";
const SERVER_URL = env.VITE_PARSE_SERVER_URL || "";
const JS_KEY = env.VITE_PARSE_JAVASCRIPT_KEY || "";

let parseInitialized = false;
const parseConfigError = DATA_SOURCE === "parse" && (!APP_ID || !SERVER_URL)
  ? new Error("Parse mode is selected, but VITE_PARSE_APPLICATION_ID and VITE_PARSE_SERVER_URL must be configured.")
  : null;

if (DATA_SOURCE === "parse" && APP_ID && SERVER_URL) {
  try {
    Parse.initialize(APP_ID, JS_KEY);
    Parse.serverURL = SERVER_URL;
    parseInitialized = true;
  } catch {
    // Readiness checks report a generic configuration error to the UI.
  }
}

/**
 * Check if Parse Mode is active and initialized.
 */
export function isParseConfigured() {
  return DATA_SOURCE === "parse" && parseInitialized;
}

export function isParseModeRequested() {
  return DATA_SOURCE === "parse";
}

export function assertDataSourceReady() {
  if (DATA_SOURCE !== "demo" && DATA_SOURCE !== "parse") {
    throw new Error(`Unsupported VITE_DATA_SOURCE value: ${DATA_SOURCE}`);
  }
  if (parseConfigError) throw parseConfigError;
  if (DATA_SOURCE === "parse" && !parseInitialized) {
    throw new Error("Parse client could not be initialized.");
  }
}

/**
 * Get current data source mode ("demo" | "parse").
 */
export function getDataSourceMode() {
  return DATA_SOURCE === "parse" ? "parse" : "demo";
}

export function getConfiguredDataSource() {
  return DATA_SOURCE;
}

export { Parse };
