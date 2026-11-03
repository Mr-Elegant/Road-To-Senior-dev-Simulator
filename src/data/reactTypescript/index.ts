import references from './references.json';
import { frontendPracticeTopics } from '@/data/frontendPractice';
import { frontendExercises } from '@/data/frontendPractice/exercises';
import { reactPracticeScenarios } from '@/data/scenarios/reactPractice';
import { frontendCodingScenarios } from '@/data/scenarios/frontendPractice';
import type { Scenario } from '@/types/scenario';

export interface TypedReactReference { code: string; starter: string }
export const reactTypescriptReferences = references as Record<string, TypedReactReference>;
export const reactTypescriptTopics = frontendPracticeTopics.filter(topic => topic.language === 'React.js')
  .map(topic => ({ ...topic, scenarioId: `react-ts-${topic.slug}` }));
export const reactTypescriptScenarios: Scenario[] = reactTypescriptTopics.map(topic => {
  const sourceTopic = frontendPracticeTopics.find(item => item.slug === topic.slug)!;
  const source = [...reactPracticeScenarios, ...frontendCodingScenarios].find(item => item.id === sourceTopic.scenarioId)!;
  const typed = reactTypescriptReferences[topic.slug];
  if (!typed) throw new Error(`Missing typed React reference: ${topic.slug}`);
  return {
    ...source, id: topic.scenarioId, title: `React + TypeScript: ${topic.title}`,
    topic: 'TypeScript', subtopic: 'React + TypeScript Practice', codeLanguage: 'tsx', reactTypescriptExercise: true,
    starterCode: typed.starter,
    problemStatement: `${frontendExercises[topic.slug].contract}\n\nTypeScript contract: export default App and export AppProps. Use strict TSX with typed props, state, event handlers, refs and domain records. The compiler rejects implicit/explicit any and suppression directives before DOM tests or preview. Only react and react/jsx-runtime imports are supported.`,
    constraints: [...source.constraints.filter(value => !value.includes('JavaScript, JSX')), 'Keep the supplied AppProps contract and type-safe state transitions. A passing submission must type-check and pass the original DOM journeys.'],
    candidateTasks: [...source.candidateTasks, 'Model the component data and narrow nullable refs and unknown errors without disabling type checking.'],
    referenceSolution: { ...source.referenceSolution, codeOrArtifact: typed.code, explanation: `${source.referenceSolution.explanation}\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.`, architectureNotes: `${source.referenceSolution.architectureNotes ?? ''}\nOriginal React workspace: /challenge/${source.id}. The TypeScript copy uses a separate scenario ID and attempt history.` },
    hints: ['Inspect AppProps and the inferred state type first. Fix the first compiler diagnostic before running the DOM journey.', ...source.hints],
  };
});
