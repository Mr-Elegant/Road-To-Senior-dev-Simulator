import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { loanLabExercises } from '@/data/loanLabExercises';
import { executeLoanLabCase, sameLoanLabOutput } from '@/lib/loanLab/harness';
import { loanBugScenarios } from '@/data/loanBugScenarios';
import { bestLoanLabScores, loanLabAttemptInfo } from '@/lib/loanLab/attempts';
import type { AttemptSubmission } from '@/types/userProgress';
import { calculateReadinessReport } from '@/lib/evaluation/readinessCalculator';
import { allScenarios } from '@/data';

describe('loan bug lab authored contracts and behavioral tests', () => {
  it('provides one executable exercise for every existing bug', () => {
    expect(loanLabExercises.map((exercise) => exercise.bugId)).toEqual(loanBugScenarios.map((bug) => bug.id));
    for (const exercise of loanLabExercises) {
      expect(exercise.tests.filter((test) => test.sample).length).toBeGreaterThanOrEqual(2);
      expect(exercise.tests.filter((test) => !test.sample).length).toBeGreaterThanOrEqual(2);
      expect(exercise.contract.length).toBeGreaterThan(100);
      expect(exercise.hints.length).toBeGreaterThanOrEqual(2);
    }
  });

  it.each(Array.from({ length: 8 }, (_, index) => index))('bug %i has a failing starter and passing reference for every case', (index) => {
    const exercise = loanLabExercises[index];
    const check = (code: string) => exercise.tests.map((test) => {
      try {
        const actual = runInNewContext(`"use strict"; ${code}\n(${executeLoanLabCase.toString()})(${exercise.entryPoint}, kind, input)`, { kind: exercise.kind, input: structuredClone(test.input) }, { timeout: 250 });
        return sameLoanLabOutput(actual, test.expected);
      } catch { return false; }
    });
    expect(check(exercise.starterCode).some((passed) => !passed)).toBe(true);
    expect(check(exercise.referenceCode)).toEqual(exercise.tests.map(() => true));
  });

  it('compares structured results exactly without accepting substrings or property order differences', () => {
    expect(sameLoanLabOutput({ b: 2, a: [1, 2] }, { a: [1, 2], b: 2 })).toBe(true);
    expect(sameLoanLabOutput('APP', 'APPROVED')).toBe(false);
    expect(sameLoanLabOutput([1, 2], [2, 1])).toBe(false);
    expect(sameLoanLabOutput(undefined, null)).toBe(false);
    expect(sameLoanLabOutput({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('preserves the best full submission across retries and rejects incomplete or invalid counts', () => {
    const attempt: AttemptSubmission = { id: 'lab-test', scenarioId: 'loan-lab:bug-1-race-condition', timestamp: new Date().toISOString(), timeSpentSeconds: 1, hintsUsedCount: 0, passedTestsCount: 5, totalTestsCount: 5, totalScorePercentage: 100, rubricScores: [], selfAssessmentCompleted: false, interviewAnswers: { 'loanLab.mode': 'full-suite' } };
    expect(bestLoanLabScores([attempt, { ...attempt, passedTestsCount: 1, totalScorePercentage: 20 }])).toEqual({ 'bug-1-race-condition': 100 });
    expect(bestLoanLabScores([{ ...attempt, totalTestsCount: 2 }, { ...attempt, passedTestsCount: 50 }, { ...attempt, interviewAnswers: {} }])).toEqual({});
  });

  it('links known loan attempts back to their editable exercise without accepting arbitrary IDs', () => {
    expect(loanLabAttemptInfo('loan-lab:bug-1-race-condition')?.href).toBe('/challenges/loan-management?bug=bug-1-race-condition');
    expect(loanLabAttemptInfo('loan-lab:missing')).toBeUndefined();
    expect(loanLabAttemptInfo('other')).toBeUndefined();
  });

  it('keeps loan lab test scores separate from the senior scenario readiness benchmark', () => {
    const base = { attempts: [], bookmarkedScenarioIds: [], streakDays: 0, lastActiveDate: '' };
    const attempt: AttemptSubmission = { id: 'loan-readiness-check', scenarioId: 'loan-lab:bug-1-race-condition', timestamp: new Date().toISOString(), timeSpentSeconds: 1, hintsUsedCount: 0, passedTestsCount: 5, totalTestsCount: 5, totalScorePercentage: 100, rubricScores: [], selfAssessmentCompleted: false };
    expect(calculateReadinessReport(allScenarios, { ...base, attempts: [attempt] })).toEqual(calculateReadinessReport(allScenarios, base));
  });
});
