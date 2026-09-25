import { isParseModeRequested } from "../services/parseClient.js";

export function toUserFacingDataError(error) {
  if (isParseModeRequested()) {
    if (/VITE_PARSE_|not configured/i.test(error?.message || "")) {
      return new Error("Parse mode is selected, but the required Parse application configuration is missing.");
    }
    return new Error("The configured Parse data source is unavailable or rejected this request. Check server availability and class permissions.");
  }
  return new Error(error?.message || "The requested data could not be loaded. Please try again.");
}
