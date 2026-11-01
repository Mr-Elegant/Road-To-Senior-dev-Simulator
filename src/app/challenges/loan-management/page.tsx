import { requirePageSession } from '@/lib/auth/server';
import LoanDashboardPage from '@/components/loan/LoanDashboardPage';

export default async function LoanManagementPage() {
  await requirePageSession('/challenges/loan-management');
  return <LoanDashboardPage />;
}
