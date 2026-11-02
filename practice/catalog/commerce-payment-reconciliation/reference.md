# Reference: E-commerce: Reconcile Duplicate Payment Notifications

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The starter trusts every notification and overwrites status on arrival. Validate the trusted adapter result and order facts first, then deduplicate event delivery and payment identity separately. An already-paid order receiving a new payment needs review, not another shipment. In a real receiver verify the signature on raw bytes, map the provider account and customer to the tenant, and commit the inbox record, payment ledger, order transition, and dispatch outbox atomically. Uniqueness must include provider account and payment identity. Do not acknowledge success until durable receipt; outbox consumers must also tolerate retries. Recover uncertain outcomes through provider reconciliation. Test simultaneous duplicates, a crash before commit, and a second genuine payment; monitor unmatched payments and dispatch counts. Roll out with shadow reconciliation and pause dispatch on invariant violations. [Stripe webhook guidance](https://docs.stripe.com/webhooks).",
    "codeOrArtifact": "function solution({ orders, events }) {\n  const copy = orders.map(order => ({ ...order }));\n  const seen = new Set();\n  const payments = new Map();\n  const outcomes = events.map(event => {\n    if (event.verified !== true) return \"unverified\";\n    if (![\"succeeded\", \"failed\"].includes(event.type)) return \"ignored\";\n    const order = copy.find(order => order.id === event.orderId);\n    if (!order || !Number.isSafeInteger(event.amount) || event.amount <= 0 ||\n        order.total !== event.amount || order.currency !== event.currency) return \"mismatch\";\n    if (seen.has(event.id)) return \"duplicate\";\n    if (event.type === \"succeeded\") {\n      if (payments.has(event.paymentId)) {\n        if (payments.get(event.paymentId) !== order.id) return \"conflict\";\n        seen.add(event.id);\n        return \"duplicate\";\n      }\n      if (order.status === \"paid\") return \"review\";\n      payments.set(event.paymentId, order.id);\n      order.status = \"paid\";\n      seen.add(event.id);\n      return \"paid\";\n    }\n    seen.add(event.id);\n    if (order.status === \"paid\") return \"ignored\";\n    order.status = \"failed\";\n    return \"failed\";\n  });\n  return { orders: copy, outcomes };\n}"
  },
  "rubric": [
    {
      "id": "commerce-payment-reconciliation-correctness",
      "category": "correctness",
      "weight": 5,
      "label": "Business invariant and edge cases",
      "description": "Only matching trusted events change orders, one payment cannot pay two orders, and paid state cannot regress on failure.",
      "levels": [
        {
          "score": 0,
          "description": "The original failure remains or the response is hard-coded."
        },
        {
          "score": 1,
          "description": "Happy path works; negative or replay cases fail."
        },
        {
          "score": 2,
          "description": "All fixture behaviors work, but production boundaries are unexplained."
        },
        {
          "score": 3,
          "description": "All fixture behaviors work and the business invariant is explained."
        }
      ]
    },
    {
      "id": "commerce-payment-reconciliation-production",
      "category": "reliability",
      "weight": 4,
      "label": "Production design and verification",
      "description": "Separate this deterministic model from durable storage, concurrency, authorization, and recovery requirements.",
      "levels": [
        {
          "score": 0,
          "description": "Treats an in-memory model as a production guarantee."
        },
        {
          "score": 1,
          "description": "Names a production risk without a concrete mitigation."
        },
        {
          "score": 2,
          "description": "Defines persistence and failure handling, but omits a verification or rollback plan."
        },
        {
          "score": 3,
          "description": "Defines durable invariants, failure recovery, observable verification, and safe rollout."
        }
      ]
    }
  ],
  "alternatives": [
    "Persist verified deliveries to a durable inbox and reconcile payments in a worker; acknowledge only after the inbox commit."
  ],
  "commonMistakes": [
    "Deduplicating notification IDs while allowing two events for the same payment to dispatch twice.",
    "Assuming delivery order equals payment state order."
  ],
  "followUps": [
    {
      "id": "payment-crash",
      "question": "What if the worker crashes after requesting shipment but before recording success?",
      "expectedConcepts": [
        "outbox",
        "downstream idempotency",
        "reconciliation"
      ],
      "sampleStrongAnswer": "Commit a dispatch outbox entry with the order transition. Retry it using a stable fulfillment idempotency key. If the fulfillment result is uncertain, reconcile the downstream operation before creating another shipment."
    }
  ]
}
```
