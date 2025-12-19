import assert from "node:assert/strict";
import { test } from "node:test";
import { signPaywazWebhook } from "../sign-webhook.mjs";
import { verifyPaywazWebhook } from "../verify-signature.mjs";

test("sign + verify succeeds with rotation support", () => {
  const rawBody = JSON.stringify({ hello: "world" });
  const timestamp = 1_700_000_000;
  const secrets = ["whsec_current", "whsec_previous"];

  const { signature } = signPaywazWebhook({
    rawBody,
    secret: secrets[0],
    timestamp
  });

  const originalNow = Date.now;
  Date.now = () => timestamp * 1000;

  try {
    const result = verifyPaywazWebhook({
      rawBody,
      timestampHeader: String(timestamp),
      signatureHeader: signature,
      secrets,
      toleranceSeconds: 300
    });

    assert.equal(result.secretIndex, 0);
    assert.equal(result.timestamp, timestamp);
  } finally {
    Date.now = originalNow;
  }
});

test("verifies signatures created with previous secrets", () => {
  const rawBody = JSON.stringify({ id: "evt_123" });
  const timestamp = 1_700_000_123;
  const secrets = ["whsec_rotated", "whsec_old"];

  const { signature } = signPaywazWebhook({
    rawBody,
    secret: secrets[1],
    timestamp
  });

  const originalNow = Date.now;
  Date.now = () => timestamp * 1000;

  try {
    const result = verifyPaywazWebhook({
      rawBody,
      timestampHeader: String(timestamp),
      signatureHeader: signature,
      secrets,
      toleranceSeconds: 300
    });

    assert.equal(result.secretIndex, 1);
  } finally {
    Date.now = originalNow;
  }
});

test("rejects stale timestamps", () => {
  const rawBody = "{}";
  const timestamp = 1_700_000_000;
  const { signature } = signPaywazWebhook({
    rawBody,
    secret: "whsec_expired",
    timestamp
  });

  const originalNow = Date.now;
  Date.now = () => (timestamp + 1000) * 1000;

  try {
    assert.throws(() =>
      verifyPaywazWebhook({
        rawBody,
        timestampHeader: String(timestamp),
        signatureHeader: signature,
        secrets: ["whsec_expired"],
        toleranceSeconds: 300
      })
    );
  } finally {
    Date.now = originalNow;
  }
});
