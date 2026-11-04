import { notFound } from 'next/navigation';
import { getScenarioById } from '@/data';
import ChallengeWorkspace from '@/components/workspace/ChallengeWorkspace';

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scenario = getScenarioById(id);
  if (!scenario) notFound();
  return <ChallengeWorkspace key={id} scenario={scenario} />;
}
