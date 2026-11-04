import ProgressPageClient from '@/components/progress/ProgressPageClient';
import { scenarioIdentities } from '@/data/catalog.server';

export default function ProgressPage() {
  return <ProgressPageClient scenarios={scenarioIdentities} />;
}
