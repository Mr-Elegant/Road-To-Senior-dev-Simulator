import type { IncidentDecision, IncidentRun, IncidentSimulation } from '@/types/incident';
import type { IncidentTelemetry } from '@/types/scenario';

export function createIncidentRun(): IncidentRun {
  return { version: 1, elapsedSeconds: 0, decisions: [] };
}

function decisionScore(definition: IncidentSimulation, state: IncidentRun): number {
  const earned = state.decisions.reduce((sum, decision) => sum + (decision.outcome === 'effective' ? 2 : decision.outcome === 'partial' ? 1 : 0), 0);
  return Math.round(earned / (definition.stages.length * 2) * 100);
}

export function advanceIncident(definition: IncidentSimulation, state: IncidentRun, seconds: number): IncidentRun {
  if (!Number.isFinite(seconds) || seconds <= 0 || state.decisions.length === definition.stages.length) return state;
  const target = Math.min(definition.endSeconds, state.elapsedSeconds + Math.floor(seconds));
  const decisions = [...state.decisions];
  for (let index = decisions.length; index < definition.stages.length; index++) {
    const deadline = definition.stages[index + 1]?.atSeconds ?? definition.endSeconds;
    if (target < deadline) break;
    decisions.push({ stageId: definition.stages[index].id, optionId: null, outcome: 'timeout', atSeconds: deadline, rationale: '' });
  }
  return { ...state, elapsedSeconds: target, decisions };
}

export function chooseIncidentAction(definition: IncidentSimulation, state: IncidentRun, optionId: string, rationale: string): IncidentRun {
  const stage = definition.stages[state.decisions.length];
  const option = stage?.options.find((item) => item.id === optionId);
  if (!stage || !option || state.elapsedSeconds < stage.atSeconds || !rationale.trim() || rationale.length > 2000) return state;
  const decision: IncidentDecision = { stageId: stage.id, optionId, outcome: option.outcome, atSeconds: state.elapsedSeconds, rationale: rationale.trim() };
  return { ...state, decisions: [...state.decisions, decision] };
}

export function getIncidentView(definition: IncidentSimulation, state: IncidentRun, initial: IncidentTelemetry) {
  const revealedStages = definition.stages.filter((stage) => stage.atSeconds <= state.elapsedSeconds);
  const next = definition.stages[state.decisions.length];
  const currentStage = next && next.atSeconds <= state.elapsedSeconds ? next : undefined;
  const previous = state.decisions.at(-1);
  const lastStage = previous ? definition.stages.find((stage) => stage.id === previous.stageId) : undefined;
  const lastConsequence = previous?.optionId ? lastStage?.options.find((option) => option.id === previous.optionId) : lastStage?.timeout;
  const telemetry: IncidentTelemetry = { logs: [...initial.logs], metrics: [...initial.metrics], customerReports: [...initial.customerReports], recentDeployments: [...initial.recentDeployments] };
  // Replay observations in event order. Never include a future stage or an unchosen option.
  for (const stage of revealedStages) {
    const decision = state.decisions.find((item) => item.stageId === stage.id);
    const consequence = decision?.optionId ? stage.options.find((option) => option.id === decision.optionId) : decision ? stage.timeout : undefined;
    for (const update of [stage.telemetry, consequence?.telemetry]) {
      if (!update) continue;
      telemetry.logs.push(...update.logs.map((log) => update === consequence?.telemetry && decision ? {
        ...log, timestamp: `T+${String(Math.floor(decision.atSeconds / 60)).padStart(2, '0')}:${String(decision.atSeconds % 60).padStart(2, '0')}`,
      } : log));
      telemetry.customerReports.push(...update.customerReports);
      telemetry.recentDeployments.push(...update.recentDeployments);
      for (const metric of update.metrics) {
        const index = telemetry.metrics.findIndex((item) => item.metricName === metric.metricName);
        if (index < 0) telemetry.metrics.push(metric);
        else telemetry.metrics[index] = metric;
      }
    }
  }
  return {
    revealedStages, currentStage, telemetry,
    branchBriefing: currentStage && previous ? currentStage.branches[previous.outcome] : undefined,
    severity: lastConsequence?.severity ?? definition.initialSeverity,
    customerImpact: lastConsequence?.customerImpact,
    lastConsequence,
    completed: state.decisions.length === definition.stages.length,
    nextEventSeconds: definition.stages[state.decisions.length]?.atSeconds > state.elapsedSeconds
      ? definition.stages[state.decisions.length].atSeconds
      : definition.stages[state.decisions.length + 1]?.atSeconds ?? definition.endSeconds,
    decisionScore: decisionScore(definition, state),
  };
}

/** Treat browser drafts as untrusted: reconstruct all outcomes from authored actions. */
export function restoreIncidentRun(definition: IncidentSimulation, value: unknown): IncidentRun | null {
  if (!value || typeof value !== 'object') return null;
  const draft = value as Partial<IncidentRun>;
  if (draft.version !== 1 || !Number.isInteger(draft.elapsedSeconds) || draft.elapsedSeconds! < 0 || draft.elapsedSeconds! > definition.endSeconds || !Array.isArray(draft.decisions) || draft.decisions.length > definition.stages.length) return null;
  let state = createIncidentRun();
  for (const [index, decision] of draft.decisions.entries()) {
    if (!decision || !Number.isInteger(decision.atSeconds) || decision.atSeconds < state.elapsedSeconds || decision.atSeconds > draft.elapsedSeconds! || typeof decision.rationale !== 'string' || decision.rationale.length > 2000) return null;
    state = advanceIncident(definition, state, decision.atSeconds - state.elapsedSeconds);
    if (state.decisions.length === index && typeof decision.optionId === 'string') state = chooseIncidentAction(definition, state, decision.optionId, decision.rationale);
    const actual = state.decisions[index];
    if (!actual || actual.stageId !== decision.stageId || actual.optionId !== decision.optionId || actual.outcome !== decision.outcome || actual.atSeconds !== decision.atSeconds || actual.rationale !== decision.rationale) return null;
  }
  state = advanceIncident(definition, state, draft.elapsedSeconds! - state.elapsedSeconds);
  if (state.decisions.length !== draft.decisions.length || state.elapsedSeconds !== draft.elapsedSeconds) return null;
  return state;
}

export function incidentTranscript(definition: IncidentSimulation, state: IncidentRun): Record<string, string> {
  const answers: Record<string, string> = {
    'incident.summary': `Definition version ${definition.version}. ${state.decisions.length}/${definition.stages.length} decisions recorded; simulated time ${state.elapsedSeconds}s. Decision benchmark: ${decisionScore(definition, state)}/100. Written rubric is assessed separately.`,
  };
  for (const decision of state.decisions) {
    const stage = definition.stages.find((item) => item.id === decision.stageId)!;
    const option = stage.options.find((item) => item.id === decision.optionId);
    answers[`incident.${stage.id}`] = `${stage.title} @ ${decision.atSeconds}s\nAction: ${option?.label ?? 'No action before deadline'}\nRationale: ${decision.rationale || 'None recorded'}\nObserved outcome: ${option?.consequence ?? stage.timeout.consequence}\nBenchmark: ${decision.outcome}`;
  }
  return answers;
}
