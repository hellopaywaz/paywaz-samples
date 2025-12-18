# Paywaz Payments (Node 20)

Create and retrieve payments using the Paywaz SDK sample.

## Setup

```bash
cp .env.example .env
# set PAYWAZ_API_KEY and PAYWAZ_DESTINATION (optional: PAYWAZ_AMOUNT, PAYWAZ_CURRENCY)
npm install
```

## Create a payment

```bash
npm run create
```

## Retrieve a payment

Set `PAYWAZ_PAYMENT_ID` in `.env` (tip: use the ID printed by the create script), then run:

```bash
npm run get
```

## Notes

- `Idempotency-Key` is required for `POST /payments`.
- Send `Paywaz-Version` to pin API behavior.
