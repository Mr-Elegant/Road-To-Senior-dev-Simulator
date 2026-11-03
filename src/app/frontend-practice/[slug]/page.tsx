import { notFound, redirect } from 'next/navigation';
import { getFrontendPracticeTopic } from '@/data/frontendPractice';

export default async function FrontendQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getFrontendPracticeTopic(slug);
  if (!topic) notFound();
  redirect(`/challenge/${topic.scenarioId}`);
}
