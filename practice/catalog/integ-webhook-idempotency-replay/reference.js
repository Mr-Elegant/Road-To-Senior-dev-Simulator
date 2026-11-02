const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function handleStripeWebhookSafe(req, res, db) {
  const sig = req.headers['stripe-signature'];
  let event;

  // 1. Cryptographic HMAC Signature Verification
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const client = await db.getClient();
  await client.query('BEGIN');

  try {
    // 2. Atomic Idempotency Check with row insertion
    const insertRes = await client.query(
      'INSERT INTO processed_events (event_id, event_type, created_at) VALUES ($1, $2, NOW()) ON CONFLICT (event_id) DO NOTHING RETURNING event_id',
      [event.id, event.type]
    );

    // If row was NOT inserted, this event was already processed!
    if (insertRes.rows.length === 0) {
      await client.query('ROLLBACK');
      console.log(`Event ${event.id} already processed. Returning 200 OK.`);
      return res.status(200).json({ received: true, duplicate: true });
    }

    // 3. Process business logic
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const credits = paymentIntent.amount / 10;
      await client.query(
        'UPDATE users SET credit_balance = credit_balance + $1 WHERE stripe_customer_id = $2',
        [credits, paymentIntent.customer]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ received: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  } finally {
    client.release();
  }
}
