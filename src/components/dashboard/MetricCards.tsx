import React from 'react';
import { BookOpen, CheckCircle2, Award, Flame, BookmarkCheck, TrendingUp } from 'lucide-react';

interface MetricCardsProps {
  totalScenarios: number;
  completedCount: number;
  averageScore: number;
  streakDays: number;
  bookmarksCount: number;
  readinessScore: number;
}

export function MetricCards({
  totalScenarios,
  completedCount,
  averageScore,
  streakDays,
  bookmarksCount,
  readinessScore,
}: MetricCardsProps) {
  const cards = [
    {
      label: 'Scenarios In Library',
      value: totalScenarios,
      subtext: 'Across 10 Core Domains',
      icon: BookOpen,
      iconColor: 'text-blue-500',
      accentBg: 'bg-blue-500/10 dark:bg-blue-500/15',
      borderHover: 'hover:border-blue-500/40',
    },
    {
      label: 'Completed Scenarios',
      value: `${completedCount} / ${totalScenarios}`,
      subtext: `${Math.round((completedCount / Math.max(1, totalScenarios)) * 100)}% Coverage`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      borderHover: 'hover:border-emerald-500/40',
    },
    {
      label: 'Average Performance',
      value: `${Math.round(averageScore)}%`,
      subtext: 'Rubric & Test Passing',
      icon: Award,
      iconColor: 'text-purple-500',
      accentBg: 'bg-purple-500/10 dark:bg-purple-500/15',
      borderHover: 'hover:border-purple-500/40',
    },
    {
      label: 'Readiness Estimate',
      value: `${readinessScore} / 100`,
      subtext: 'Benchmarked Metric',
      icon: TrendingUp,
      iconColor: 'text-indigo-500',
      accentBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      borderHover: 'hover:border-indigo-500/40',
    },
    {
      label: 'Learning Streak',
      value: `${streakDays} Days`,
      subtext: 'Consistent Practice',
      icon: Flame,
      iconColor: 'text-amber-500',
      accentBg: 'bg-amber-500/10 dark:bg-amber-500/15',
      borderHover: 'hover:border-amber-500/40',
    },
    {
      label: 'Bookmarked Targets',
      value: bookmarksCount,
      subtext: 'Saved for Focus',
      icon: BookmarkCheck,
      iconColor: 'text-cyan-500',
      accentBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
      borderHover: 'hover:border-cyan-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`p-4 rounded-2xl glass-card flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5 ${c.borderHover}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-tight text-zinc-500 dark:text-zinc-400 leading-tight">
                {c.label}
              </span>
              <div className={`p-1.5 rounded-xl ${c.accentBg} transition-transform group-hover:scale-110`}>
                <Icon className={`w-4 h-4 ${c.iconColor}`} />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
                {c.value}
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                {c.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
