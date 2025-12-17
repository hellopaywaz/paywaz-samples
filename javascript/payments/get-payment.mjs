import "dotenv/config";

const API_BASE = process.env.PAYWAZ_API_BASE || "http://localhost:3000";
const API_KEY = (process.env.PAYWAZ_API_KEY || "").trim();
const VERSION = (process.env.PAYWAZ_VERSION || "2025-01-01").trim();

const PAYMENT_ID = (process.env.PAYWAZ_PAYMENT_ID || "").trim();

if (!API_KEY) {
  console.error("Missing PAYWAZ_API_KEY in .env");
  process.exit(1);
}
if (!PAYMENT_ID) {
  console.error("Missing PAYWAZ_PAYMENT_ID in .env (set it after running create-payment.mjs)");
  process.exit(1);
}

const res = await fetch(`${API_BASE}/payments/${encodeURIComponent(PAYMENT_ID)}`, {
  method: "GET",
  headers: {
    "X-API-Key": API_KEY,
    "Paywaz-Version": VERSION,
  },
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

console.log("✅ Retrieved payment:");
console.log(JSON.stringify(json, null, 2));
