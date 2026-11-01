import { Tier1Category, Tier1Question, TierInfo } from '@/types/tier1';
import { javascriptQuestions } from './javascript';
import { htmlCssQuestions } from './htmlCss';
import { reactQuestions } from './react';
import { reduxQuestions } from './redux';
import { typescriptQuestions } from './typescript';
import { nodeApiQuestions } from './nodeApi';

export const allTier1Questions: Tier1Question[] = [
  ...javascriptQuestions,
  ...htmlCssQuestions,
  ...reactQuestions,
  ...reduxQuestions,
  ...typescriptQuestions,
  ...nodeApiQuestions,
];

export const tier1QuestionMap = new Map<string, Tier1Question>(
  allTier1Questions.map((q) => [q.id, q])
);

export const TIER1_CATEGORIES: Tier1Category[] = [
  'JavaScript Fundamentals',
  'HTML and CSS',
  'React Fundamentals',
  'Redux Toolkit Fundamentals',
  'TypeScript Fundamentals',
  'Node.js and API Fundamentals',
];

export const TIERS_CATALOG: TierInfo[] = [
  {
    id: 'tier-1',
    name: 'Tier 1: Beginner',
    badge: 'Beginner Track',
    targetRole: 'Junior / Associate Full-Stack Engineer',
    experienceLevel: '0 - 2 Years',
    description:
      'Master core fundamentals across JavaScript, HTML & CSS, React, Redux Toolkit, TypeScript, and Node.js APIs with practice questions and mock interviews.',
    available: true,
    questionCountLabel: `${allTier1Questions.length} Questions`,
  },
  {
    id: 'tier-2',
    name: 'Tier 2: Intermediate',
    badge: 'Intermediate Track',
    targetRole: 'Mid-Level Full-Stack Software Engineer',
    experienceLevel: '2 - 5 Years',
    description:
      'Component lifecycle depth, state synchronization, REST & GraphQL integration, PostgreSQL query planning, and asynchronous race handling.',
    available: true,
    questionCountLabel: 'Mapped Challenges',
  },
  {
    id: 'tier-3',
    name: 'Tier 3: Advanced',
    badge: 'Advanced Track',
    targetRole: 'Senior Software Engineer (L5)',
    experienceLevel: '5 - 8 Years',
    description:
      'Performance profiling, SSR hydration boundaries, deadlock resolution, distributed caching, and micro-frontend architecture.',
    available: true,
    questionCountLabel: 'Advanced Loops',
  },
  {
    id: 'tier-4',
    name: 'Tier 4: Senior / Production-Level',
    badge: 'Senior & Staff Track',
    targetRole: 'Staff Software Architect & Lead SRE (L6+)',
    experienceLevel: '8+ Years',
    description:
      'Mission-critical production incident response, high-scale system design, blameless post-mortems, and enterprise loan management architecture.',
    available: true,
    questionCountLabel: '50 Scenarios + Simulator',
  },
];

export function getTier1QuestionsByCategory(category: Tier1Category): Tier1Question[] {
  return allTier1Questions.filter((q) => q.category === category);
}

export function getRandomTier1Question(category?: Tier1Category): Tier1Question {
  const pool = category ? getTier1QuestionsByCategory(category) : allTier1Questions;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

