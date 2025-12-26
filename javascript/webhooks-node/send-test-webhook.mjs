import "dotenv/config";
import crypto from "node:crypto";
import { signPaywazWebhook } from "./sign-webhook.mjs";

const SECRET = process.env.PAYWAZ_WEBHOOK_SECRET;
const PORT = Number(process.env.PORT || 8787);

// Where your local webhook receiver listens
const TARGET_URL = `http://localhost:${PORT}/webhooks/payments`;

if (!SECRET) {
  console.error("Missing PAYWAZ_WEBHOOK_SECRET in .env");
  process.exit(1);
}

// Spec-accurate example event matching your WebhookEvent schema
const event = {
  id: `evt_${crypto.randomUUID()}`,
  type: "payment.pending",
  eventVersion: "2025-01-01",
  livemode: false,
  createdAt: new Date().toISOString(),
  data: {
    payment: {
      id: `pay_${crypto.randomUUID()}`,
      status: "pending",
      amount: "49.99",
      currency: "USD",
      destination: process.env.PAYWAZ_DESTINATION || "merchant_wallet_or_destination_id",
      transactionHash: null,
      metadata: {
        source: "send-test-webhook.mjs"
      },
      createdAt: new Date().toISOString()
    }
  }
};

const rawBody = JSON.stringify(event);

const { timestamp, signature } = signPaywazWebhook({
  rawBody,
  secret: SECRET
});

console.log("Sending webhook to:", TARGET_URL);
console.log("Headers:");
console.log("  Paywaz-Timestamp:", timestamp);
console.log("  Paywaz-Signature:", signature);

const res = await fetch(TARGET_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Paywaz-Timestamp": timestamp,
    "Paywaz-Signature": signature
  },
  body: rawBody
});

const text = await res.text();
console.log("Response:", res.status, text);
