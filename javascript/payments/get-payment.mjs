import "dotenv/config";

const API_BASE = process.env.PAYWAZ_API_BASE || "https://api.paywaz.com";
const API_KEY = process.env.PAYWAZ_API_KEY;
const VERSION = process.env.PAYWAZ_VERSION || "2025-01-01";
const PAYMENT_ID = process.env.PAYWAZ_PAYMENT_ID;

if (!API_KEY) {
  console.error("Missing PAYWAZ_API_KEY in .env");
  process.exit(1);
}
if (!PAYMENT_ID) {
  console.error("Missing PAYWAZ_PAYMENT_ID in .env (set it after running create)");
  process.exit(1);
}

const res = await fetch(`${API_BASE}/payments/${encodeURIComponent(PAYMENT_ID)}`, {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Paywaz-Version": VERSION
  }
});

const text = await res.text();
let json;
try { json = JSON.parse(text); } catch { json = { raw: text }; }

if (!res.ok) {
  console.error("Get payment failed:", res.status, json);
  process.exit(1);
}

console.log("✅ Payment status:");
console.log(JSON.stringify(json, null, 2));
