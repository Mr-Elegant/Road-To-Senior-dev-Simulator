import type { ReactJourney } from './reactExercise';

export interface FunctionCheck {
  name: string;
  input: unknown;
  expected?: unknown;
  expectedError?: string;
}
export interface FunctionExercise {
  kind: 'javascript';
  contract: string;
  reference: string;
  tests: FunctionCheck[];
}
export interface ComponentCheck {
  name: string;
  journey: ReactJourney;
}
export interface ComponentExercise {
  kind: 'react';
  contract: string;
  reference: string;
  starter?: string;
  tests: ComponentCheck[];
}
export type FrontendExercise = FunctionExercise | ComponentExercise;
