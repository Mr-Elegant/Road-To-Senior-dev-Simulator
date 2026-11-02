import { requirePageSession } from '@/lib/auth/server';
import LoanDashboardPage from '@/components/loan/LoanDashboardPage';

export default async function LoanManagementPage({ searchParams }: { searchParams: Promise<{ bug?: string }> }) {
  await requirePageSession('/challenges/loan-management');
  const { bug } = await searchParams;
  return <LoanDashboardPage initialBugId={typeof bug === 'string' ? bug : undefined} />;
}
