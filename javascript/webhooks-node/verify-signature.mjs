import crypto from "node:crypto";

/**
 * Enterprise-grade, spec-accurate verification for Paywaz:
 *
 * Headers:
 *  - Paywaz-Timestamp: <unix_seconds>
 *  - Paywaz-Signature: v1=<hex>
 *
 * signature = HMAC_SHA256(secret, `${timestamp}.${raw_body}`)
 *
 * Hardening:
 * - Secret rotation: supports multiple secrets (primary + previous)
 * - Clock skew tolerance: configurable
 * - Constant-time comparison
 */
export function verifyPaywazWebhook({
  rawBody,
  timestampHeader,
  signatureHeader,
  secrets,
  toleranceSeconds = 300
}) {
  if (!timestampHeader) throw new Error("Missing Paywaz-Timestamp header");
  if (!signatureHeader) throw new Error("Missing Paywaz-Signature header");

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) throw new Error("Invalid Paywaz-Timestamp header");

  // Spec: "v1=<hex>"
  const match = /^v1=([0-9a-fA-F]+)$/.exec(signatureHeader.trim());
  if (!match) throw new Error("Invalid Paywaz-Signature format (expected v1=<hex>)");
  const providedHex = match[1];

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    throw new Error("Timestamp outside tolerance (possible replay)");
  }

  if (!Array.isArray(secrets) || secrets.length === 0) {
    throw new Error("No webhook secrets configured");
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const provided = Buffer.from(providedHex, "hex");

  // Try each secret (rotation support)
  for (let i = 0; i < secrets.length; i++) {
    const secret = secrets[i];
    const expectedHex = crypto
      .createHmac("sha256", secret)
      .update(signedPayload, "utf8")
      .digest("hex");

    const expected = Buffer.from(expectedHex, "hex");
    if (expected.length === provided.length && crypto.timingSafeEqual(expected, provided)) {
      return { timestamp, secretIndex: i };
    }
  }

  throw new Error("Invalid signature");
}
