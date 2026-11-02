/**
 * Vulnerable Webhook Handler: No Idempotency or Signature Verification
 */
async function handleStripeWebhook(req, res, db) {
  const event = req.body;

  // BUG 1: No Stripe-Signature cryptographic header check! Anyone can spoof events.
  // BUG 2: No idempotency check on event.id! Retried webhooks double-credit the customer.
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const customerId = paymentIntent.customer;
    const creditsToGrant = paymentIntent.amount / 10;

    await db.query(
      'UPDATE users SET credit_balance = credit_balance + $1 WHERE stripe_customer_id = $2',
      [creditsToGrant, customerId]
    );
  }

  res.status(200).json({ received: true });
}

function solution(input) {
  return "idempotent_webhook_with_signature";
}