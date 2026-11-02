import { describe, expect, it } from 'vitest';
import { enterpriseLabs, getEnterpriseLab } from '@/data/enterpriseLabs';
import { getEnterpriseLabProgress } from '@/lib/enterpriseLabs';
import { getScenarioById } from '@/data';
import type { AttemptSubmission } from '@/types/userProgress';

function attempt(scenarioId: string, score: number, extra: Partial<AttemptSubmission> = {}): AttemptSubmission {
  return { id: 'attempt', scenarioId, timestamp: '2026-11-02T00:00:00Z', timeSpentSeconds: 60,
    hintsUsedCount: 0, rubricScores: [], totalScorePercentage: score, passedTestsCount: 0,
    totalTestsCount: 0, selfAssessmentCompleted: true, ...extra };
}

describe('Enterprise Labs registry and shared progress', () => {
  it('groups working exercises into four distinct projects', () => {
    expect(enterpriseLabs.map(lab => lab.id)).toEqual(['loan-operations', 'commerce-operations', 'multi-tenant-saas', 'real-time-collaboration']);
    const ids = enterpriseLabs.flatMap(lab => lab.exercises.map(exercise => exercise.id));
    expect(ids).toHaveLength(22);
    expect(new Set(ids).size).toBe(ids.length);
    for (const lab of enterpriseLabs) {
      expect(getEnterpriseLab(lab.id)).toBe(lab);
      expect(lab.skills.length).toBeGreaterThanOrEqual(3);
      for (const exercise of lab.exercises) {
        if (exercise.id.startsWith('loan-lab:')) {
          expect(exercise.href).toMatch(/^\/challenges\/loan-management\?bug=/);
        } else {
          expect(getScenarioById(exercise.id)?.title).toBe(exercise.title);
          expect(exercise.href).toBe(`/challenge/${exercise.id}`);
        }
      }
    }
  });

  it('returns no project for an unknown slug', () => {
    expect(getEnterpriseLab('constructor')).toBeUndefined();
    expect(getEnterpriseLab('not-a-project')).toBeUndefined();
  });

  it('uses the best shared catalog score and counts each exercise once', () => {
    const lab = getEnterpriseLab('commerce-operations')!;
    const id = lab.exercises[0].id;
    const result = getEnterpriseLabProgress(lab, [attempt(id, 80), attempt(id, 20), attempt('unrelated', 100)]);
    expect(result.passed).toBe(1);
    expect(result.attempted).toBe(1);
    expect(result.total).toBe(3);
    expect(result.scores[id]).toBe(80);
  });

  it('uses full-suite behavioral scores for loan exercises instead of claimed rubric scores', () => {
    const lab = getEnterpriseLab('loan-operations')!;
    const id = lab.exercises[0].id;
    const valid = attempt(id, 0, { passedTestsCount: 5, totalTestsCount: 5, interviewAnswers: { 'loanLab.mode': 'full-suite' } });
    expect(getEnterpriseLabProgress(lab, [valid]).scores[id]).toBe(100);
    expect(getEnterpriseLabProgress(lab, [attempt(id, 100)])).toMatchObject({ passed: 0, attempted: 0 });
    expect(getEnterpriseLabProgress(lab, [{ ...valid, passedTestsCount: 2, totalTestsCount: 2 }])).toMatchObject({ passed: 0, attempted: 0 });
  });

  it('preserves a best passing score after a failed retry and supports an empty history', () => {
    const lab = getEnterpriseLab('loan-operations')!;
    const id = lab.exercises[0].id;
    const full = { totalTestsCount: 5, interviewAnswers: { 'loanLab.mode': 'full-suite' } };
    expect(getEnterpriseLabProgress(lab, [attempt(id, 0, { ...full, passedTestsCount: 4 }), attempt(id, 0, { ...full, passedTestsCount: 0 })])).toMatchObject({ passed: 1, attempted: 1, total: 8 });
    expect(getEnterpriseLabProgress(lab, [])).toEqual({ passed: 0, attempted: 0, total: 8, scores: {} });
  });
});
