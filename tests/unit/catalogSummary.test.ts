import { describe, expect, it } from 'vitest';
import { allScenarios } from '@/data';
import { toScenarioSummary } from '@/types/scenarioSummary';
import { calculateReadinessReport } from '@/lib/evaluation/readinessCalculator';

describe('catalog listing payload', () => {
  it('preserves every ID, searchable statement, badge and ordering while excluding answer/fixture payloads', () => {
    const summaries = allScenarios.map(toScenarioSummary);
    expect(summaries.map(item => item.id)).toEqual(allScenarios.map(item => item.id));
    for (const [index, summary] of summaries.entries()) {
      const original = allScenarios[index];
      expect(summary.problemStatement).toBe(original.problemStatement);
      expect(summary.incidentStageCount).toBe(original.incidentSimulation?.stages.length ?? 0);
      expect(summary).not.toHaveProperty('referenceSolution');
      expect(summary).not.toHaveProperty('testCases');
      expect(summary).not.toHaveProperty('starterCode');
    }
    expect(JSON.stringify(summaries).length).toBeLessThan(JSON.stringify(allScenarios).length / 3);
  });
  it('produces identical readiness, recommendations and completion counts from listing data', () => {
    const progress = { attempts: allScenarios.slice(0, 5).map((scenario, index) => ({ id: String(index), scenarioId: scenario.id, totalScorePercentage: index * 25, timestamp: '2026-11-04T00:00:00Z', timeSpentSeconds: 60, hintsUsedCount: 0, rubricScores: [], passedTestsCount: 0, totalTestsCount: 0, selfAssessmentCompleted: true })), bookmarkedScenarioIds: [], streakDays: 3, lastActiveDate: '' };
    expect(calculateReadinessReport(allScenarios.map(toScenarioSummary), progress))
      .toEqual(calculateReadinessReport(allScenarios, progress));
  });
});
