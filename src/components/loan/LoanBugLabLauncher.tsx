'use client';

import { useAppDispatch } from '@/lib/redux/store';
import { setActiveBugScenarioId } from '@/lib/redux/slices/uiSlice';

export function LoanBugLabLauncher({ completed }: { completed: number }) {
  const dispatch = useAppDispatch();
  return <section aria-label="Start hands-on loan bug lab" className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
    <div><h2 className="font-semibold text-zinc-100">Fix real dashboard bugs in code</h2><p className="mt-2 text-sm text-zinc-300">Eight broken functions, an editable code workspace, and automated regression tests. {completed}/8 exercises completed.</p></div>
    <button onClick={() => { dispatch(setActiveBugScenarioId('bug-1-race-condition')); requestAnimationFrame(() => document.getElementById('loan-bug-lab')?.scrollIntoView({ block: 'start' })); }} className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Start bug-fixing lab</button>
  </section>;
}
