'use client';

import { useEffect, useState } from 'react';
import type { Scenario } from '@/types/scenario';
import { getIncidentView } from '@/lib/incidents/engine';
import { IncidentTelemetryPane, type IncidentTelemetryPaneProps } from './IncidentTelemetryPane';
import { IncidentControlRoom, incidentTime } from './IncidentControlRoom';
import type { useIncidentSession } from './useIncidentSession';

interface Props {
  scenario: Scenario;
  session: ReturnType<typeof useIncidentSession>;
  report: Omit<IncidentTelemetryPaneProps, 'telemetry'>;
}

export function EvolvingIncidentWorkspace({ scenario, session, report }: Props) {
  const definition = scenario.incidentSimulation!;
  const initial = scenario.incidentTelemetry!;
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'live' | 'report'>('live');
  const view = getIncidentView(definition, session.run, initial);
  const { advance, ready } = session;
  useEffect(() => {
    if (!running || view.completed || !ready) return;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') advance(1);
    }, 1000);
    return () => clearInterval(timer);
  }, [advance, running, ready, view.completed]);

  if (!session.ready) return <p role="status" className="p-6 text-zinc-300">Restoring incident workspace…</p>;
  return <div className="xl:h-full flex flex-col min-w-0 bg-zinc-950 text-zinc-100">
    <div className="border-b border-zinc-800 bg-zinc-900 p-3 space-y-3 shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm"><strong className="rounded border border-amber-400/40 px-2 py-1 text-amber-200">{view.severity}</strong><span className="font-mono" aria-label="Simulation time">{incidentTime(session.run.elapsedSeconds)}</span><span className="text-xs text-zinc-400">{view.completed ? 'Complete' : running ? 'Running' : 'Paused'}</span></div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button disabled={view.completed} onClick={() => setRunning(!running)} className="rounded border border-zinc-600 px-3 py-2 hover:bg-zinc-800 disabled:opacity-40">{running && !view.completed ? 'Pause simulation' : 'Start simulation'}</button>
          <button disabled={view.completed} onClick={() => advance(view.nextEventSeconds - session.run.elapsedSeconds)} className="rounded border border-zinc-600 px-3 py-2 hover:bg-zinc-800 disabled:opacity-40">Advance to next event</button>
        </div>
      </div>
      <p className="text-xs text-zinc-400">Synthetic incident · 8 simulated minutes. Advancing past a decision deadline records inaction. Hidden tabs pause the clock; refreshed drafts resume paused.</p>
      {view.customerImpact && <p role="status" className="text-xs text-amber-100">Customer impact: {view.customerImpact}</p>}
      {session.saveWarning && <p role="alert" className="text-xs text-amber-200">{session.saveWarning}</p>}
      <div className="flex flex-wrap gap-2" aria-label="Incident workspace views">
        <button aria-pressed={tab === 'live'} onClick={() => setTab('live')} className={`rounded px-3 py-2 text-xs font-semibold ${tab === 'live' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-800'}`}>Live response</button>
        <button aria-pressed={tab === 'report'} onClick={() => setTab('report')} className={`rounded px-3 py-2 text-xs font-semibold ${tab === 'report' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-800'}`}>Telemetry & written report</button>
      </div>
    </div>
    <div className={tab === 'report' ? 'h-[56rem] xl:h-auto xl:flex-1 xl:min-h-0 overflow-hidden' : 'xl:flex-1 xl:min-h-0 xl:overflow-y-auto'}>
      {tab === 'live'
        ? <IncidentControlRoom definition={definition} run={session.run} telemetry={initial} rationale={session.rationale} onRationaleChange={session.setRationale} onChoose={session.choose} />
        : <IncidentTelemetryPane {...report} telemetry={view.telemetry} />}
    </div>
  </div>;
}
