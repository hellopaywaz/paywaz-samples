import "dotenv/config";

const API_BASE = process.env.PAYWAZ_API_BASE || "https://api.paywaz.com";
const API_KEY = process.env.PAYWAZ_API_KEY;
const VERSION = process.env.PAYWAZ_VERSION || "2025-01-01";
const DESTINATION = process.env.PAYWAZ_DESTINATION;

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

const payload = {
  // matches CreatePaymentRequest schema
  amount: "49.99",
  currency: "USD",
  destination: DESTINATION,
  autoConvert: false,
  metadata: {
    invoiceId: `INV-${Math.floor(Math.random() * 1_000_000)}`,
    source: "paywaz-samples/javascript/payments"
  }
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

const servedVersion = res.headers.get("paywaz-version");
const text = await res.text();
let json;
try { json = JSON.parse(text); } catch { json = { raw: text }; }

if (!res.ok) {
  console.error("❌ Create payment failed:", res.status);
  if (servedVersion) console.error("Served Paywaz-Version:", servedVersion);
  console.error(JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log("✅ Payment created");
if (servedVersion) console.log("Served Paywaz-Version:", servedVersion);
console.log(JSON.stringify(json, null, 2));

console.log("\nNext:");
console.log("1) Copy the payment id (json.id)");
console.log("2) Put it into PAYWAZ_PAYMENT_ID in your .env");
console.log("3) Run: npm run get");
