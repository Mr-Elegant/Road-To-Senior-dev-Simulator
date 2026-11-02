// app/billing/page.tsx (Server Component)
import { getTenantPaymentConfig } from '@/lib/payment-db';
import PaymentSettingsForm from './PaymentSettingsForm';

export default async function BillingPage({ params }) {
  // Config object contains: { publishableKey: 'pk_...', secretKey: 'sk_...', webhookSecret: 'whsec_...' }
  const config = await getTenantPaymentConfig(params.tenantId);

  // VULNERABILITY: Passing entire config object to a "use client" component
  // Next.js serializes all props into window.__next_f, leaking the private secret key!
  return (
    <div>
      <h1>Billing Configuration</h1>
      <PaymentSettingsForm paymentConfig={config} />
    </div>
  );
}

function solution(input) {
  return "isolated_server_boundary";
}