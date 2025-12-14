# Paywaz Payments (Node 20)

## Setup
```bash
cp .env.example .env
# fill PAYWAZ_API_KEY + PAYWAZ_DESTINATION
npm install
Create a payment
bash
Copy code
npm run create
Retrieve a payment
bash
Copy code
npm run get
Notes:

Idempotency-Key is required for POST /payments.

Send Paywaz-Version to pin behavior.

yaml
Copy code

---

# 2) JavaScript Webhooks Example (Raw Body + HMAC verify)

This is the “Stripe-grade” pattern: **raw request body**, constant-time compare, timestamp tolerance.

## `paywaz-samples/javascript/webhooks-node/package.json`
```json
{
  "name": "paywaz-samples-webhooks-node",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node server.mjs"
  },
  "dependencies": {
    "dotenv": "^16.4.5"
  }
}
