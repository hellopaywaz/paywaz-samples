# Paywaz Webhooks (Node 20, raw-body verification)

Spec-accurate webhook verification using the raw request body with:

- `Paywaz-Timestamp: <unix_seconds>`
- `Paywaz-Signature: v1=<hex>`
- Signature: `HMAC_SHA256(secret, `${timestamp}.${raw_body}`)`
- Replay protection: reject if `|now - timestamp| > tolerance`

## Setup

```bash
cp .env.example .env
# set PAYWAZ_WEBHOOK_SECRET (or PAYWAZ_WEBHOOK_SECRETS for rotation)
npm install
npm start
```

## Endpoint

`POST http://localhost:8787/webhooks/payments`

## Local test (no Paywaz account required)

Terminal A (server):
```bash
npm start
```

Terminal B (send a signed test event):
```bash
npm run test:send
```

You should see `✅ Webhook verified` in Terminal A.
