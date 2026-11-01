import { describe, it, expect } from 'vitest';
import { computeRubricScore } from '@/lib/evaluation/rubricEvaluator';
import { calculateReadinessReport } from '@/lib/evaluation/readinessCalculator';
import { runClientSideTestSuite } from '@/lib/evaluation/safeCodeRunner';
import { RubricCriteria, TestCase } from '@/types/scenario';
import { allScenarios } from '@/data';

describe('Rubric Evaluation Engine', () => {
  const sampleRubric: RubricCriteria[] = [
    {
      id: 'crit-1',
      category: 'root_cause',
      label: 'Root Cause Analysis',
      description: 'Understanding event loop starvation',
      weight: 3,
      levels: [
        { score: 3, description: 'Exemplary' },
        { score: 2, description: 'Competent' },
        { score: 1, description: 'Developing' },
        { score: 0, description: 'Missing' },
      ],
    },
    {
      id: 'crit-2',
      category: 'correctness',
      label: 'Implementation Correctness',
      description: 'Cooperative chunking',
      weight: 2,
      levels: [
        { score: 3, description: 'Exemplary' },
        { score: 2, description: 'Competent' },
        { score: 1, description: 'Developing' },
        { score: 0, description: 'Missing' },
      ],
    },
  ];

  it('computes weighted score percentages accurately', () => {
    // crit-1: score 3 * weight 3 = 9 pts
    // crit-2: score 2 * weight 2 = 4 pts
    // Total earned = 13 pts. Max = (3*3) + (3*2) = 15 pts.
    // 13 / 15 = ~87%
    const scores = [
      { criteriaId: 'crit-1', score: 3 },
      { criteriaId: 'crit-2', score: 2 },
    ];

    const result = computeRubricScore(sampleRubric, scores);
    expect(result.earnedPoints).toBe(13);
    expect(result.maxPoints).toBe(15);
    expect(result.percentage).toBe(87);
    expect(result.categoryScores['root_cause'].percentage).toBe(100);
    expect(result.categoryScores['correctness'].percentage).toBe(67);
  });

  it('handles low scores and generates growth recommendations', () => {
    const scores = [
      { criteriaId: 'crit-1', score: 1 },
      { criteriaId: 'crit-2', score: 0 },
    ];
    const result = computeRubricScore(sampleRubric, scores);
    expect(result.percentage).toBe(20);
    expect(result.feedbackSummary.length).toBeGreaterThan(0);
  });
});

describe('Sandboxed Code Runner Safety & Test Execution', () => {
  it('safely runs synchronous solution and matches expected output', async () => {
    const code = `
      function solution(n) {
        return n * 2;
      }
    `;
    const testCases: TestCase[] = [
      {
        id: 'tc-1',
        name: 'Doubles positive number',
        inputDescription: '5',
        expectedOutput: '10',
      },
      {
        id: 'tc-2',
        name: 'Doubles zero',
        inputDescription: '0',
        expectedOutput: '0',
      },
    ];

    const result = await runClientSideTestSuite(code, testCases, 'javascript');
    expect(result.isSupported).toBe(true);
    expect(result.passedTests).toBe(2);
    expect(result.totalTests).toBe(2);
    expect(result.results[0].passed).toBe(true);
  });

  it('safely intercepts runtime exceptions without crashing the process', async () => {
    const code = `
      function solution() {
        throw new Error("Simulated memory overflow");
      }
    `;
    const testCases: TestCase[] = [
      {
        id: 'tc-1',
        name: 'Failing function',
        inputDescription: 'null',
        expectedOutput: '10',
      },
    ];

    const result = await runClientSideTestSuite(code, testCases, 'javascript');
    expect(result.passedTests).toBe(0);
    expect(result.results[0].passed).toBe(false);
    expect(result.results[0].errorMessage).toContain('Simulated memory overflow');
  });
});

describe('Interview Readiness Calculator', () => {
  it('calculates readiness tier and prioritizes weak areas', () => {
    const progress = {
      attempts: [
        {
          id: 'att-1',
          scenarioId: 'js-event-loop-microtasks',
          timestamp: new Date().toISOString(),
          timeSpentSeconds: 600,
          hintsUsedCount: 1,
          totalScorePercentage: 90,
          passedTestsCount: 2,
          totalTestsCount: 2,
          rubricScores: [],
          selfAssessmentCompleted: true,
        },
        {
          id: 'att-2',
          scenarioId: 'db-deadlock-inventory-reservation',
          timestamp: new Date().toISOString(),
          timeSpentSeconds: 900,
          hintsUsedCount: 2,
          totalScorePercentage: 55, // Weak score in Databases
          passedTestsCount: 1,
          totalTestsCount: 1,
          rubricScores: [],
          selfAssessmentCompleted: true,
        },
      ],
      bookmarkedScenarioIds: ['sysdesign-scalable-notification-engine'],
      streakDays: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      customNotes: {},
    };

    const report = calculateReadinessReport(allScenarios, progress);
    expect(report.completedCount).toBe(2);
    expect(report.totalCount).toBe(allScenarios.length);
    expect(report.disclaimer).toContain('not an absolute or legally binding guarantee');
    expect(report.weakestAreas.length).toBeGreaterThan(0);
  });
});

