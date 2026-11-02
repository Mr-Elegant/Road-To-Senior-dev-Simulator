import type { LoanLabExercise } from '@/types/loanLab';

export interface LoanLabDraft {
  version: 1;
  code: string;
  elapsedSeconds: number;
  hintsRevealed: number;
  referenceRevealed: boolean;
}

export function freshLoanLabDraft(exercise: LoanLabExercise): LoanLabDraft {
  return { version: 1, code: exercise.starterCode, elapsedSeconds: 0, hintsRevealed: 0, referenceRevealed: false };
}

export function parseLoanLabDraft(raw: string | null, exercise: LoanLabExercise): LoanLabDraft | null {
  if (!raw || raw.length > 1_000_000) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || typeof value.code !== 'string' || value.code.length > 100000 || !Number.isInteger(value.elapsedSeconds) || value.elapsedSeconds < 0 || value.elapsedSeconds > 604800 || !Number.isInteger(value.hintsRevealed) || value.hintsRevealed < 0 || value.hintsRevealed > exercise.hints.length || typeof value.referenceRevealed !== 'boolean') return null;
    return { version: 1, code: value.code, elapsedSeconds: value.elapsedSeconds, hintsRevealed: value.hintsRevealed, referenceRevealed: value.referenceRevealed };
  } catch { return null; }
}
