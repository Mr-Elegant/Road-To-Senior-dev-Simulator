'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { selectActiveBugScenarioId, selectActiveBugScenario } from '@/lib/redux/selectors';
import { setActiveBugScenarioId } from '@/lib/redux/slices/uiSlice';
import { loanBugScenarios } from '@/data/loanBugScenarios';
import { LoanBugLab } from './LoanBugLab';

export function BugScenariosExplorer({ scores, onRecorded }: { scores: Record<string, number>; onRecorded: () => void }) {
  const dispatch = useAppDispatch();
  const activeBugId = useAppSelector(selectActiveBugScenarioId);
  const activeBug = useAppSelector(selectActiveBugScenario);
  if (!activeBugId) return null;
  return <section id="loan-bug-lab" aria-label="Loan dashboard bug fixing lab" className="rounded-xl border border-amber-500/30 bg-zinc-900/70 p-4 sm:p-6 space-y-5 scroll-mt-20">
    <header className="flex items-start justify-between gap-3 border-b border-zinc-700 pb-4">
      <div><p className="text-xs uppercase tracking-wider text-amber-200">Hands-on engineering lab · 8 production bugs</p><h2 className="mt-2 text-lg font-semibold text-zinc-100">Production Incident & Concurrency Deep Dives</h2><p className="text-sm text-zinc-400 mt-1">Reproduce a failure, edit the broken function, and submit a tested fix.</p></div>
      <button aria-label="Close Bug Scenarios Explorer" onClick={() => dispatch(setActiveBugScenarioId(null))} className="rounded border border-zinc-600 px-3 py-2 text-xs text-zinc-300">Close lab</button>
    </header>
    <div className="xl:hidden">
      <label htmlFor="loan-bug-choice" className="block text-xs font-semibold text-zinc-300 mb-2">Choose a bug to fix</label>
      <select id="loan-bug-choice" value={activeBugId} onChange={(event) => dispatch(setActiveBugScenarioId(event.target.value))} className="w-full min-w-0 rounded-lg border border-zinc-600 bg-zinc-950 p-3 text-sm text-zinc-200">
        {loanBugScenarios.map((bug) => <option key={bug.id} value={bug.id}>{bug.number}. {bug.title}</option>)}
      </select>
    </div>
    <div className="grid xl:grid-cols-[16rem_minmax(0,1fr)] gap-5">
      <nav aria-label="Bug fixing exercises" className="hidden xl:grid grid-cols-1 content-start gap-2">
        {loanBugScenarios.map((bug) => <button key={bug.id} aria-pressed={activeBugId === bug.id} onClick={() => dispatch(setActiveBugScenarioId(bug.id))} className={`rounded-lg border p-3 text-left text-xs leading-relaxed ${activeBugId === bug.id ? 'border-amber-400 bg-amber-500/10 text-amber-100' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}>
          <span className="block font-mono text-amber-300 mb-1">BUG #{bug.number} · {bug.category}</span>
          <span className="font-semibold">{bug.title}</span>
          {scores[bug.id] !== undefined && <span className="block mt-2 text-emerald-200">Best: {scores[bug.id]}%{scores[bug.id] === 100 ? ' · Complete' : ''}</span>}
        </button>)}
      </nav>
      {activeBug && <LoanBugLab key={activeBug.id} bug={activeBug} bestScore={scores[activeBug.id]} onRecorded={onRecorded} />}
    </div>
  </section>;
}

