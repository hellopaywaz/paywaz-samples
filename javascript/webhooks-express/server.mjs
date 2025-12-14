import "dotenv/config";
import http from "node:http";
import { verifyPaywazWebhook } from "./verify-signature.mjs";

const PORT = Number(process.env.PORT || 8787);
const SECRET = process.env.PAYWAZ_WEBHOOK_SECRET;

if (!SECRET) {
  console.error("Missing PAYWAZ_WEBHOOK_SECRET in .env");
  process.exit(1);
}

// Minimal server that reads raw body (no JSON parser) so signatures verify reliably.
const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/webhooks/paywaz") {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");

  // Node lowercases all header keys internally
  const signatureHeader = req.headers["paywaz-signature"];

  try {
    verifyPaywazWebhook({
      rawBody,
      signatureHeader,
      secret: SECRET,
      toleranceSeconds: 300
    });

    const event = JSON.parse(rawBody);

    // Stripe-grade: acknowledge quickly, do work async
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ received: true }));

    console.log("✅ Webhook verified:", {
      type: event?.type,
      id: event?.id
    });

    // TODO: route by event.type (payment.succeeded, payment.failed, etc.)
  } catch (err) {
    console.error("❌ Webhook rejected:", err?.message || err);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid webhook signature" }));
  }
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: POST /webhooks/paywaz`);
});
