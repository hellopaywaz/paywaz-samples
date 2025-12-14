import "dotenv/config";

const API_BASE = process.env.PAYWAZ_API_BASE || "https://api.paywaz.com";
const API_KEY = process.env.PAYWAZ_API_KEY;
const VERSION = process.env.PAYWAZ_VERSION || "2025-01-01";

if (!API_KEY) {
  console.error("Missing PAYWAZ_API_KEY in .env");
  process.exit(1);
}

// Stripe-grade habit: always send an idempotency key for creates.
const IDEMPOTENCY_KEY = `sample-${Date.now()}`;

const payload = {
  // ⚠️ Adjust fields to match your OpenAPI schema.
  // Keep the example minimal + obvious.
  amount: 49.99,
  currency: "USD",
  description: "Paywaz sample payment",
  reference: `INV-${Math.floor(Math.random() * 1_000_000)}`
};

const res = await fetch(`${API_BASE}/payments`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "Paywaz-Version": VERSION,
    "Idempotency-Key": IDEMPOTENCY_KEY
  },
  body: JSON.stringify(payload)
});

const text = await res.text();
let json;
try { json = JSON.parse(text); } catch { json = { raw: text }; }

if (!res.ok) {
  console.error("Create payment failed:", res.status, json);
  process.exit(1);
}

console.log("✅ Created payment:");
console.log(JSON.stringify(json, null, 2));
console.log("\nSave this id into PAYWAZ_PAYMENT_ID for the get example.");
