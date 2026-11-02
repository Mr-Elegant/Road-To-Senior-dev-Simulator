// app/billing/page.tsx (Server Component)
import { getTenantPaymentConfig } from '@/lib/payment-db';
import PaymentSettingsForm from './PaymentSettingsForm';

export default async function BillingPage({ params }) {
  const config = await getTenantPaymentConfig(params.tenantId);

  // Project only public, safe fields for client consumption
  const safeClientConfig = {
    publishableKey: config.publishableKey,
    defaultCurrency: config.currency,
    isStripeConnected: Boolean(config.secretKey),
  };

  return (
    <div>
      <h1>Billing Configuration</h1>
      <PaymentSettingsForm paymentConfig={safeClientConfig} />
    </div>
  );
}
