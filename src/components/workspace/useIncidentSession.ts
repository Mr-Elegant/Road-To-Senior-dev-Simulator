'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Scenario } from '@/types/scenario';
import { advanceIncident, chooseIncidentAction, createIncidentRun, restoreIncidentRun } from '@/lib/incidents/engine';
import { storage } from '@/lib/persistence/localStorageAdapter';

const emptyNotes = { rootCauseHypothesis: '', evidence: '', immediateMitigation: '', permanentCorrection: '', regressionTests: '', monitoringPlan: '' };
export type IncidentNotes = typeof emptyNotes;
const freshDraft = () => ({ run: createIncidentRun(), notes: { ...emptyNotes }, rationale: '' });

export function useIncidentSession(scenario: Scenario) {
  const [draft, setDraft] = useState(freshDraft);
  const [ready, setReady] = useState(false);
  const [saveWarning, setSaveWarning] = useState('');
  const [resetVersion, setResetVersion] = useState(0);
  const definition = scenario.incidentSimulation;
  const key = storage.scopedKey(`fullstack_incident_draft_v1:${scenario.id}`);

  useEffect(() => {
    if (!definition) { setReady(true); return; }
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        if (raw.length > 4_000_000) throw new Error('Oversized draft');
        const saved = JSON.parse(raw);
        const run = restoreIncidentRun(definition, saved.run);
        if (!run || typeof saved.rationale !== 'string' || saved.rationale.length > 2000 || !saved.notes || Object.keys(emptyNotes).some((name) => typeof saved.notes[name] !== 'string' || saved.notes[name].length > 100000)) throw new Error('Invalid draft');
        const notes = Object.fromEntries(Object.keys(emptyNotes).map((name) => [name, saved.notes[name]])) as IncidentNotes;
        setDraft({ run, notes, rationale: saved.rationale });
      }
    } catch {
      setSaveWarning('The saved incident draft could not be restored. A fresh exercise is ready.');
    }
    setReady(true);
  }, [definition, key]);

  useEffect(() => {
    if (!definition || !ready) return;
    try { localStorage.setItem(key, JSON.stringify(draft)); }
    catch { setSaveWarning('This browser could not save the incident draft. Keep this tab open until you record your attempt.'); }
  }, [definition, draft, key, ready]);

  const advance = useCallback((seconds: number) => {
    if (definition) setDraft((current) => ({ ...current, run: advanceIncident(definition, current.run, seconds) }));
  }, [definition]);
  const choose = useCallback((id: string) => {
    if (definition) setDraft((current) => {
      const run = chooseIncidentAction(definition, current.run, id, current.rationale);
      return run === current.run ? current : { ...current, run, rationale: '' };
    });
  }, [definition]);
  return {
    ...draft, ready, saveWarning, resetVersion, advance, choose,
    setNote: (name: keyof IncidentNotes, value: string) => setDraft((current) => ({ ...current, notes: { ...current.notes, [name]: value.slice(0, 100000) } })),
    setRationale: (rationale: string) => setDraft((current) => ({ ...current, rationale })),
    reset: () => { setDraft(freshDraft()); setSaveWarning(''); setResetVersion((value) => value + 1); },
  };
}
