# Paywaz Payments (Node)

## Run
```bash
cp .env.example .env
npm install
npm run create
# copy the returned id into PAYWAZ_PAYMENT_ID
npm run get

Notes:

Always send Paywaz-Version.
Always send Idempotency-Key for create endpoints.
Adjust payload fields to match your OpenAPI schema.

yaml
Copy code

---

## B) Webhooks example (Express-like, but no framework dependency)
This is the “trust maker”: raw body + HMAC + timestamp tolerance.

### `javascript/webhooks-express/package.json`
```json
{
  "name": "paywaz-samples-webhooks",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node server.mjs"
  },
  "dependencies": {
    "dotenv": "^16.4.5"
  }
}
