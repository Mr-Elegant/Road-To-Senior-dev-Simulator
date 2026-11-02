export function handleWebhookEvent(event: WebhookEvent): string {
  switch (event.type) {
    case 'charge.succeeded':
      return `Processed Stripe charge: ${event.payload.chargeId} for ${event.payload.amountInCents} cents`;
    case 'invoice.payment_failed':
      return `Alert: Stripe invoice ${event.payload.invoiceId} failed: ${event.payload.reason}`;
    case 'ORDER.APPROVED':
      return `PayPal order ${event.payload.orderId} approved for ${event.payload.grossAmount}`;
    case 'CAPTURE_SUCCESS':
      return `Adyen capture ${event.payload.pspReference} confirmed`;
    default:
      return assertNever(event);
  }
}
