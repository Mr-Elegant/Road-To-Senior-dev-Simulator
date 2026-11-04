import InterviewPageClient from '@/components/interview/InterviewPageClient';
import { scenarioIdentities } from '@/data/catalog.server';

export default function InterviewPage() {
  return <InterviewPageClient scenarios={scenarioIdentities} />;
}
