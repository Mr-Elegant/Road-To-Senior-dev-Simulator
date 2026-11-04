import { Scenario } from '@/types/scenario';
import { javascriptScenarios } from './scenarios/javascript';
import { typescriptScenarios } from './scenarios/typescript';
import { reactScenarios } from './scenarios/react';
import { nextjsScenarios } from './scenarios/nextjs';
import { nodejsScenarios } from './scenarios/nodejs';
import { databaseScenarios } from './scenarios/databases';
import { integrationScenarios } from './scenarios/integrations';
import { operationScenarios } from './scenarios/operations';
import { systemDesignScenarios } from './scenarios/systemDesign';
import { securityReviewScenarios } from './scenarios/securityReview';
import { additionalCoreScenarios } from './scenarios/additionalCore';
import { evolvingIncidents } from './incidents';
import { commerceScenarios } from './scenarios/commerce';
import { saasScenarios } from './scenarios/saas';
import { collaborationScenarios } from './scenarios/collaboration';
import { reactPracticeScenarios } from './scenarios/reactPractice';
import { frontendCodingScenarios } from './scenarios/frontendPractice';
import { reactTypescriptScenarios } from './reactTypescript';
import { nextjsPracticeScenarios } from './nextjsPractice';

export const allScenarios: Scenario[] = [
  ...javascriptScenarios,
  ...typescriptScenarios,
  ...reactScenarios,
  ...nextjsScenarios,
  ...nodejsScenarios,
  ...databaseScenarios,
  ...integrationScenarios,
  ...operationScenarios,
  ...systemDesignScenarios,
  ...securityReviewScenarios,
  ...additionalCoreScenarios,
  ...evolvingIncidents,
  ...commerceScenarios,
  ...saasScenarios,
  ...collaborationScenarios,
  ...reactPracticeScenarios,
  ...frontendCodingScenarios,
  ...reactTypescriptScenarios,
  ...nextjsPracticeScenarios,
];

export const scenarioMap = new Map<string, Scenario>();
for (const scenario of allScenarios) {
  scenarioMap.set(scenario.id, scenario);
}

export function getScenarioById(id: string): Scenario | undefined {
  return scenarioMap.get(id);
}

export function getScenariosByTopic(topic: string): Scenario[] {
  return allScenarios.filter((s) => s.topic.toLowerCase() === topic.toLowerCase());
}

export function getScenariosByType(type: string): Scenario[] {
  return allScenarios.filter((s) => s.type.toLowerCase() === type.toLowerCase());
}

export function getScenariosByDifficulty(difficulty: string): Scenario[] {
  return allScenarios.filter((s) => s.difficulty.toLowerCase() === difficulty.toLowerCase());
}

export * from './tier1';


