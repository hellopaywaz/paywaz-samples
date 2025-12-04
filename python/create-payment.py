"""
Paywaz Sample Integration (Conceptual)
--------------------------------------
This example demonstrates a simple "create payment" flow using a placeholder
Paywaz Public API endpoint. No real API calls are made.

Replace placeholder URLs, payload structures, and authentication once
production API documentation becomes available.
"""

import json
import asyncio


# Simulated async function representing a Paywaz API POST request
async def create_payment(payload):
    print("Sending payment request to Paywaz (placeholder)...")
    print("Payload:", json.dumps(payload, indent=2))

    # Simulated network delay
    await asyncio.sleep(1)

    # Simulated API response
    return {
        "paymentId": "pay_placeholder_123",
        "status": "created",
        "amount": payload["amount"],
        "currency": payload["currency"],
        "metadata": payload.get("metadata", {}),
        "message": "This is a placeholder response from the Paywaz API."
    }


async def main():
    # Example payment request payload
    payment_request = {
        "amount": "49.99",
        "currency": "PZUSD",
        "metadata": {
            "orderId": "12345",
            "customerEmail": "customer@example.com"
        }
    }

    print("Initializing Paywaz payment (placeholder)...\n")

    response = await create_payment(payment_request)

    print("\nPayment created:")
    print(json.dumps(response, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
