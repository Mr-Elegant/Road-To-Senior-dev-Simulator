/**
 * Multi-Gateway Webhook Ingestion
 */
type StripeChargeSucceeded = {
  provider: 'stripe';
  type: 'charge.succeeded';
  payload: { chargeId: string; amountInCents: number; customerId: string };
};

type StripeInvoicePaymentFailed = {
  provider: 'stripe';
  type: 'invoice.payment_failed';
  payload: { invoiceId: string; reason: string; attemptCount: number };
};

type PayPalOrderApproved = {
  provider: 'paypal';
  type: 'ORDER.APPROVED';
  payload: { orderId: string; grossAmount: string; payerEmail: string };
};

type AdyenPaymentCaptured = {
  provider: 'adyen';
  type: 'CAPTURE_SUCCESS';
  payload: { pspReference: string; originalReference: string; value: number };
};

export type WebhookEvent =
  | StripeChargeSucceeded
  | StripeInvoicePaymentFailed
  | PayPalOrderApproved
  | AdyenPaymentCaptured;

// Helper to enforce exhaustiveness at compile time
export function assertNever(value: never): never {
  throw new Error(`Unhandled union member: ${JSON.stringify(value)}`);
}

export function handleWebhookEvent(event: WebhookEvent): string {
  // TODO: Implement exhaustive handling based on discriminated union
  switch (event.type) {
    case 'charge.succeeded':
      return `Processed Stripe charge: ${event.payload.chargeId}`;
    // Complete remaining cases and exhaustiveness check
    default:
      return "unhandled";
  }
}

function solution(input) {
  const sampleEvent = {
    provider: 'stripe',
    type: 'charge.succeeded',
    payload: { chargeId: 'ch_123', amountInCents: 5000, customerId: 'cus_999' }
  };
  return handleWebhookEvent(sampleEvent);
}