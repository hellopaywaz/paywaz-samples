# **2. `paywaz-samples/README.md` **  
A clean, organized overview of the sample integrations repo.

```markdown
# Paywaz Sample Integrations (Preview)

This repository contains **conceptual integration examples** showing how
developers may interact with the future Paywaz Public API and SDKs.

> **Important:**  
> These examples do **not** interact with real Paywaz services.  
> They are placeholders intended for architectural understanding and early
> developer planning.

---

## Repository Contents

paywaz-samples/
│
├── javascript/
│ └── simple-checkout.js # Simulated JS checkout request
│
├── python/
│ └── create-payment.py # Simulated Python payment flow
│
└── curl/
└── basic-request.sh # Conceptual cURL POST example

Each example demonstrates the structure and flow of expected integrations without
revealing internal API logic, schemas, or endpoints.

---

## Code Examples

### JavaScript (Node)
```javascript
const checkoutRequest = {
  amount: "49.99",
  currency: "PZUSD",
  metadata: { orderId: "12345" }
};

// Placeholder flow simulating a checkout session
Python
payment_request = {
    "amount": "49.99",
    "currency": "PZUSD",
    "metadata": {"orderId": "12345"}
}

Simulated API call (placeholder)

cURL
curl -X POST https://api.paywaz.com/v1/payments \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{ "amount": "49.99", "currency": "PZUSD" }'

Roadmap for Sample Integrations
v0.2

Webhook event examples

Payment status polling sample

v0.3

POS device samples

Embedded checkout integration

v0.4

Non-custodial wallet signing examples

On-chain Solana transaction helpers

v1.0 (Public API Launch)

Full suite of tested, production-ready samples

Multi-language support (JS, Python, Go, Rust)

Related Repositories
Repository	Description
paywaz-public-api	API structure + OpenAPI preview
paywaz-sdk-js	JavaScript SDK (preview)
paywaz-docs	Official documentation hub

Browse all Paywaz repos:
https://github.com/hellopaywaz

License
All examples are provided under the Paywaz Proprietary License.
See paywaz-license for full details.

Contact
For integration or partnership inquiries:
hello@paywaz.com
https://paywaz.com
