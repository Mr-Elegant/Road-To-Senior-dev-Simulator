'use client';

import { useState } from 'react';
import type { BugScenario } from '@/types/loan';
import { loanLabExerciseMap } from '@/data/loanLabExercises';
import { CodeEditorPane } from '@/components/workspace/CodeEditorPane';
import { useLoanBugLab } from './useLoanBugLab';
import { LoanBugTestResults } from './LoanBugTestResults';

export function LoanBugLab({ bug, bestScore, onRecorded }: { bug: BugScenario; bestScore?: number; onRecorded: () => void }) {
  const exercise = loanLabExerciseMap.get(bug.id)!;
  const lab = useLoanBugLab(exercise, onRecorded);
  const [showReference, setShowReference] = useState(false);
  if (!lab.ready) return <p role="status" className="p-6 text-zinc-400">Restoring your code draft…</p>;

  return <section aria-label="Hands-on bug fixing workspace" className="min-w-0 space-y-5">
    <header className="space-y-2">
      <p className="text-xs font-mono text-amber-200">Exercise {bug.number} · JavaScript · {exercise.tests.length} behavioral tests</p>
      <h2 className="text-xl font-semibold text-zinc-100">{exercise.title}</h2>
      <p className="text-sm leading-relaxed text-zinc-300">{bug.description}</p>
      <p className="text-sm text-rose-200">Observed failure: {bug.productionSymptom}</p>
      {bestScore !== undefined && <p className="text-xs text-emerald-200">Best submitted score: {bestScore}% · current draft is checked separately.</p>}
    </header>
    <div className="border-l-2 border-blue-400 pl-4 text-sm leading-relaxed text-zinc-300">
      <h3 className="font-semibold text-zinc-100 mb-2">Your task and function contract</h3>
      <p>{exercise.contract}</p>
      <p className="text-xs text-zinc-400 mt-2">Edit the extracted dashboard function below. Tests replay state changes and request ordering on fixtures; no imports or React component rendering are needed.</p>
    </div>
    <div className="flex flex-wrap gap-2 text-xs">
      <button disabled={lab.busy} onClick={() => void lab.execute('sample')} className="rounded-lg bg-zinc-700 px-4 py-2 font-semibold text-white hover:bg-zinc-600 disabled:opacity-40">Run sample tests</button>
      <button disabled={lab.busy} onClick={() => void lab.execute('submit')} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-40">Submit fix</button>
      {lab.busy && <button onClick={lab.stop} className="rounded-lg border border-rose-400 px-4 py-2 text-rose-200">Stop tests</button>}
      <button disabled={lab.busy} onClick={() => { if (confirm('Restore starter code? Your current code draft will be replaced; recorded attempts stay in history.')) lab.reset(); }} className="rounded-lg border border-zinc-600 px-3 py-2 text-zinc-200 disabled:opacity-40">Reset starter</button>
      <button disabled={lab.busy || lab.draft.hintsRevealed === exercise.hints.length} onClick={lab.revealHint} className="rounded-lg border border-amber-500/40 px-3 py-2 text-amber-200 disabled:opacity-40">Reveal hint ({lab.draft.hintsRevealed}/{exercise.hints.length})</button>
      <button disabled={lab.busy} onClick={() => { lab.revealReference(); setShowReference(true); }} className="rounded-lg border border-zinc-600 px-3 py-2 text-zinc-200 disabled:opacity-40">Reveal reference fix</button>
    </div>
    {lab.warning && <p role="alert" className="text-sm text-amber-200">{lab.warning}</p>}
    {lab.message && <p role="status" className="text-sm text-zinc-200">{lab.message}</p>}
    {lab.busy && <p role="status" className="text-sm text-zinc-300">Running isolated tests… You can stop this run.</p>}
    {lab.draft.referenceRevealed && <p className="text-xs text-amber-200">Reference viewed: future submissions for this exercise are marked assisted.</p>}
    {lab.draft.hintsRevealed > 0 && <ol className="list-decimal pl-5 text-sm text-amber-100 space-y-2">{exercise.hints.slice(0, lab.draft.hintsRevealed).map((hint) => <li key={hint}>{hint}</li>)}</ol>}
    <div className="h-[28rem] min-w-0 overflow-hidden border border-zinc-700 rounded-lg" aria-label="Bug fix code editor"><CodeEditorPane code={lab.draft.code} onChange={lab.changeCode} language="javascript" readOnly={lab.busy} /></div>
    {!lab.result && !lab.busy && <p className="text-xs text-zinc-400">Run the starter to reproduce the bug, then edit and test your fix. Drafts save automatically on this device. Editing clears previous test feedback.</p>}
    {lab.result && <LoanBugTestResults exercise={exercise} result={lab.result} />}
    {showReference && <section aria-label="Reference fix" className="border-t border-zinc-700 pt-4 space-y-4 text-sm">
      <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-emerald-200">Reference fix and reasoning</h3><button onClick={() => setShowReference(false)} className="text-zinc-300 underline">Hide reference</button></div>
      <p className="text-zinc-300">{bug.rootCause}</p>
      <pre className="max-h-96 overflow-auto rounded-lg bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-200">{exercise.referenceCode}</pre>
      <button disabled={lab.busy} onClick={lab.loadReference} className="rounded-lg border border-emerald-500/50 px-3 py-2 text-emerald-200 disabled:opacity-40">Load reference into editor</button>
      <p className="text-zinc-300 whitespace-pre-line leading-relaxed">{bug.solutionExplanation}</p>
      <details><summary className="text-blue-300 cursor-pointer">Redux adaptation example</summary><pre className="mt-3 max-h-96 overflow-auto text-xs text-zinc-300">{bug.fixedCodeSnippet}</pre></details>
    </section>}
  </section>;
}
