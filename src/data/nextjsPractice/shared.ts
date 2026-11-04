import type { RubricCriteria } from '@/types/scenario';
import type {
  NextjsPracticeInfo,
  NextjsPracticeMode,
  NextjsVersionScope,
} from './types';

export const nextjsVersionSnapshot = {
  checked: '2026-11-04',
  latestStable: '16.4.5',
  maintenance15: '15.5.29',
  simulator: '16.4.3',
};
export const levels = [
  'Beginner',
  'Mid-Level',
  'Senior',
  'Staff/Principal',
] as const;
export function nextjsInfo(
  chapter: string,
  mode: NextjsPracticeMode,
  doc: string,
  verification: string[],
  versions: NextjsVersionScope = '15-and-16',
  next15?: string,
  next16?: string,
): NextjsPracticeInfo {
  return {
    order: 0,
    chapter,
    mode,
    versions,
    verification,
    next15:
      next15 ??
      (versions === '16-only'
        ? 'This stable API is a Next.js 16 exercise. Do not copy it into a 15 project; design a version-appropriate alternative and verify patch-specific types.'
        : 'Use patched Next.js 15 and the router family named by the file path. Await request APIs where the App Router contract requires it; validate behavior in a production build.'),
    next16:
      next16 ??
      'Applies to Next.js 16.4.5. Cache Components is disabled unless the exercise explicitly enables it. The simulator itself remains on 16.4.3.',
    sources: [
      { title: 'Topic documentation', url: `https://nextjs.org/docs/${doc}` },
      { title: 'Next.js 15 documentation', url: 'https://nextjs.org/docs/15' },
      {
        title: 'Next.js 15 migration',
        url: 'https://nextjs.org/docs/app/guides/upgrading/version-15',
      },
      {
        title: 'Next.js 16 migration',
        url: 'https://nextjs.org/docs/app/guides/upgrading/version-16',
      },
    ].filter(
      (source, index, sources) =>
        sources.findIndex((item) => item.url === source.url) === index,
    ),
  };
}
export function nextjsRubric(id: string, target: string): RubricCriteria[] {
  return [
    ['correctness', 'Behavior and invariant', target, 5],
    [
      'testing',
      'Evidence and counterexamples',
      'Show the authored boundary cases and distinguish policy-model evidence from real Next.js runtime evidence.',
      4,
    ],
    [
      'security',
      'Isolation and trust boundaries',
      'Explain caller validation, data exposure, authorization and the limits relevant to this task.',
      3,
    ],
    [
      'tradeoffs',
      'Versions and operational trade-offs',
      'Explain the 15/16 behavior, configuration assumptions, rollout and the interview variation.',
      3,
    ],
  ].map(([category, label, description, weight]) => ({
    id: `${id}-${category}`,
    category: category as RubricCriteria['category'],
    label: String(label),
    description: String(description),
    weight: Number(weight),
    levels: [
      {
        score: 0,
        description: 'Missing or contradicted by the implementation.',
      },
      {
        score: 1,
        description: 'Happy path only; important counterexamples remain.',
      },
      {
        score: 2,
        description:
          'Meets the stated contract with evidence and correct version assumptions.',
      },
      {
        score: 3,
        description:
          'Meets the contract and explains failure recovery, limits and the changed requirement.',
      },
    ],
  }));
}
