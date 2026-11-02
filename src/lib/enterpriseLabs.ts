import type { EnterpriseLab } from '@/data/enterpriseLabs';
import type { AttemptSubmission } from '@/types/userProgress';
import { bestLoanLabScores } from '@/lib/loanLab/attempts';

export function getEnterpriseLabProgress(lab: EnterpriseLab, attempts: AttemptSubmission[]) {
  const scores: Record<string, number> = {};
  const loanScores = lab.format === 'dashboard' ? bestLoanLabScores(attempts) : {};
  for (const exercise of lab.exercises) {
    if (exercise.evaluation === 'behavioral') {
      const score = loanScores[exercise.id.slice('loan-lab:'.length)];
      if (score !== undefined) scores[exercise.id] = score;
    } else {
      for (const attempt of attempts) {
        if (attempt.scenarioId !== exercise.id || !Number.isFinite(attempt.totalScorePercentage) ||
            attempt.totalScorePercentage < 0 || attempt.totalScorePercentage > 100) continue;
        scores[exercise.id] = Math.max(scores[exercise.id] ?? 0, attempt.totalScorePercentage);
      }
    }
  }
  return { passed: Object.values(scores).filter(score => score >= 70).length,
    attempted: Object.keys(scores).length, total: lab.exercises.length, scores };
}
