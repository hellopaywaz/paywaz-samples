import "dotenv/config";
import http from "node:http";
import { verifyPaywazWebhook } from "./verify-signature.mjs";

const PORT = Number(process.env.PORT || 8787);
const SECRET = process.env.PAYWAZ_WEBHOOK_SECRET;

if (!SECRET) {
  console.error("Missing PAYWAZ_WEBHOOK_SECRET in .env");
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/webhooks/payments") {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  // IMPORTANT: read raw body exactly as received
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
      secret: SECRET,
      toleranceSeconds: 300
    });

    // If verification passes, parse JSON
    const event = JSON.parse(rawBody);

    // Stripe-grade: ACK quickly, process async
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ received: true }));

    console.log("✅ Webhook verified");
    console.log("Event:", {
      id: event?.id,
      type: event?.type,
      eventVersion: event?.eventVersion,
      livemode: event?.livemode,
      createdAt: event?.createdAt
    });

    // TODO: route by event.type (payment.pending/confirmed/settled/failed)
    // TODO: idempotency: store event.id as processed to avoid double-processing
  } catch (err) {
    console.error("❌ Webhook rejected:", err?.message || err);

    // Spec distinguishes 400 vs 401; we return 401 for signature failures
    const status =
      (err?.message || "").toLowerCase().includes("signature") ||
      (err?.message || "").toLowerCase().includes("timestamp")
        ? 401
        : 400;

    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid webhook" }));
  }
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/webhooks/payments`);
});
