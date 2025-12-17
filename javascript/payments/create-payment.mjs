import "dotenv/config";
import { randomUUID } from "crypto";

const API_BASE = process.env.PAYWAZ_API_BASE || "http://localhost:3000";
const API_KEY = (process.env.PAYWAZ_API_KEY || "").trim();
const VERSION = (process.env.PAYWAZ_VERSION || "2025-01-01").trim();

const DESTINATION = (process.env.PAYWAZ_DESTINATION || "").trim();
const AMOUNT = (process.env.PAYWAZ_AMOUNT || "49.99").trim();
const CURRENCY = (process.env.PAYWAZ_CURRENCY || "PZUSD").trim();

if (!API_KEY) {
  console.error('Missing PAYWAZ_API_KEY in .env');
  process.exit(1);
}
if (!DESTINATION) {
  console.error('Missing PAYWAZ_DESTINATION in .env (required by CreatePaymentRequest)');
  process.exit(1);
}

// Required by your OpenAPI: Idempotency-Key header (must be unique per logical create)
const IDEMPOTENCY_KEY = `sample-${randomUUID()}`;

const body = {
  amount: AMOUNT,
  currency: CURRENCY,
  destination: DESTINATION,
  metadata: {
    orderId: `order_${Date.now()}`,
    source: "paywaz-samples/javascript/payments",
  },
};

const res = await fetch(`${API_BASE}/payments`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
    "Paywaz-Version": VERSION,
    "Idempotency-Key": IDEMPOTENCY_KEY,
  },
  body: JSON.stringify(body),
});

const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  json = { raw: text };
}

if (!res.ok) {
  console.error(`Request failed: ${res.status} ${res.statusText}`);
  console.error(json);
  process.exit(1);
}

const payment = json?.data;
console.log("✅ Created payment:");
console.log(JSON.stringify(json, null, 2));

if (payment?.id) {
  console.log(`\nTip: set PAYWAZ_PAYMENT_ID=${payment.id} in your .env to run get-payment.mjs`);
}
