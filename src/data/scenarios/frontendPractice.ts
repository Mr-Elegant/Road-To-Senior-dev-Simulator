import { frontendPracticeTopics } from '@/data/frontendPractice';
import { getFrontendExercise } from '@/data/frontendPractice/exercises';
import type { Scenario } from '@/types/scenario';

export const frontendCodingScenarios: Scenario[] = frontendPracticeTopics
  .filter(topic => topic.scenarioId.startsWith('frontend-'))
  .map(topic => {
    const exercise = getFrontendExercise(topic.slug);
    if (!exercise) throw new Error(`Missing coding exercise: ${topic.slug}`);
    const react = exercise.kind === 'react';
    return {
      id: topic.scenarioId,
      title: `Frontend: ${topic.title}`,
      type: 'coding', topic: react ? 'React' : 'JavaScript', subtopic: 'Frontend Practice · 203-topic bank',
      difficulty: topic.difficulty === 'Easy' ? 'Beginner' : topic.difficulty === 'Medium' ? 'Mid-Level' : 'Senior',
      estimatedMinutes: topic.difficulty === 'Hard' ? 45 : topic.difficulty === 'Medium' ? 30 : 20,
      businessContext: `Build and verify the core behavior behind ${topic.title}. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.`,
      problemStatement: exercise.contract,
      constraints: [
        react ? 'Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.' : 'Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.',
        'Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.',
      ],
      candidateTasks: ['Implement the documented behavior without hard-coding fixture answers.', 'Run the full suite, investigate boundary failures, and explain the follow-up variation.'],
      codeLanguage: react ? 'jsx' : 'javascript',
      ...(react ? { reactExercise: true as const } : { javascriptExercise: true as const }),
      starterCode: react ? exercise.starter ?? "export default function App(props) {\n  return <section><p>Build the documented component here.</p></section>;\n}" : 'function solution(input) {\n  // Implement the documented contract.\n  return null;\n}',
      testCases: exercise.kind === 'react' ? exercise.tests.map((test, i) => ({
        id: `${topic.slug}-${i+1}`, name: test.name, inputDescription: JSON.stringify(test.journey), expectedOutput: 'All DOM assertions passed',
      })) : exercise.tests.map((test, i) => ({
        id: `${topic.slug}-${i+1}`, name: test.name === 'Documented input and output' ? `Behavioral case ${i+1}` : test.name,
        inputDescription: JSON.stringify(test.input), expectedOutput: test.expectedError ? `Throws: ${test.expectedError}` : JSON.stringify(test.expected),
        ...(test.expectedError ? { expectedError: test.expectedError } : {}),
      })),
      hints: ['Write down the state or algorithmic invariant, and trace the smallest boundary case before coding.', topic.answer.split('. ')[0] + '.'],
      rubric: [{ id: `${topic.slug}-correctness`, category: 'correctness', label: 'Observable behavior and reasoning', weight: 5,
        description: 'Use the executable cases as behavioral evidence; explain invariant, validation, complexity, and limits.',
        levels: [{ score: 0, description: 'The main behavior does not work.' }, { score: 1, description: 'Only a happy path works.' }, { score: 2, description: 'Authored cases pass but the reasoning is incomplete.' }, { score: 3, description: 'Authored cases pass and the invariant, boundaries, and trade-offs are explained.' }],
      }],
      referenceSolution: { explanation: topic.answer, codeOrArtifact: exercise.reference, architectureNotes: `Follow-up: ${topic.followUp}\nTopic reference: ${topic.sourceUrl}\nThis app contract and reference were independently authored.` },
      alternativeApproaches: [topic.followUp],
      commonMistakes: [`Ignoring contract boundaries such as: ${topic.checks.slice(0,3).join('; ')}.`, 'Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees.'],
      followUpQuestions: [{ id: `${topic.slug}-variation`, question: topic.followUp, expectedConcepts: ['Explicit assumptions', 'State/algorithm invariant', 'Boundary verification'], sampleStrongAnswer: `${topic.answer} For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant.` }],
    } satisfies Scenario;
  });
