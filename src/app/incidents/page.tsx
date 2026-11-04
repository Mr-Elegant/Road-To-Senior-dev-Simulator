import IncidentsPageClient from '@/components/incidents/IncidentsPageClient';
import { scenarioSummaries } from '@/data/catalog.server';

export default function IncidentsPage() {
  return <IncidentsPageClient scenarios={scenarioSummaries.filter(scenario => scenario.incidentStageCount > 0)} />;
}
