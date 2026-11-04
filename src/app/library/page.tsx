import LibraryPageClient from '@/components/library/LibraryPageClient';
import { scenarioSummaries } from '@/data/catalog.server';

export default function LibraryPage() {
  return <LibraryPageClient scenarios={scenarioSummaries} />;
}
