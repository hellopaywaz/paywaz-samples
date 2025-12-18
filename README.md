# Paywaz Sample Integrations

Lightweight, runnable examples demonstrating the **Paywaz Public API** and the **Paywaz SDK**.

- ✅ JavaScript samples use the SDK package name: `@paywaz/sdk`
- ✅ Node 20+ recommended for consistent execution

---

## Samples

### JavaScript (Node 20+)
- `javascript/payments` — create and fetch payments
- `javascript/webhooks-express` — webhook receiver + signature verification
- `javascript/webhooks-node` — raw-body webhook receiver with secret rotation and replay protection
- `javascript/nextjs-webhook` — framework-specific webhook handler
- `javascript/simple-checkout.js` — minimal placeholder checkout flow

### Python
- `python/create-payment.py` — create a payment (placeholder flow)

### cURL
- `curl/basic-request.sh` — simple request example for quick testing and debugging

---

## Getting started (Node 20+)

From the repo root:

```bash
node -v

# copy env template (pick the right path for the sample you run)
cp .env.example .env

# run a sample (example: javascript/payments)
cd javascript/payments
npm install
npm run start
```

---

## Requirements
- API Key (coming soon)
- Node.js 18+
- Python 3.10+

---

## Roadmap
Coming soon:
- React example
- POS terminal integration demo
- Shopify & WooCommerce plugin samples
- Solana wallet request flow

---

## Resources
- API Reference: https://github.com/hellopaywaz/paywaz-public-api
- Docs: https://github.com/hellopaywaz/paywaz-docs
- Website: https://paywaz.com

---

⚠ These samples are for demonstration only.
Do not use in production without proper security hardening.

Paywaz.com LLC — *Zero-Fee Crypto-Native Payments.*
