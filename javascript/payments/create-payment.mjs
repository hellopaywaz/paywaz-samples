import "dotenv/config";
import { randomUUID } from "crypto";
import { PaywazClient } from "@paywaz/sdk";

const API_KEY = (process.env.PAYWAZ_API_KEY || "").trim();
const VERSION = (process.env.PAYWAZ_VERSION || "2025-01-01").trim();

const DESTINATION = (process.env.PAYWAZ_DESTINATION || "").trim();
const AMOUNT = (process.env.PAYWAZ_AMOUNT || "49.99").trim();
const CURRENCY = (process.env.PAYWAZ_CURRENCY || "PZUSD").trim();

if (!API_KEY) {
  console.error("Missing PAYWAZ_API_KEY in .env");
  process.exit(1);
}
if (!DESTINATION) {
  console.error("Missing PAYWAZ_DESTINATION in .env");
  process.exit(1);
}

const IDEMPOTENCY_KEY = `sample-${randomUUID()}`;

const client = new PaywazClient({
  apiKey: API_KEY,
  apiVersion: VERSION
});

const payload = {
  amount: AMOUNT,
  currency: CURRENCY,
  destination: DESTINATION,
  metadata: {
    orderId: `order_${Date.now()}`,
    source: "paywaz-samples/javascript/payments"
  }
};

try {
  // If your SDK uses different names, change these:
  const result = await client.payments.create(payload, {
    idempotencyKey: IDEMPOTENCY_KEY,
    paywazVersion: VERSION
  });

  console.log("✅ Created payment:");
  console.log(JSON.stringify(result, null, 2));

  const paymentId = result?.data?.id || result?.id;
  if (paymentId) {
    console.log(`\nTip: set PAYWAZ_PAYMENT_ID=${paymentId} in your .env to run get-payment.mjs`);
  }
} catch (err) {
  console.error("❌ Create failed:");
  console.error(err?.response?.data || err);
  process.exit(1);
}
