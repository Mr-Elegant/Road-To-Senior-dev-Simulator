import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import { scenarioSummaries } from '@/data/catalog.server';

export default function DashboardPage() {
  return <DashboardPageClient scenarios={scenarioSummaries} />;
}
