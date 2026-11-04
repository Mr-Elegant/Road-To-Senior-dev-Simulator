import 'server-only';
import { allScenarios } from './index';
import { toScenarioSummary } from '@/types/scenarioSummary';

export const scenarioSummaries = allScenarios.map(toScenarioSummary);
export const scenarioIdentities = allScenarios.map(({ id, title, topic, difficulty, type }) => ({ id, title, topic, difficulty, type }));
