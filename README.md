# Paywaz Sample Integrations

This repository contains lightweight, runnable examples demonstrating how to use the **Paywaz Public API** and the **Paywaz SDK**.

✅ **JavaScript samples use the SDK package name:** `@paywaz/sdk`  
✅ **Node 20+ recommended** for consistent execution

---

## Samples

### JavaScript (Node 20+)
- `javascript/payments` — create + fetch payment
- `javascript/webhooks-express` — webhook receiver + signature verification
- `javascript/nextjs-webhook` — framework-specific webhook handler

### Python
- `python/payments` — create + fetch payment
- `python/webhooks-fastapi` — webhook receiver + signature verification

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

### **cURL**
Simple request examples for quick testing and debugging.

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
