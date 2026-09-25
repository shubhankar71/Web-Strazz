import { seedParseDatabase } from "../src/services/seedParseData.js";
import { isParseConfigured } from "../src/services/parseClient.js";

async function main() {
  console.log("=== WEB STARZZ PARSE SEEDER ===");
  if (!isParseConfigured()) {
    console.warn("Parse client is not configured for PARSE mode. Set VITE_DATA_SOURCE=parse, VITE_PARSE_APPLICATION_ID, and VITE_PARSE_SERVER_URL in your environment.");
    process.exit(1);
  }

  try {
    await seedParseDatabase();
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

main();
