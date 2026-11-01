import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Scenario } from '@/types/scenario';

interface WeakAreasPanelProps {
  weakestAreas: string[];
  allScenarios: Scenario[];
}

export function WeakAreasPanel({ weakestAreas, allScenarios }: WeakAreasPanelProps) {
  if (weakestAreas.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Balanced Technical Mastery
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              No severe skill gaps detected. Continue exploring Staff/Principal architecture scenarios to push your bar higher.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-card p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Weakest Technical Areas
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Targeted drills recommended before interviewing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {weakestAreas.map((topic) => {
          const matching = allScenarios.filter((s) => s.topic === topic);
          const topScenario = matching[0];

          return (
            <div
              key={topic}
              className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 flex flex-col justify-between group hover:border-rose-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                    {topic}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {matching.length} Scenarios
                  </span>
                </div>
                {topScenario && (
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {topScenario.title}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {topScenario.problemStatement}
                    </p>
                  </div>
                )}
              </div>

              {topScenario && (
                <Link
                  href={`/challenge/${topScenario.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors"
                >
                  <span>Practice Scenario</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
