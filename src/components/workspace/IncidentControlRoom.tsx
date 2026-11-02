'use client';

import { useState } from 'react';
import type { IncidentRun, IncidentSimulation } from '@/types/incident';
import type { IncidentTelemetry } from '@/types/scenario';
import { getIncidentView } from '@/lib/incidents/engine';

export function incidentTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

interface Props {
  definition: IncidentSimulation;
  run: IncidentRun;
  telemetry: IncidentTelemetry;
  rationale: string;
  onRationaleChange: (value: string) => void;
  onChoose: (id: string) => void;
}

export function IncidentControlRoom({ definition, run, telemetry, rationale, onRationaleChange, onChoose }: Props) {
  const view = getIncidentView(definition, run, telemetry);
  const stage = view.currentStage;
  return (
    <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-5 p-4 sm:p-6 text-sm">
      <section className="min-w-0 space-y-5" aria-label="Current incident development">
        <ol className="flex gap-2 text-xs" aria-label="Incident timeline">
          {definition.stages.map((item, index) => (
            <li key={item.id} aria-current={stage?.id === item.id ? 'step' : undefined} className={`flex-1 border-t-2 pt-2 ${run.decisions[index] ? 'border-emerald-500' : stage?.id === item.id ? 'border-amber-400' : 'border-zinc-700'} text-zinc-300`}>
              <span className="block font-mono text-zinc-400">{incidentTime(item.atSeconds)}</span>
              {run.decisions[index] ? 'Recorded' : item.atSeconds <= run.elapsedSeconds ? 'Active' : `Development ${index + 1}`}
            </li>
          ))}
        </ol>
        {stage ? (
          <div role="status" className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-amber-300">Development {definition.stages.indexOf(stage) + 1} of {definition.stages.length}</p>
            <h2 className="text-xl font-semibold text-zinc-100">{stage.title}</h2>
            {view.branchBriefing && <p className="border-l-2 border-amber-400 pl-3 text-amber-100">{view.branchBriefing}</p>}
            <p className="text-zinc-300 leading-relaxed">{stage.briefing}</p>
          </div>
        ) : <p role="status" className="text-zinc-200">{view.completed ? 'Exercise complete. Review your decisions and finish the written response before submitting.' : 'Decision recorded. Continue the clock or advance to the next development.'}</p>}
        {stage && <IncidentDecisionForm key={stage.id} options={stage.options} rationale={rationale} onRationaleChange={onRationaleChange} onChoose={onChoose} />}
        {view.completed && (
          <div className="border border-emerald-500/30 rounded-lg p-4 bg-emerald-500/5">
            <h2 className="font-semibold text-emerald-300">Decision benchmark: {view.decisionScore}/100</h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">Based only on the authored action choices; timeouts receive no decision points. Your written reasoning is assessed separately through the existing self-assessment rubric. This is a practice benchmark.</p>
          </div>
        )}
        <section aria-label="Latest telemetry" className="border-t border-zinc-800 pt-4 space-y-3">
          <h2 className="font-semibold text-zinc-200">Latest observations</h2>
          {view.telemetry.metrics.map((metric) => <div key={metric.metricName} className="flex justify-between gap-3 text-xs"><span className="text-zinc-400 break-all">{metric.metricName}</span><strong className="text-zinc-100">{metric.incidentPeak}{metric.unit}</strong></div>)}
          <ul className="space-y-2 font-mono text-xs text-zinc-300">
            {view.telemetry.logs.slice(-3).map((log, index) => <li key={index} className="border-l border-zinc-700 pl-3"><span className="text-zinc-500">{log.timestamp} </span>{log.message}</li>)}
          </ul>
        </section>
      </section>
      <section className="min-w-0 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-4 lg:pt-0 lg:pl-5" aria-label="Decision journal">
        <h2 className="font-semibold text-zinc-100">Decision journal</h2>
        <p className="text-xs text-zinc-400 mt-1 mb-4">Observed consequences remain part of your response history.</p>
        {run.decisions.length === 0 && <p className="text-sm text-zinc-400">No decisions recorded yet. Choose an action and explain the evidence behind it.</p>}
        <ol className="space-y-4">
          {run.decisions.map((decision) => {
            const item = definition.stages.find((candidate) => candidate.id === decision.stageId)!;
            const option = item.options.find((candidate) => candidate.id === decision.optionId);
            const recommended = item.options.find((candidate) => candidate.id === item.review.recommendedOptionId)!;
            return <li key={decision.stageId} className="border border-zinc-800 rounded-lg p-3 space-y-2 text-xs leading-relaxed">
              <p className="font-mono text-zinc-400">{incidentTime(decision.atSeconds)} · {item.title}</p>
              <p className="font-semibold text-zinc-100">{option?.label ?? 'Deadline passed without action'}</p>
              {decision.rationale && <p className="text-zinc-300 whitespace-pre-wrap">Your rationale: {decision.rationale}</p>}
              <p className="text-amber-100">{option?.consequence ?? item.timeout.consequence}</p>
              {view.completed && <details><summary className="cursor-pointer text-blue-300 focus-visible:outline focus-visible:outline-2">Review decision · {decision.outcome}</summary><p className="mt-2 text-zinc-300"><strong>Reference choice: {recommended.label}. </strong>{item.review.reasoning}</p></details>}
            </li>;
          })}
        </ol>
      </section>
    </div>
  );
}

function IncidentDecisionForm({ options, rationale, onRationaleChange, onChoose }: Pick<Props, 'rationale' | 'onRationaleChange' | 'onChoose'> & { options: IncidentSimulation['stages'][number]['options'] }) {
  const [selected, setSelected] = useState('');
  return <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); if (selected && rationale.trim()) onChoose(selected); }}>
    <fieldset className="space-y-2">
      <legend className="font-semibold text-zinc-200 mb-2">Choose your response</legend>
      {options.map((option) => <label key={option.id} className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer leading-relaxed ${selected === option.id ? 'border-blue-400 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}>
        <input type="radio" name="incident-action" value={option.id} checked={selected === option.id} onChange={() => setSelected(option.id)} className="mt-1 accent-blue-500" />
        <span className="text-zinc-200">{option.label}</span>
      </label>)}
    </fieldset>
    <div>
      <label htmlFor="incident-rationale" className="block text-xs font-semibold text-zinc-200 mb-2">Decision rationale</label>
      <textarea id="incident-rationale" rows={3} maxLength={2000} value={rationale} onChange={(event) => onRationaleChange(event.target.value)} placeholder="Cite evidence, expected impact, and the risk you are accepting." className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>
    <button type="submit" disabled={!selected || !rationale.trim()} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300">Apply decision</button>
    <p className="text-xs text-zinc-400">Applying a decision records its consequence. You can retry the exercise with Reset.</p>
  </form>;
}
