import type { Scenario } from '@/types/scenario';
import { nextjsPolicyScenarios } from './models';
import { foundationReviews } from './foundations';
import { applicationReviews } from './application';
import { productionReviews } from './production';
import { supplementalReviews } from './supplemental';
import { nextjsDesigns } from './architecture';
import { levels, nextjsInfo, nextjsRubric } from './shared';
export { nextjsVersionSnapshot } from './shared';

const reviews: Scenario[] = [
  ...foundationReviews,
  ...applicationReviews,
  ...productionReviews,
  ...supplementalReviews,
].map((row) => {
  const id = `next-lab-${row.slug}`;
  return {
    id,
    title: row.title,
    topic: 'Next.js',
    subtopic: row.chapter,
    difficulty: row.difficulty,
    type: 'code_review',
    estimatedMinutes: row.difficulty === 'Beginner' ? 20 : 35,
    businessContext:
      'Review a focused Next.js application change before it reaches production. The proposed file below contains the defect or unsupported assumption; external application services, where imported, are integration boundaries.',
    problemStatement: `Review the proposed ${row.file} change. Identify the incorrect framework assumption, propose a minimal corrected implementation, and provide evidence for the selected version scope and its 15/16 differences. Explain the interview variation after solving the base task. This is a framework code review: actual rendering, routing and cache behavior must be checked in a real Next.js build, not a browser function sandbox.`,
    codeLanguage: row.file.endsWith('.json') ? 'json' : 'typescript',
    starterCode: row.broken,
    codeReviewFiles: [
      {
        filename: row.file,
        newCode: row.broken,
        language: row.file.endsWith('.json') ? 'json' : 'typescript',
        reviewPointsCount: 3,
      },
    ],
    constraints: [
      'Preserve the stated user behavior and keep trust boundaries explicit.',
      'Use the selected version’s documented API; do not suppress build/type failures to hide the defect.',
      ...row.checks,
    ],
    candidateTasks: [
      'Add actionable line-level review comments explaining impact and correction.',
      'Write the corrected file in the local IDE copy; split annotated companion files where instructed.',
      'Record actual build/request/navigation evidence against the acceptance checks and compare version notes.',
    ],
    hints: [row.explanation.split('. ')[0] + '.', row.checks[0]],
    rubric: nextjsRubric(id, row.explanation),
    referenceSolution: {
      explanation: row.explanation,
      codeOrArtifact: row.file.endsWith('.json')
        ? row.fixed
        : `// Corrected review reference: ${row.file}\n${row.fixed}`,
      architectureNotes: `Verification:\n${row.checks.map((check) => '- ' + check).join('\n')}\n\nThis is a focused review reference, not a complete application/service implementation.`,
    },
    alternativeApproaches: [row.answer],
    commonMistakes: [
      'Verifying only next dev when the behavior depends on production rendering or bundling.',
      'Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization.',
    ],
    followUpQuestions: [
      {
        id: `${id}-extension`,
        question: row.tweak,
        expectedConcepts: [
          row.chapter,
          'Changed assumptions',
          'Runtime evidence',
        ],
        sampleStrongAnswer: row.answer,
      },
    ],
    nextjsPractice: nextjsInfo(
      row.chapter,
      'framework-review',
      row.doc,
      row.checks,
      row.versions,
      row.next15,
      row.next16,
    ),
  } satisfies Scenario;
});

const designs: Scenario[] = nextjsDesigns.map((row) => {
  const id = `next-lab-${row.slug}`;
  return {
    id,
    title: row.title,
    topic: 'Next.js',
    subtopic: row.chapter,
    difficulty: 'Staff/Principal',
    type: 'system_design',
    estimatedMinutes: 60,
    businessContext: row.situation,
    problemStatement: `Design the system for ${row.scale}. Produce the component/data-flow diagram, request and mutation contracts, cache/trust boundaries, capacity assumptions, failure recovery and rollout gates. State which decisions change between Next.js 15 and 16 instead of using a framework API as a substitute for an architectural guarantee.`,
    constraints: row.requirements,
    candidateTasks: [
      'Draw components and annotate ownership of data, identity, caches and durable work.',
      'Specify contracts/schema and quantify the capacity/freshness assumptions.',
      'Walk through the failure scenario and design measurable acceptance tests.',
      'Compare the reference decisions and answer the changed-requirement interview prompt.',
    ],
    systemDesignReqs: {
      scale: row.scale,
      functional: row.requirements,
      nonFunctional: [
        'State an explicit latency, freshness and recovery budget rather than inventing guarantees.',
        'Keep actor/tenant isolation and failure ownership observable.',
      ],
      assumptions: [
        'A patched App Router deployment; platform-specific infrastructure support must be verified.',
        'Next.js version and Cache Components configuration are explicit design inputs.',
      ],
    },
    hints: [row.design.split('. ')[0] + '.', row.failure],
    rubric: nextjsRubric(id, row.design),
    referenceSolution: {
      explanation: row.design,
      architectureNotes: row.failure,
      codeOrArtifact: `# Decision record: ${row.title}\n\n## Context and scale\n${row.situation}\n${row.scale}\n\n## Accepted constraints\n${row.requirements.map((value) => '- ' + value).join('\n')}\n\n## Design and ownership\n${row.design}\n\n## Failure and recovery\n${row.failure}\n\n## Verification gates\n${row.verification.map((value) => '- ' + value).join('\n')}\n\n## Interview change\n${row.tweak}\n${row.answer}\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification.`,
    },
    alternativeApproaches: [row.answer],
    commonMistakes: [
      'Claiming a cache API provides transactions, durable delivery or cross-region consistency.',
      'Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram.',
    ],
    followUpQuestions: [
      {
        id: `${id}-extension`,
        question: row.tweak,
        expectedConcepts: [
          row.chapter,
          'Consistency and ownership',
          'Measurable evidence',
        ],
        sampleStrongAnswer: row.answer,
      },
    ],
    nextjsPractice: nextjsInfo(
      row.chapter,
      'architecture',
      row.doc,
      row.verification,
    ),
  } satisfies Scenario;
});

// Stable ordering by learning level; original IDs are independent of later display ordering.
export const nextjsPracticeScenarios: Scenario[] = [
  ...nextjsPolicyScenarios,
  ...reviews,
  ...designs,
]
  .sort((a, b) => levels.indexOf(a.difficulty) - levels.indexOf(b.difficulty))
  .map((scenario, index) => ({
    ...scenario,
    nextjsPractice: { ...scenario.nextjsPractice!, order: index + 1 },
  }));
