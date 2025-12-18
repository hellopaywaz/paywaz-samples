import "dotenv/config";
import http from "node:http";
import { verifyPaywazWebhook } from "./verify-signature.mjs";

const PORT = Number(process.env.PORT || 8787);

// Support rotation via PAYWAZ_WEBHOOK_SECRETS="whsec_current,whsec_previous"
const SECRETS = (process.env.PAYWAZ_WEBHOOK_SECRETS || process.env.PAYWAZ_WEBHOOK_SECRET || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const TOLERANCE_SECONDS = Number(process.env.PAYWAZ_WEBHOOK_TOLERANCE_SECONDS || 300);

// Event idempotency window (store processed event IDs)
// In production: use Redis SET NX EX (snippet below)
const DEDUP_TTL_SECONDS = Number(process.env.PAYWAZ_WEBHOOK_DEDUP_TTL_SECONDS || 86400); // 24h

if (SECRETS.length === 0) {
  console.error("Missing PAYWAZ_WEBHOOK_SECRET or PAYWAZ_WEBHOOK_SECRETS in .env");
  process.exit(1);
}

// In-memory dedupe: eventId -> expiresAtEpochMs
const seen = new Map();

function markSeen(eventId) {
  const expiresAt = Date.now() + DEDUP_TTL_SECONDS * 1000;
  seen.set(eventId, expiresAt);
}

function isSeen(eventId) {
  const expiresAt = seen.get(eventId);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    seen.delete(eventId);
    return false;
  }
  return true;
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  for (const [id, expiresAt] of seen.entries()) {
    if (now > expiresAt) seen.delete(id);
  }
}, 60_000).unref();

async function handleEvent(event) {
  // TODO: route by event.type
  // payment.pending | payment.confirmed | payment.settled | payment.failed
  console.log("🔧 Processing event async:", {
    id: event?.id,
    type: event?.type,
    createdAt: event?.createdAt
  });

  // Example: act on event
  const payment = event?.data?.payment;
  if (payment) {
    console.log("Payment:", {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency
    });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/webhooks/payments") {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  // Read raw body exactly as received
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");

  // Node lowercases header names internally
  const timestampHeader = req.headers["paywaz-timestamp"];
  const signatureHeader = req.headers["paywaz-signature"];

  try {
    verifyPaywazWebhook({
      rawBody,
      timestampHeader,
      signatureHeader,
      secrets: SECRETS,
      toleranceSeconds: TOLERANCE_SECONDS
    });

    const event = JSON.parse(rawBody);

    // Idempotency: ignore duplicate deliveries (ACK 200)
    if (event?.id && isSeen(event.id)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ received: true, duplicate: true }));
      return;
    }

    if (event?.id) markSeen(event.id);

    // ACK immediately (enterprise pattern)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ received: true }));

    // Process asynchronously
    setImmediate(() => {
      handleEvent(event).catch(err => console.error("Async handler failed:", err));
    });
  } catch (err) {
    console.error("❌ Webhook rejected:", err?.message || err);

    const msg = String(err?.message || "").toLowerCase();
    const status = msg.includes("signature") || msg.includes("timestamp") ? 401 : 400;

    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid webhook" }));
  }
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/webhooks/payments`);
  console.log(`Tolerance seconds: ${TOLERANCE_SECONDS}`);
  console.log(`Dedup TTL seconds: ${DEDUP_TTL_SECONDS}`);
  console.log(`Secrets loaded: ${SECRETS.length} (rotation supported)`);
});

/**
 * Production idempotency (recommended):
 *
 * Redis example:
 *  - key: `paywaz:webhook:event:${event.id}`
 *  - command: SET key "1" NX EX 86400
 *
 * If SET returns null -> already processed -> ACK 200 and stop.
 */
