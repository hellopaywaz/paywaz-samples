# Paywaz Webhooks (Node 20, raw-body verification)

This sample implements spec-accurate webhook verification for:

- `Paywaz-Timestamp: <unix_seconds>`
- `Paywaz-Signature: v1=<hex>`
- `signature = HMAC_SHA256(secret, `${timestamp}.${raw_body}`)`
- Replay protection: reject if `|now - timestamp| > 300 seconds`

## Setup

```bash
cp .env.example .env
# set PAYWAZ_WEBHOOK_SECRET
npm install
npm start
Endpoint
POST:
http://localhost:8787/webhooks/payments

Local test (no Paywaz needed)
Terminal A (server):

bash
Copy code
npm start
Terminal B (send a signed test event):

bash
Copy code
npm run test:send
You should see ✅ Webhook verified in Terminal A.

yaml
Copy code

---

## ✅ Fixed root `paywaz-samples/README.md`

Copy/paste **this entire file**:

```md
# Paywaz Samples

Runnable integration examples for the Paywaz Public API.

## JavaScript (Node 20)

- `javascript/payments` — Create + retrieve payments (`POST /payments`, `GET /payments/{paymentId}`)
- `javascript/webhooks-node` — Webhook receiver with raw-body signature verification (`POST /webhooks/payments`)

## Notes

- Payments require `Idempotency-Key`.
- Webhooks must be verified using the **raw** request body with:
  - `Paywaz-Timestamp`
  - `Paywaz-Signature: v1=<hex>`
- Webhooks should implement replay protection (reject if `|now - timestamp| > 300 seconds`).
