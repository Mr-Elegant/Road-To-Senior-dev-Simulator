import type { LoanLabExercise, LoanLabRun } from '@/types/loanLab';

function printable(value: unknown) { return value === undefined ? '(no result)' : JSON.stringify(value, null, 2); }

export function LoanBugTestResults({ exercise, result }: { exercise: LoanLabExercise; result: LoanLabRun }) {
  return <section aria-label="Bug fix test results" className="border-t border-zinc-700 pt-4 space-y-3">
    <h3 className="font-semibold text-zinc-100">{result.passed}/{result.total} tests passed · {result.mode === 'sample' ? 'Sample run' : 'Full submission'}</h3>
    <p className="text-xs text-zinc-400">{result.durationMs} ms · {result.mode === 'sample' ? 'Submit your fix to check every case and record an attempt.' : 'All cases were checked against the code submitted in this run.'}</p>
    <ol className="space-y-2">
      {result.results.map((item) => {
        const test = exercise.tests.find((test) => test.id === item.testId)!;
        return <li key={item.testId} className={`border rounded-lg p-3 text-xs ${item.passed ? 'border-emerald-500/30' : 'border-rose-500/40'}`}>
          <details open={!item.passed}>
            <summary className="cursor-pointer font-semibold text-zinc-200">{item.passed ? 'PASS' : 'FAIL'} · {item.name}</summary>
            <p className="mt-2 text-zinc-300">{test.explanation}</p>
            {item.error && <p className="mt-2 text-rose-200 whitespace-pre-wrap">{item.error}</p>}
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <div className="min-w-0"><strong className="text-emerald-200">Expected</strong><pre className="mt-1 max-h-56 overflow-auto whitespace-pre-wrap break-all text-zinc-300">{printable(test.expected)}</pre></div>
              <div className="min-w-0"><strong className="text-amber-200">Actual</strong><pre className="mt-1 max-h-56 overflow-auto whitespace-pre-wrap break-all text-zinc-300">{printable(item.actual)}</pre></div>
            </div>
            {item.logs.length > 0 && <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-all text-zinc-400">Console: {item.logs.join('\n')}</pre>}
          </details>
        </li>;
      })}
    </ol>
  </section>;
}
