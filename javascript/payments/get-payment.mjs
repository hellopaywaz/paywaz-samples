import "dotenv/config";
import { PaywazClient } from "@paywaz/sdk";

const API_BASE = process.env.PAYWAZ_API_BASE || "https://api.paywaz.com";
const API_KEY = process.env.PAYWAZ_API_KEY;
const PAYMENT_ID = process.env.PAYWAZ_PAYMENT_ID;

if (!API_KEY) {
  console.error("Missing PAYWAZ_API_KEY in .env");
  process.exit(1);
}

if (!PAYMENT_ID) {
  console.error("Missing PAYWAZ_PAYMENT_ID in .env (set it after running create)");
  process.exit(1);
}

const client = new PaywazClient({
  apiKey: API_KEY,
  baseUrl: API_BASE
});

try {
  const res = await client.payments.retrieve(PAYMENT_ID);

  console.log("✅ Retrieved payment:");
  console.log(JSON.stringify(res, null, 2));
} catch (err) {
  console.error("❌ Get payment failed:");
  console.error(err?.response?.data || err);
  process.exit(1);
}
