import type { Metadata } from 'next';
import { frontendPracticeTopics } from '@/data/frontendPractice';
import { FrontendPracticeLibrary } from '@/components/frontendPractice/FrontendPracticeLibrary';

export const metadata: Metadata = {
  title: 'Frontend Practice — 203 React & JavaScript Questions',
  description: 'Original practice questions, solution explanations, boundary cases, and follow-ups across 113 React and 90 JavaScript topics.',
};

export default function FrontendPracticePage() {
  return <FrontendPracticeLibrary topics={frontendPracticeTopics.map(({ answer, ...topic }) => ({ ...topic, answer: '' }))} />;
}
