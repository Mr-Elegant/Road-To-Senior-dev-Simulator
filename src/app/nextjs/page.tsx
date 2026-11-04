import type { Metadata } from 'next';
import {
  nextjsPracticeScenarios,
  nextjsVersionSnapshot,
} from '@/data/nextjsPractice';
import { NextjsPracticeLibrary } from '@/components/nextjsPractice/NextjsPracticeLibrary';

export const metadata: Metadata = {
  title: 'Next.js Engineering Lab — 110 Challenges',
  description:
    'Beginner to architect Next.js 15 and 16 practice: coding policies, framework reviews, architecture, version comparisons and interview variations.',
};
export default function NextjsPage() {
  const topics = nextjsPracticeScenarios.map((scenario) => ({
    id: scenario.id,
    title: scenario.title,
    description:
      scenario.problemStatement.length > 190
        ? scenario.problemStatement.slice(0, 187) + '…'
        : scenario.problemStatement,
    difficulty: scenario.difficulty,
    minutes: scenario.estimatedMinutes,
    chapter: scenario.nextjsPractice!.chapter,
    order: scenario.nextjsPractice!.order,
    mode: scenario.nextjsPractice!.mode,
    versions: scenario.nextjsPractice!.versions,
  }));
  return (
    <NextjsPracticeLibrary topics={topics} snapshot={nextjsVersionSnapshot} />
  );
}
