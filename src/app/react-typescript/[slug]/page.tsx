import { notFound, redirect } from 'next/navigation';
import { reactTypescriptTopics } from '@/data/reactTypescript/topics';

export default async function ReactTypescriptQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = reactTypescriptTopics.find(item => item.slug === slug);
  if (!topic) notFound();
  redirect(`/challenge/${topic.scenarioId}`);
}
