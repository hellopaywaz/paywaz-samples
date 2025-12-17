import "dotenv/config";
import { PaywazClient } from "@paywaz/sdk";

const API_KEY = (process.env.PAYWAZ_API_KEY || "").trim();
const VERSION = (process.env.PAYWAZ_VERSION || "2025-01-01").trim();
const PAYMENT_ID = (process.env.PAYWAZ_PAYMENT_ID || "").trim();

if (!API_KEY) {
  console.error("Missing PAYWAZ_API_KEY in .env");
  process.exit(1);
}
if (!PAYMENT_ID) {
  console.error("Missing PAYWAZ_PAYMENT_ID in .env");
  process.exit(1);
}

const client = new PaywazClient({
  apiKey: API_KEY,
  apiVersion: VERSION
});

try {
  // If your SDK uses different names, change these:
  const result = await client.payments.get(PAYMENT_ID, {
    paywazVersion: VERSION
  });

  console.log("✅ Retrieved payment:");
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error("❌ Get failed:");
  console.error(err?.response?.data || err);
  process.exit(1);
}
