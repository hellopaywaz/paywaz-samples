import crypto from "node:crypto";

/**
 * Creates Paywaz-style webhook headers per your OpenAPI:
 * - Paywaz-Timestamp: <unix_seconds>
 * - Paywaz-Signature: v1=<hex>
 * Where:
 *   signature = HMAC_SHA256(secret, `${timestamp}.${raw_body}`)
 */
export function signPaywazWebhook({ rawBody, secret, timestamp = Math.floor(Date.now() / 1000) }) {
  if (!secret) throw new Error("Missing secret");

  const payloadToSign = `${timestamp}.${rawBody}`;
  const hex = crypto.createHmac("sha256", secret).update(payloadToSign, "utf8").digest("hex");

  return {
    timestamp: String(timestamp),
    signature: `v1=${hex}`
  };
}
