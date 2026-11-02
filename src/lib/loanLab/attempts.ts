import { loanLabExerciseMap } from '@/data/loanLabExercises';
import type { AttemptSubmission } from '@/types/userProgress';

export function loanLabAttemptInfo(scenarioId: string) {
  if (!scenarioId.startsWith('loan-lab:')) return undefined;
  const bugId = scenarioId.slice('loan-lab:'.length);
  const exercise = loanLabExerciseMap.get(bugId);
  return exercise ? { title: `Loan bug lab: ${exercise.title}`, topic: 'React / Redux', href: `/challenges/loan-management?bug=${encodeURIComponent(bugId)}` } : undefined;
}

export function bestLoanLabScores(attempts: AttemptSubmission[]): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const attempt of attempts) {
    const bugId = attempt.scenarioId.startsWith('loan-lab:') ? attempt.scenarioId.slice('loan-lab:'.length) : '';
    const exercise = loanLabExerciseMap.get(bugId);
    if (!exercise || attempt.totalTestsCount !== exercise.tests.length || attempt.interviewAnswers?.['loanLab.mode'] !== 'full-suite' || !Number.isInteger(attempt.passedTestsCount) || attempt.passedTestsCount < 0 || attempt.passedTestsCount > exercise.tests.length) continue;
    const score = Math.round(attempt.passedTestsCount / exercise.tests.length * 100);
    scores[bugId] = Math.max(scores[bugId] ?? 0, score);
  }
  return scores;
}
