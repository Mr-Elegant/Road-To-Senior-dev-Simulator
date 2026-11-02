import { describe, expect, it } from 'vitest';
import { advanceIncident, chooseIncidentAction, createIncidentRun, getIncidentView, restoreIncidentRun } from '@/lib/incidents/engine';
import type { IncidentSimulation } from '@/types/incident';

const signals = { logs: [], metrics: [], customerReports: [], recentDeployments: [] };
const simulation: IncidentSimulation = {
  version: 1, initialSeverity: 'SEV1',
  stages: [0, 120, 300].map((atSeconds, index) => ({
    id: `stage-${index}`, atSeconds, title: `Development ${index}`, briefing: 'An observed service failure.',
    telemetry: signals,
    branches: { effective: 'Containment worked; investigate residual failures.', harmful: 'The previous action amplified the outage.', timeout: 'No containment was applied.' },
    options: [
      { id: 'contain', label: 'Contain load', outcome: 'effective', consequence: 'Load is bounded.', severity: 'SEV2', customerImpact: 'Checkout is recovering.', telemetry: signals },
      { id: 'scale', label: 'Increase pressure', outcome: 'harmful', consequence: 'Capacity is exhausted.', severity: 'SEV1', customerImpact: 'More customers fail.', telemetry: signals },
    ],
    timeout: { consequence: 'Uncontained load continues.', severity: 'SEV1', customerImpact: 'Requests keep failing.', telemetry: signals },
    review: { recommendedOptionId: 'contain', reasoning: 'Bound admission before increasing backend pressure.' },
  })),
  endSeconds: 480,
};

describe('evolving incident state transitions', () => {
  it('reveals only current developments and applies a decision once', () => {
    const initial = createIncidentRun();
    expect(getIncidentView(simulation, initial, signals).revealedStages).toHaveLength(1);
    const chosen = chooseIncidentAction(simulation, initial, 'contain', 'Connection pressure needs bounding.');
    expect(initial.decisions).toHaveLength(0);
    expect(chosen.decisions).toHaveLength(1);
    expect(chooseIncidentAction(simulation, chosen, 'scale', 'Change my mind')).toEqual(chosen);
    expect(getIncidentView(simulation, chosen, signals).severity).toBe('SEV2');
  });

  it('unlocks later developments on schedule and branches on the prior action', () => {
    const chosen = chooseIncidentAction(simulation, createIncidentRun(), 'contain', 'Protect the database.');
    expect(advanceIncident(simulation, chosen, 119).decisions).toHaveLength(1);
    const next = advanceIncident(simulation, chosen, 120);
    expect(getIncidentView(simulation, next, signals).currentStage?.id).toBe('stage-1');
    expect(getIncidentView(simulation, next, signals).branchBriefing).toContain('Containment worked');
    const harmful = advanceIncident(simulation, chooseIncidentAction(simulation, createIncidentRun(), 'scale', 'Add workers.'), 120);
    expect(getIncidentView(simulation, harmful, signals).branchBriefing).toContain('amplified');
  });

  it('records every missed deadline without skipping decisions on a large time jump', () => {
    const ended = advanceIncident(simulation, createIncidentRun(), 900);
    expect(ended.elapsedSeconds).toBe(480);
    expect(ended.decisions.map((decision) => decision.outcome)).toEqual(['timeout', 'timeout', 'timeout']);
    expect(ended.decisions.map((decision) => decision.atSeconds)).toEqual([120, 300, 480]);
    expect(getIncidentView(simulation, ended, signals).completed).toBe(true);
  });

  it('rejects unknown choices, missing rationale and invalid clock input', () => {
    const state = createIncidentRun();
    expect(chooseIncidentAction(simulation, state, 'unknown', 'A reason')).toEqual(state);
    expect(chooseIncidentAction(simulation, state, 'contain', '  ')).toEqual(state);
    expect(advanceIncident(simulation, state, -10)).toEqual(state);
    expect(advanceIncident(simulation, state, Number.NaN)).toEqual(state);
  });

  it('restores by replaying valid decisions and rejects fabricated or stale drafts', () => {
    const state = advanceIncident(simulation, chooseIncidentAction(simulation, createIncidentRun(), 'contain', 'Protect capacity.'), 180);
    expect(restoreIncidentRun(simulation, JSON.parse(JSON.stringify(state)))).toEqual(state);
    expect(restoreIncidentRun(simulation, { ...state, version: 0 })).toBeNull();
    expect(restoreIncidentRun(simulation, { ...state, decisions: [{ ...state.decisions[0], optionId: 'missing' }] })).toBeNull();
    expect(restoreIncidentRun(simulation, { ...state, decisions: [{ ...state.decisions[0], outcome: 'harmful' }] })).toBeNull();
    expect(restoreIncidentRun(simulation, { ...state, elapsedSeconds: 1e9 })).toBeNull();
  });

  it('finishes after the final decision and freezes the completed clock', () => {
    let state = createIncidentRun();
    for (const seconds of [0, 120, 180]) {
      state = advanceIncident(simulation, state, seconds);
      state = chooseIncidentAction(simulation, state, 'contain', 'Protect customer outcomes.');
    }
    expect(getIncidentView(simulation, state, signals).completed).toBe(true);
    expect(advanceIncident(simulation, state, 20)).toEqual(state);
  });

  it('hides future and unchosen telemetry, timestamps observed consequences, and preserves source data', () => {
    const definition = structuredClone(simulation);
    const log = (message: string) => ({ timestamp: 'T+00:00', level: 'WARN' as const, service: 'test', message });
    definition.stages[1].telemetry = { ...signals, logs: [log('future development')] };
    definition.stages[0].options[0].telemetry = { ...signals, logs: [log('chosen consequence')] };
    definition.stages[0].options[1].telemetry = { ...signals, logs: [log('unchosen consequence')] };
    let run = advanceIncident(definition, createIncidentRun(), 45);
    run = chooseIncidentAction(definition, run, 'contain', 'Bound pressure after reviewing the alert.');
    const view = getIncidentView(definition, run, signals);
    expect(view.telemetry.logs.map((item) => item.message)).toEqual(['chosen consequence']);
    expect(view.telemetry.logs[0].timestamp).toBe('T+00:45');
    expect(signals.logs).toHaveLength(0);
    expect(definition.stages[0].options[0].telemetry.logs[0].timestamp).toBe('T+00:00');
    const later = getIncidentView(definition, advanceIncident(definition, run, 75), signals);
    expect(later.telemetry.logs.map((item) => item.message)).toEqual(['chosen consequence', 'future development']);
  });

  it('restores missed deadlines exactly and rejects reordered or premature decisions', () => {
    const timedOut = advanceIncident(simulation, createIncidentRun(), 480);
    expect(restoreIncidentRun(simulation, timedOut)).toEqual(timedOut);
    expect(restoreIncidentRun(simulation, { ...timedOut, decisions: timedOut.decisions.toReversed() })).toBeNull();
    expect(restoreIncidentRun(simulation, { ...timedOut, decisions: [{ ...timedOut.decisions[0], atSeconds: 119 }] })).toBeNull();
  });
});
