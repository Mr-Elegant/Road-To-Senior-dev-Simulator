import type { IncidentPlaybook, IncidentSimulation, IncidentStage } from '@/types/incident';
import type { Difficulty, IncidentTelemetry, Scenario, Topic } from '@/types/scenario';

type Action = [label: string, observation: string, customerImpact: string, affectedPercent: string];
interface Development {
  title: string;
  briefing: string;
  signal: string;
  containedBranch: string;
  uncontainedBranch: string;
  effective: Action;
  partial: Action;
  harmful: Action;
  reasoning: string;
}
interface IncidentContent {
  id: string;
  title: string;
  topic: Topic;
  difficulty: Difficulty;
  context: string;
  opening: string;
  constraints: string[];
  service: string;
  change: { summary: string; diff: string };
  developments: [Development, Development, Development];
  playbook: IncidentPlaybook;
  artifact: string;
  alternatives: string[];
  mistakes: string[];
  followUp: { question: string; answer: string; concepts: string[] };
}

export function incidentSignals(service: string, atSeconds: number, message: string, affectedPercent?: string): IncidentTelemetry {
  return {
    logs: [{ timestamp: `T+${String(Math.floor(atSeconds / 60)).padStart(2, '0')}:${String(atSeconds % 60).padStart(2, '0')}`, level: 'WARN', service, message }],
    metrics: affectedPercent === undefined ? [] : [{ metricName: 'affected_operations_percent', baseline: '0.1', incidentPeak: affectedPercent, unit: '%', status: Number(affectedPercent) > 5 ? 'critical' : Number(affectedPercent) > 0.5 ? 'warning' : 'normal', trend: 'Latest observation after the selected action; not a live production metric' }],
    customerReports: [], recentDeployments: [],
  };
}

export function createEvolvingIncident(content: IncidentContent): Scenario {
  const stages: IncidentStage[] = content.developments.map((development, index) => {
    const atSeconds = [0, 120, 300][index];
    const options = (['effective', 'partial', 'harmful'] as const).map((outcome) => {
      const [label, consequence, customerImpact, affectedPercent] = development[outcome];
      return { id: `${index + 1}-${outcome}`, label, outcome, consequence, customerImpact,
        severity: outcome === 'harmful' ? 'SEV1' as const : outcome === 'partial' || index < 2 ? 'SEV2' as const : 'SEV3' as const,
        telemetry: incidentSignals(content.service, atSeconds, consequence, affectedPercent) };
    });
    // Rotate ordering so the recommended response is not always the first button.
    const ordered = [...options.slice(index + 1), ...options.slice(0, index + 1)];
    return {
      id: `development-${index + 1}`, atSeconds, title: development.title, briefing: development.briefing,
      branches: { effective: development.containedBranch, partial: `Some impact remains. ${development.uncontainedBranch}`, harmful: development.uncontainedBranch, timeout: `The previous deadline passed without a response. ${development.uncontainedBranch}` },
      telemetry: incidentSignals(content.service, atSeconds, development.signal), options: ordered,
      timeout: { consequence: `No action was recorded for "${development.title}". The risk described in this development remains unaddressed.`, severity: 'SEV1', customerImpact: 'The incident remains open; affected operations need reconciliation and recovery verification.', telemetry: incidentSignals(content.service, atSeconds, `Decision deadline missed: ${development.signal}`) },
      review: { recommendedOptionId: `${index + 1}-effective`, reasoning: development.reasoning },
    };
  });
  const simulation: IncidentSimulation = { version: 1, initialSeverity: 'SEV1', stages, endSeconds: 480 };
  const playbook = content.playbook;
  const explanation = [playbook.diagnosis,
    ...Object.entries({ Evidence: playbook.evidence, Containment: playbook.containment, 'Permanent correction': playbook.permanentFix, 'Recovery verification': playbook.verification, 'Regression tests': playbook.regressionTests, 'Rollback constraints': playbook.rollback, 'Communication and handoff': playbook.communication }).map(([title, items]) => `${title}\n${items.map((item, index) => `${index + 1}. ${item}`).join('\n')}`),
  ].join('\n\n');
  return {
    id: content.id, title: content.title, type: 'incident', topic: content.topic, subtopic: 'Evolving production incident',
    difficulty: content.difficulty, estimatedMinutes: 35, businessContext: content.context,
    problemStatement: `${content.opening} Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.`,
    constraints: [...content.constraints, 'All telemetry is synthetic. Actions only affect this practice simulation.'],
    candidateTasks: ['Contain customer impact while preserving evidence and data integrity.', 'Respond to each new development and explain the selected action.', 'Cite telemetry supporting the root cause; distinguish observation from inference.', 'Define a permanent correction, regression coverage, recovery gates, and stakeholder update.'],
    incidentTelemetry: {
      ...incidentSignals(content.service, 0, content.opening, '35'),
      customerReports: [{ id: `${content.id}-report`, reporter: 'Incident commander', impact: 'Active customer impact', quote: content.opening }],
      recentDeployments: [{ commitHash: `${content.id.slice(-6)}-r1`, author: 'service-team', message: content.change.summary, timeAgo: '12 minutes before the alert', diffSnippet: content.change.diff }],
    },
    incidentSimulation: simulation, incidentPlaybook: playbook,
    hints: [playbook.evidence[0], playbook.containment[0], playbook.permanentFix[0]],
    rubric: [
      { id: 'incident-evidence', category: 'root_cause', label: 'Diagnosis supported by evidence', description: 'Connect the symptom, recent change, and causal mechanism; separate confirmed facts from hypotheses.', weight: 5 },
      { id: 'incident-containment', category: 'reliability', label: 'Containment and safe recovery', description: 'Bound impact, protect integrity, state recovery gates and a reversible next step.', weight: 5 },
      { id: 'incident-prevention', category: 'testing', label: 'Permanent fix and regression coverage', description: 'Fix the mechanism, test the failure and define monitoring plus ownership.', weight: 4 },
      { id: 'incident-tradeoffs', category: 'tradeoffs', label: 'Decisions and communication', description: 'Explain the decision journal, alternatives, residual risk and customer communication.', weight: 3 },
    ].map((criterion) => ({ ...criterion, category: criterion.category as Scenario['rubric'][number]['category'], levels: [
      { score: 0, description: 'No actionable response or unsupported assertions.' },
      { score: 1, description: 'Identifies a symptom but omits a safe action or evidence.' },
      { score: 2, description: 'Sound response with evidence; verification or residual risk is incomplete.' },
      { score: 3, description: 'Evidence-backed response with bounded mitigation, explicit recovery gates, tests and trade-offs.' },
    ] })),
    referenceSolution: { explanation, codeOrArtifact: content.artifact, architectureNotes: 'Reference response under the stated constraints. Other justified approaches may be valid.' },
    alternativeApproaches: content.alternatives, commonMistakes: content.mistakes,
    followUpQuestions: [{ id: `${content.id}-followup`, question: content.followUp.question, sampleStrongAnswer: content.followUp.answer, expectedConcepts: content.followUp.concepts }],
  };
}
