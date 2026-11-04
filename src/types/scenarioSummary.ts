import type { Scenario } from './scenario';

export type ScenarioIdentity = Pick<Scenario, 'id' | 'title' | 'topic' | 'difficulty' | 'type'>;
export type ScenarioSummary = Pick<Scenario,
  'id' | 'title' | 'topic' | 'subtopic' | 'type' | 'difficulty' | 'estimatedMinutes' | 'problemStatement' | 'reactExercise' | 'reactTypescriptExercise'> & {
  incidentStageCount: number;
};

/** Listing/search data deliberately omits solutions, fixtures and incident transcripts. */
export function toScenarioSummary(scenario: Scenario): ScenarioSummary {
  return {
    id: scenario.id, title: scenario.title, topic: scenario.topic, subtopic: scenario.subtopic,
    type: scenario.type, difficulty: scenario.difficulty, estimatedMinutes: scenario.estimatedMinutes,
    problemStatement: scenario.problemStatement,
    ...(scenario.reactExercise ? { reactExercise: scenario.reactExercise } : {}),
    ...(scenario.reactTypescriptExercise ? { reactTypescriptExercise: scenario.reactTypescriptExercise } : {}),
    incidentStageCount: scenario.incidentSimulation?.stages.length ?? 0,
  };
}
