import type { Scenario, TestCase } from '@/types/scenario';

export function businessCase(id: string, name: string, input: unknown, expected: unknown, hidden = false): TestCase {
  return { id, name, inputDescription: JSON.stringify(input), expectedOutput: JSON.stringify(expected), hidden };
}

// Shared presentation defaults; business rules and expected outputs stay explicit in each scenario.
export function businessScenario(
  scenario: Omit<Scenario, 'codeLanguage' | 'rubric'> & { assessment: string },
): Scenario {
  const { assessment, ...content } = scenario;
  return {
    ...content,
    codeLanguage: 'javascript',
    rubric: [
      {
        id: `${scenario.id}-correctness`, category: 'correctness', weight: 5,
        label: 'Business invariant and edge cases', description: assessment,
        levels: [
          { score: 0, description: 'The original failure remains or the response is hard-coded.' },
          { score: 1, description: 'Happy path works; negative or replay cases fail.' },
          { score: 2, description: 'All fixture behaviors work, but production boundaries are unexplained.' },
          { score: 3, description: 'All fixture behaviors work and the business invariant is explained.' },
        ],
      },
      {
        id: `${scenario.id}-production`, category: 'reliability', weight: 4,
        label: 'Production design and verification',
        description: 'Separate this deterministic model from durable storage, concurrency, authorization, and recovery requirements.',
        levels: [
          { score: 0, description: 'Treats an in-memory model as a production guarantee.' },
          { score: 1, description: 'Names a production risk without a concrete mitigation.' },
          { score: 2, description: 'Defines persistence and failure handling, but omits a verification or rollback plan.' },
          { score: 3, description: 'Defines durable invariants, failure recovery, observable verification, and safe rollout.' },
        ],
      },
    ],
  };
}
