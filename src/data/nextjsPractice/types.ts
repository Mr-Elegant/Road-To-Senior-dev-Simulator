import type { Difficulty } from '@/types/scenario';

export type NextjsVersionScope = '15-and-16' | '15-to-16' | '16-only';
export type NextjsPracticeMode = 'policy' | 'framework-review' | 'architecture';
export interface NextjsPracticeInfo {
  order: number;
  chapter: string;
  mode: NextjsPracticeMode;
  versions: NextjsVersionScope;
  next15: string;
  next16: string;
  verification: string[];
  sources: { title: string; url: string }[];
}
export interface ReviewDefinition {
  slug: string;
  title: string;
  difficulty: Difficulty;
  chapter: string;
  file: string;
  broken: string;
  fixed: string;
  explanation: string;
  checks: string[];
  tweak: string;
  answer: string;
  doc: string;
  versions?: NextjsVersionScope;
  next15?: string;
  next16?: string;
}
export interface DesignDefinition {
  slug: string;
  title: string;
  chapter: string;
  situation: string;
  scale: string;
  requirements: string[];
  design: string;
  failure: string;
  verification: string[];
  tweak: string;
  answer: string;
  doc: string;
}
