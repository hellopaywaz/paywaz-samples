import crypto from "node:crypto";

/**
 * Stripe-grade scheme:
 * - Header: Paywaz-Signature: t=timestamp,v1=hexhmac
 * - Signed payload: `${timestamp}.${rawBody}`
 * - HMAC-SHA256 with webhook secret
 *
 * ⚠️ If your OpenAPI uses different header names/format, adjust here once and all samples stay correct.
 */
export function verifyPaywazWebhook({ rawBody, signatureHeader, secret, toleranceSeconds = 300 }) {
  if (!secret) throw new Error("Missing webhook secret");
  if (!signatureHeader) throw new Error("Missing Paywaz-Signature header");

  const normalizedBody = typeof rawBody === "string" ? rawBody : String(rawBody ?? "");

  const parts = Object.fromEntries(
    signatureHeader.split(",").map(kv => {
      const [k, ...rest] = kv.trim().split("=");
      return [k, rest.join("=")];
    })
  );

  const timestamp = parts.t ? Number(parts.t) : NaN;
  const v1 = parts.v1;

  if (!Number.isFinite(timestamp)) throw new Error("Invalid timestamp in signature header");
  if (!v1) throw new Error("Missing v1 signature in signature header");

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    throw new Error("Timestamp outside tolerance (possible replay)");
  }

  const signedPayload = `${timestamp}.${normalizedBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");

  // constant-time compare
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(v1, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error("Invalid signature");
  }

  return { timestamp };
}
