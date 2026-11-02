# Reference: Stripe Payment Webhook Replay & Duplicate Credit Crediting

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Payment providers like Stripe, Adyen, and PayPal operate on at-least-once delivery guarantees. If your server takes longer than their timeout (typically 3-5 seconds), or if a transient network packet drops, the webhook is retried repeatedly with exponential backoff for up to 3 days.\n      \nTwo Requirements for Safe Webhook Receivers:\n1. Signature Verification: Verify 'stripe-signature' using 'stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)'. This uses HMAC-SHA256 and timestamps to prevent webhook spoofing and replay attacks.\n2. Idempotency Key Store: Insert 'event.id' into a 'processed_webhook_events' table. If the row already exists (duplicate delivery), immediately return 200 OK and abort further processing. Wrap the insertion and the credit ledger mutation in a single atomic database transaction.",
    "codeOrArtifact": "const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);\n\nasync function handleStripeWebhookSafe(req, res, db) {\n  const sig = req.headers['stripe-signature'];\n  let event;\n\n  // 1. Cryptographic HMAC Signature Verification\n  try {\n    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);\n  } catch (err) {\n    console.error('Webhook signature verification failed:', err.message);\n    return res.status(400).send(`Webhook Error: ${err.message}`);\n  }\n\n  const client = await db.getClient();\n  await client.query('BEGIN');\n\n  try {\n    // 2. Atomic Idempotency Check with row insertion\n    const insertRes = await client.query(\n      'INSERT INTO processed_events (event_id, event_type, created_at) VALUES ($1, $2, NOW()) ON CONFLICT (event_id) DO NOTHING RETURNING event_id',\n      [event.id, event.type]\n    );\n\n    // If row was NOT inserted, this event was already processed!\n    if (insertRes.rows.length === 0) {\n      await client.query('ROLLBACK');\n      console.log(`Event ${event.id} already processed. Returning 200 OK.`);\n      return res.status(200).json({ received: true, duplicate: true });\n    }\n\n    // 3. Process business logic\n    if (event.type === 'payment_intent.succeeded') {\n      const paymentIntent = event.data.object;\n      const credits = paymentIntent.amount / 10;\n      await client.query(\n        'UPDATE users SET credit_balance = credit_balance + $1 WHERE stripe_customer_id = $2',\n        [credits, paymentIntent.customer]\n      );\n    }\n\n    await client.query('COMMIT');\n    res.status(200).json({ received: true });\n  } catch (err) {\n    await client.query('ROLLBACK');\n    console.error('Processing error:', err);\n    res.status(500).json({ error: 'Webhook processing failed' });\n  } finally {\n    client.release();\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-webhook-idempotency",
      "category": "security",
      "label": "Signature Verification & Idempotency Key Tracking",
      "description": "Implements cryptographic signature validation and transactional idempotency check.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Validates raw body HMAC signature, uses atomic DB transaction on event ID, returns 200 for duplicates."
        },
        {
          "score": 2,
          "description": "Checks event ID in Redis or DB, but forgets HMAC signature verification."
        },
        {
          "score": 0,
          "description": "Leaves handler open to duplicate execution."
        }
      ]
    }
  ],
  "alternatives": [
    "Ingesting raw webhooks into an SQS / Kafka queue immediately and returning 200 OK, delegating idempotency and processing to background workers."
  ],
  "commonMistakes": [
    "Returning 500 when a duplicate webhook arrives: this causes Stripe to keep retrying the webhook indefinitely.",
    "Checking if the event exists in Redis with GET then SET (non-atomic race condition under simultaneous retries)."
  ],
  "followUps": [
    {
      "id": "integ-fq-1",
      "question": "Why does Stripe require the raw unparsed HTTP request body for signature verification?",
      "expectedConcepts": [
        "HMAC hash is sensitive to whitespace and JSON property ordering",
        "Body parsers alter the raw byte sequence"
      ],
      "sampleStrongAnswer": "The HMAC signature is calculated by Stripe over the exact byte stream sent across the wire. If Express or Next.js parses the body into a JSON object and then re-stringifies it, differences in whitespace, indentation, or key serialization will produce a different hash, causing signature verification to fail."
    }
  ]
}
```
