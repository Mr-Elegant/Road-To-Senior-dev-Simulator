import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BarChart2 } from 'lucide-react';

interface TopicMasteryChartProps {
  topicBreakdown: Record<string, { accuracy: number; totalAttempts: number }>;
  allTopics: { name: string; count: number }[];
}

export function TopicMasteryChart({ topicBreakdown, allTopics }: TopicMasteryChartProps) {
  return (
    <div className="rounded-2xl glass-card p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            Accuracy & Mastery By Domain
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time scoring across core architectural disciplines
          </p>
        </div>
        <Link
          href="/library"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group font-mono"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="space-y-4 mt-2">
        {allTopics.map((topic) => {
          const stats = topicBreakdown[topic.name] || { accuracy: 0, totalAttempts: 0 };
          const accuracy = stats.accuracy;
          
          let barGradient = 'from-zinc-400 to-zinc-500';
          let textColor = 'text-zinc-500 dark:text-zinc-400';
          if (stats.totalAttempts > 0) {
            if (accuracy >= 80) {
              barGradient = 'from-emerald-500 to-teal-400';
              textColor = 'text-emerald-600 dark:text-emerald-400';
            } else if (accuracy >= 60) {
              barGradient = 'from-blue-600 to-indigo-500';
              textColor = 'text-blue-600 dark:text-blue-400';
            } else {
              barGradient = 'from-amber-500 to-orange-400';
              textColor = 'text-amber-600 dark:text-amber-400';
            }
          }

          return (
            <div key={topic.name} className="group">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <Link
                  href={`/library?topic=${encodeURIComponent(topic.name)}`}
                  className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">{topic.name}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">({topic.count} scenarios)</span>
                </Link>
                <span className={`font-mono font-bold ${textColor}`}>
                  {stats.totalAttempts > 0 ? `${accuracy}%` : 'Not Started'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${barGradient}`}
                  style={{ width: `${Math.max(stats.totalAttempts > 0 ? 5 : 0, accuracy)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
