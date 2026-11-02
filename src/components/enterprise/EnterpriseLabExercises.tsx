'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { EnterpriseLab } from '@/data/enterpriseLabs';
import type { AttemptSubmission } from '@/types/userProgress';
import { getEnterpriseLabProgress } from '@/lib/enterpriseLabs';
import { storage } from '@/lib/persistence/localStorageAdapter';

export function EnterpriseLabExercises({ lab }: { lab: EnterpriseLab }) {
  const [attempts, setAttempts] = useState<AttemptSubmission[] | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    const accountId = storage.getAccountId();
    const refresh = async () => {
      try {
        const progress = await storage.getProgress();
        if (active && storage.getAccountId() === accountId) { setAttempts(progress.attempts); setError(false); }
      } catch {
        if (active) setError(true);
      }
    };
    void refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); window.removeEventListener('storage', refresh); };
  }, [lab.id, retry]);

  const progress = getEnterpriseLabProgress(lab, attempts ?? []);
  return (
    <section aria-labelledby="project-exercises-heading" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h2 id="project-exercises-heading" className="text-xl font-semibold">Project exercises</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Follow this sequence or open the exercise you want to practice.</p>
        </div>
        <div className="sm:min-w-56 space-y-2 text-sm" aria-live="polite">
          {error ? <p className="text-amber-800 dark:text-amber-300">Progress unavailable. <button onClick={() => setRetry(value => value + 1)} className="underline">Retry</button></p>
            : attempts === null ? <p role="status" className="text-zinc-500">Loading shared progress…</p>
              : <><p>{progress.passed} of {progress.total} exercises passed</p><progress aria-label={`${lab.title} exercises passed`} value={progress.passed} max={progress.total} className="w-full h-2 accent-blue-600" /></>}
        </div>
      </div>

      <ol className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
        {lab.exercises.map((exercise, index) => {
          const score = attempts === null || error ? undefined : progress.scores[exercise.id];
          return (
            <li key={exercise.id}>
              <Link href={exercise.href} className="group flex items-start sm:items-center gap-3 sm:gap-5 py-5 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2">
                <span className="font-mono text-sm text-zinc-500 mt-0.5 w-6 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">{exercise.title}</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">JavaScript · ~{exercise.minutes} min · {exercise.tests} test cases</p>
                  <p className={`text-xs flex items-center gap-1.5 ${score !== undefined && score >= 70 ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    {score !== undefined && score >= 70 && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                    {error ? 'Progress unavailable' : attempts === null ? 'Checking saved attempts…' : score === undefined ? 'Not attempted' : `Best score: ${Math.round(score)}% · ${score >= 70 ? 'Passed' : 'Needs practice'}`}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 shrink-0 text-blue-700 dark:text-blue-300 mt-1" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        {lab.format === 'dashboard' ? 'Loan progress uses full-suite behavioral submissions.' : 'Challenge progress uses your saved rubric assessment; test results are reviewed separately.'}
        {' '}An exercise is marked passed at 70% or higher. Your best saved score is shared with the existing workspace. These are practice results.
      </p>
    </section>
  );
}
