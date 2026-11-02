import React from 'react';
import Link from 'next/link';
import { History, CheckCircle2, XCircle, ArrowUpRight, Clock } from 'lucide-react';
import { AttemptSubmission } from '@/types/userProgress';
import { scenarioMap } from '@/data';
import { formatDuration } from '@/lib/utils';
import { loanLabAttemptInfo } from '@/lib/loanLab/attempts';

interface RecentAttemptsListProps {
  attempts: AttemptSubmission[];
}

export function RecentAttemptsList({ attempts }: RecentAttemptsListProps) {
  if (attempts.length === 0) {
    return (
      <div className="rounded-2xl glass-card p-6 shadow-sm text-center">
        <History className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          No Attempts Yet
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
          Start a challenge from the library to test your engineering diagnosis, code, and architectural judgment.
        </p>
        <Link
          href="/library"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          Browse Challenge Library
        </Link>
      </div>
    );
  }

  const recent = attempts.slice(0, 5);

  return (
    <div className="rounded-2xl glass-card p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
            <History className="w-4 h-4 text-blue-500" />
            Recent Simulation Attempts
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Your latest submissions and rubric evaluations
          </p>
        </div>
        <Link
          href="/progress"
          className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group"
        >
          <span>Full History</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {recent.map((att) => {
          const scenario = scenarioMap.get(att.scenarioId);
          const loanLab = loanLabAttemptInfo(att.scenarioId);
          const isPassed = att.totalScorePercentage >= 70;

          return (
            <div
              key={att.id}
              className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-xl flex-shrink-0 ${
                    isPassed
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href={loanLab?.href || `/challenge/${att.scenarioId}`}
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                  >
                    {scenario?.title || loanLab?.title || att.scenarioId}
                  </Link>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
                    <span>{scenario?.topic || loanLab?.topic || 'Core'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(att.timeSpentSeconds)}
                    </span>
                    <span>•</span>
                    <span>{new Date(att.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="text-right">
                  <div
                    className={`text-sm font-bold font-mono ${
                      isPassed
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {Math.round(att.totalScorePercentage)}%
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {isPassed ? 'Benchmark Met' : 'Needs Review'}
                  </div>
                </div>
                <Link
                  href={loanLab?.href || `/challenge/${att.scenarioId}`}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                  title="View Scenario"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
