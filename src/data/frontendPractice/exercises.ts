import { frontendPracticeTopics } from './index';
import { javascriptExercises } from './javascript';
import { reactEasyExercises } from './reactEasy';
import { reactMediumExercises } from './reactMedium';
import { reactHardExercises } from './reactHard';
import { reactPracticeScenarios } from '@/data/scenarios/reactPractice';
import type { FrontendExercise } from '@/types/frontendExercise';

export const frontendExercises: Record<string, FrontendExercise> = {
  ...javascriptExercises, ...reactEasyExercises, ...reactMediumExercises, ...reactHardExercises,
};
for (const topic of frontendPracticeTopics) {
  if (frontendExercises[topic.slug]) continue;
  const scenario = reactPracticeScenarios.find(item => item.id === topic.scenarioId);
  if (scenario) frontendExercises[topic.slug] = {
    kind: 'react', contract: scenario.problemStatement, reference: scenario.referenceSolution.codeOrArtifact!, starter: scenario.starterCode,
    tests: scenario.testCases!.map(test => ({ name: test.name, journey: JSON.parse(test.inputDescription) })),
  };
}

export function getFrontendExercise(slug: string): FrontendExercise | undefined {
  return Object.hasOwn(frontendExercises, slug) ? frontendExercises[slug] : undefined;
}
