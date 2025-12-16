import "dotenv/config";
import { PaywazClient } from "@paywaz/sdk";

const API_BASE = process.env.PAYWAZ_API_BASE || "https://api.paywaz.com";
const API_KEY = process.env.PAYWAZ_API_KEY;
const DESTINATION = process.env.PAYWAZ_DESTINATION;

// Optional fields for your payload (safe defaults)
const AMOUNT = process.env.PAYWAZ_AMOUNT || "49.99";
const CURRENCY = process.env.PAYWAZ_CURRENCY || "PZUSD";

if (!API_KEY) {
  console.error("Missing PAYWAZ_API_KEY in .env");
  process.exit(1);
}

if (!DESTINATION) {
  console.error("Missing PAYWAZ_DESTINATION in .env (required by CreatePaymentRequest)");
  process.exit(1);
}

// Required by your OpenAPI: Idempotency-Key header (must be unique per logical create)
const IDEMPOTENCY_KEY = `sample-${Date.now()}-${Math.random().toString(16).slice(2)}`;

// IMPORTANT:
// Your SDK currently uses `baseUrl` as the 2nd argument to PaymentsClient,
// but PaywazClient options previously used `apiVersion`. After you apply the SDK fix,
// this works as intended.
const client = new PaywazClient({
  apiKey: API_KEY,
  baseUrl: API_BASE
});

const payload = {
  amount: AMOUNT,
  currency: CURRENCY,
  destination: DESTINATION,
  metadata: {
    source: "paywaz-samples/javascript/payments",
    createdAt: new Date().toISOString()
  }
};

try {
  const res = await client.payments.create(payload, IDEMPOTENCY_KEY);

  console.log("✅ Created payment:");
  console.log(JSON.stringify(res, null, 2));

  // Helpful hint: if the API returns an id, you can copy it into PAYWAZ_PAYMENT_ID for get-payment.mjs
  // Example: export PAYWAZ_PAYMENT_ID="<id>"
} catch (err) {
  console.error("❌ Create payment failed:");
  console.error(err?.response?.data || err);
  process.exit(1);
}
