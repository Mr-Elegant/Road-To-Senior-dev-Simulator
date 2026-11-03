import type { Metadata } from 'next';
import { reactTypescriptTopics } from '@/data/reactTypescript';
import { FrontendPracticeLibrary } from '@/components/frontendPractice/FrontendPracticeLibrary';

export const metadata: Metadata = { title: 'React + TypeScript — 113 Coding Challenges', description: 'All React practice topics converted to typed TSX with strict type checking, component previews, behavioral tests and local IDE copies.' };
export default function ReactTypescriptPage() {
  return <FrontendPracticeLibrary typescript topics={reactTypescriptTopics.map(topic => ({ ...topic, answer: '' }))} />;
}
