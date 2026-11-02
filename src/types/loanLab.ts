export type LoanLabKind = 'reducer' | 'fetch-gate' | 'sort' | 'selector' | 'refresh';

export interface LoanLabTest {
  id: string;
  name: string;
  sample?: boolean;
  input: Record<string, unknown>;
  expected: unknown;
  explanation: string;
}

export interface LoanLabExercise {
  bugId: string;
  title: string;
  entryPoint: string;
  kind: LoanLabKind;
  contract: string;
  starterCode: string;
  referenceCode: string;
  hints: string[];
  tests: LoanLabTest[];
}

export interface LoanLabResult {
  testId: string;
  name: string;
  passed: boolean;
  actual?: unknown;
  error?: string;
  logs: string[];
}

export interface LoanLabRun {
  mode: 'sample' | 'submit';
  results: LoanLabResult[];
  passed: number;
  total: number;
  durationMs: number;
}
