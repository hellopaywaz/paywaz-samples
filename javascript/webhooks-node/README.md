# Paywaz Webhooks (Node 20, raw-body verification)

## Setup
```bash
cp .env.example .env
# set PAYWAZ_WEBHOOK_SECRET
npm install
npm start
Endpoint
POST http://localhost:8787/webhooks/payments

Required headers (per OpenAPI)
Paywaz-Timestamp: <unix_seconds>

Paywaz-Signature: v1=<hex>

Signing:
HMAC_SHA256(secret, ${timestamp}.${raw_body})

Replay protection:
Reject if |now - timestamp| > 300 seconds.

yaml
Copy code

---

# 3) Root README to link everything

## `paywaz-samples/README.md`
```md
# Paywaz Samples

## JavaScript (Node 20)
- `javascript/payments` — Create + retrieve payments (`POST /payments`, `GET /payments/{paymentId}`)
- `javascript/webhooks-node` — Webhook receiver with raw-body signature verification (`POST /webhooks/payments`)

## Notes
- Payments require `Idempotency-Key`.
- Webhooks must be verified using the **raw** request body with:
  - `Paywaz-Timestamp`
  - `Paywaz-Signature: v1=<hex>`
