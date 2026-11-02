import { describe, expect, it } from 'vitest';
import { evolvingIncidents } from '@/data/incidents';
import { allScenarios } from '@/data';
import { advanceIncident, chooseIncidentAction, createIncidentRun, getIncidentView, incidentTranscript } from '@/lib/incidents/engine';
import { attemptSchema } from '@/lib/persistence/progressMerge';

describe('authored evolving incident library', () => {
  it('adds eight distinct complete incidents without replacing existing scenario IDs', () => {
    expect(evolvingIncidents).toHaveLength(8);
    expect(new Set(allScenarios.map((scenario) => scenario.id)).size).toBe(allScenarios.length);
    expect(allScenarios.some((scenario) => scenario.id === 'ops-production-memory-leak-debug')).toBe(true);
    for (const scenario of evolvingIncidents) {
      expect(allScenarios).toContain(scenario);
      const definition = scenario.incidentSimulation!;
      expect(definition.stages).toHaveLength(3);
      expect(definition.stages.map((stage) => stage.atSeconds)).toEqual([0, 120, 300]);
      for (const stage of definition.stages) {
        expect(stage.options).toHaveLength(3);
        expect(new Set(stage.options.map((option) => option.id)).size).toBe(3);
        expect(stage.options.find((option) => option.id === stage.review.recommendedOptionId)?.outcome).toBe('effective');
        expect(stage.review.reasoning.length).toBeGreaterThan(80);
        expect(stage.branches.effective).not.toEqual(stage.branches.harmful);
      }
      for (const key of ['evidence', 'containment', 'permanentFix', 'verification', 'regressionTests', 'rollback', 'communication'] as const) {
        expect(scenario.incidentPlaybook![key].length, `${scenario.id}: ${key}`).toBeGreaterThanOrEqual(2);
      }
      expect(scenario.referenceSolution.explanation.length).toBeGreaterThan(1500);
      expect(scenario.referenceSolution.codeOrArtifact!.length).toBeGreaterThan(200);
      expect(scenario.incidentPlaybook!.sources.every((source) => source.url.startsWith('https://'))).toBe(true);
    }
  });

  it.each(evolvingIncidents.map((scenario) => [scenario.title, scenario] as const))('%s has a recoverable recommended path and a serializable journal', (_, scenario) => {
    const definition = scenario.incidentSimulation!;
    let run = createIncidentRun();
    for (const stage of definition.stages) {
      run = advanceIncident(definition, run, stage.atSeconds - run.elapsedSeconds);
      run = chooseIncidentAction(definition, run, stage.review.recommendedOptionId, 'Use the observed telemetry and protect customer data.');
    }
    const view = getIncidentView(definition, run, scenario.incidentTelemetry!);
    expect(view.completed).toBe(true);
    expect(view.decisionScore).toBe(100);
    expect(view.telemetry.metrics[0].incidentPeak).toBe('0.1');
    const answers = incidentTranscript(definition, run);
    expect(Object.keys(answers)).toHaveLength(4);
    expect(attemptSchema.safeParse({ id: 'incident-test', scenarioId: scenario.id, timestamp: new Date().toISOString(), timeSpentSeconds: 300, hintsUsedCount: 0, interviewAnswers: answers, rubricScores: [], totalScorePercentage: 0, passedTestsCount: 0, totalTestsCount: 0, selfAssessmentCompleted: true }).success).toBe(true);
  });
});
