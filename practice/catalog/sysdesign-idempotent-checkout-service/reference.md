# Reference: High-Volume Idempotent Checkout & Order Processing System

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "System Architecture:\n1. Client Idempotency:\n- Frontend generates a UUIDv4 'Idempotency-Key' when loading checkout review page.\n- Sent in HTTP header: 'Idempotency-Key: 7b8f9e...'.\n- Checkout Service checks Redis for active lock: 'SET lock:checkout:{idempotencyKey} 1 NX PX 15000'. If locked, returns 409 Conflict / 202 In Progress.\n\n2. Inventory Reservation (Two-Phase):\n- Reserve items with a 10-minute TTL:\n  'UPDATE inventory SET available = available - $qty, reserved = reserved + $qty WHERE product_id = $id AND available >= $qty'\n- Store reservation record with 'expires_at = NOW() + INTERVAL '10 minutes''.\n- A background worker scans expired reservations and returns stock to 'available' if payment never completes.\n\n3. Payment Gateway Dispatch:\n- Order status set to 'PAYMENT_PENDING'.\n- Dispatch request to Stripe API forwarding the same 'Idempotency-Key'. Stripe guarantees that even if our network connection drops, retrying with the same key returns the existing Charge object without charging the card again.\n\n4. Transactional Outbox Pattern:\n- Avoid the Dual-Write Bug! (If you write to Postgres then call Kafka.send(), the app can crash in between, losing the event).\n- In a single SQL transaction:\n  1. INSERT into 'orders'\n  2. INSERT into 'payments'\n  3. INSERT into 'outbox_events' (topic, payload)\n- A Debezium Change-Data-Capture (CDC) connector or reliable worker reads the outbox table and streams events to Kafka reliably.\n\n5. Webhook & Reconciliation:\n- Payment webhook updates payment status to 'CONFIRMED'.\n- Nightly reconciliation cron queries Stripe API for all charges in the last 24h and compares against local database ledger to catch any orphaned states.",
    "codeOrArtifact": "Checkout State Machine:\n[CART] \n  │ (User clicks \"Place Order\")\n  ▼\n[RESERVING_INVENTORY] ──(Out of Stock)──► [FAILED_OUT_OF_STOCK]\n  │ (Stock Locked for 10m)\n  ▼\n[AUTHORIZING_PAYMENT] ──(Card Declined)─► [FAILED_PAYMENT] ──► Release Inventory\n  │ (Stripe Charge Succeeded)\n  ▼\n[ORDER_CONFIRMED] ──► Transactional Outbox ──► Kafka: order.created\n  │\n  ▼\n[FULFILLMENT_PROCESSING]"
  },
  "rubric": [
    {
      "id": "rb-checkout-idempotency",
      "category": "correctness",
      "label": "End-to-End Idempotency & Concurrency Guards",
      "description": "Implements client idempotency tokens, database unique keys, and gateway idempotency forwarding.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Comprehensive idempotency from client header to DB unique constraint to Stripe Idempotency-Key."
        },
        {
          "score": 2,
          "description": "Uses Redis lock but misses database unique constraint fallback."
        },
        {
          "score": 0,
          "description": "No idempotency mechanism."
        }
      ]
    },
    {
      "id": "rb-outbox-pattern",
      "category": "reliability",
      "label": "Transactional Outbox & Dual-Write Avoidance",
      "description": "Avoids dual-write problem between database and message broker using Outbox pattern.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Accurately articulates dual-write failure mode and uses Transactional Outbox / CDC."
        },
        {
          "score": 1,
          "description": "Suggests writing to DB and then calling kafka.send() in application code."
        },
        {
          "score": 0,
          "description": "Unaware of dual-write problem."
        }
      ]
    }
  ],
  "alternatives": [
    "Saga Pattern (Choreography or Orchestration using Temporal) for distributed compensation transactions across microservices."
  ],
  "commonMistakes": [
    "Deducting permanent inventory before confirming payment: carts that abandon payment leave shelves empty.",
    "Performing dual writes (DB update followed by message bus publish) without Outbox pattern, leading to data loss on network partition."
  ],
  "followUps": [
    {
      "id": "sys-fq-2",
      "question": "What is the Dual-Write problem in distributed systems and how does the Outbox Pattern solve it?",
      "expectedConcepts": [
        "Writing to DB and Kafka cannot be atomic across network",
        "App crash between writes causes desynchronization",
        "Outbox pattern puts events in same DB transaction"
      ],
      "sampleStrongAnswer": "The Dual-Write problem occurs when an application updates a database and publishes an event to a message broker (like Kafka) sequentially. Because these two systems do not share an atomic distributed transaction, if the application crashes after updating the database but before publishing to Kafka, the message is permanently lost. The Outbox pattern writes the event into an `outbox` table inside the exact same local database transaction, guaranteeing atomic consistency."
    }
  ]
}
```
