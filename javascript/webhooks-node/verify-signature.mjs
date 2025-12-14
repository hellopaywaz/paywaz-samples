import crypto from "node:crypto";

/**
 * Spec-accurate verification for your OpenAPI:
 *
 * Headers:
 *  - Paywaz-Timestamp: <unix_seconds>
 *  - Paywaz-Signature: v1=<hex>
 *
 * signature = HMAC_SHA256(secret, `${timestamp}.${raw_body}`)
 * Replay: reject if |now - timestamp| > 300 seconds
 */
export function verifyPaywazWebhook({
  rawBody,
  timestampHeader,
  signatureHeader,
  secret,
  toleranceSeconds = 300
}) {
  if (!timestampHeader) throw new Error("Missing Paywaz-Timestamp header");
  if (!signatureHeader) throw new Error("Missing Paywaz-Signature header");

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) throw new Error("Invalid Paywaz-Timestamp header");

  // Expect: "v1=<hex>"
  const match = /^v1=([0-9a-fA-F]+)$/.exec(signatureHeader.trim());
  if (!match) throw new Error("Invalid Paywaz-Signature format (expected v1=<hex>)");

  const providedHex = match[1];

  // Replay protection
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    throw new Error("Timestamp outside tolerance (possible replay)");
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedHex = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  // Constant-time compare
  const expected = Buffer.from(expectedHex, "hex");
  const provided = Buffer.from(providedHex, "hex");

  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    throw new Error("Invalid signature");
  }

  return { timestamp };
}
