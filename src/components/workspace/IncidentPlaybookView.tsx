import type { Scenario } from '@/types/scenario';
import { incidentTime } from './IncidentControlRoom';

export function IncidentPlaybookView({ scenario }: { scenario: Scenario }) {
  const playbook = scenario.incidentPlaybook!;
  const sections = [
    ['Evidence chain', playbook.evidence], ['Immediate containment', playbook.containment],
    ['Permanent correction', playbook.permanentFix], ['Recovery verification gates', playbook.verification],
    ['Regression tests', playbook.regressionTests], ['Rollback constraints', playbook.rollback],
    ['Communication and handoff', playbook.communication],
  ] as const;
  return <article className="space-y-6 text-sm leading-relaxed text-zinc-300">
    <p className="border-l-2 border-blue-400 pl-3">Reference response for this exercise’s stated constraints. Other evidence-backed approaches may be valid.</p>
    <section><h3 className="font-semibold text-zinc-100 mb-2">Diagnosis</h3><p>{playbook.diagnosis}</p></section>
    <section className="space-y-4"><h3 className="font-semibold text-zinc-100">Development-by-development decisions</h3>
      {scenario.incidentSimulation!.stages.map((stage) => <div key={stage.id} className="border border-zinc-800 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold text-zinc-200">{incidentTime(stage.atSeconds)} · {stage.title}</h4>
        <p className="text-emerald-200">Reference choice: {stage.options.find((option) => option.id === stage.review.recommendedOptionId)!.label}</p>
        <p>{stage.review.reasoning}</p>
        <details><summary className="cursor-pointer text-blue-300">Other choices and consequences</summary><ul className="mt-2 space-y-2">{stage.options.filter((option) => option.id !== stage.review.recommendedOptionId).map((option) => <li key={option.id}><strong>{option.label}: </strong>{option.consequence}</li>)}</ul></details>
      </div>)}
    </section>
    {sections.map(([title, items]) => <section key={title}><h3 className="font-semibold text-zinc-100 mb-2">{title}</h3><ol className="list-decimal pl-5 space-y-2">{items.map((item) => <li key={item}>{item}</li>)}</ol></section>)}
    <section><h3 className="font-semibold text-zinc-100 mb-2">Official technical references</h3><ul className="space-y-2">{playbook.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-blue-300 underline underline-offset-2">{source.title}</a></li>)}</ul></section>
  </article>;
}
