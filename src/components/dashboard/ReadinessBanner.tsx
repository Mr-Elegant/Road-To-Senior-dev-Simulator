import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Award, Compass, ArrowRight, Zap, Target } from 'lucide-react';
import { InterviewReadinessReport } from '@/types/userProgress';

interface ReadinessBannerProps {
  report: InterviewReadinessReport;
}

export function ReadinessBanner({ report }: ReadinessBannerProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Senior Benchmark':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
      case 'Interview Ready':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
      default:
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    }
  };

  const score = report.overallReadinessScore;
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-gradient-to-br from-zinc-50/90 via-white to-blue-50/40 dark:from-zinc-900/95 dark:via-zinc-900/90 dark:to-indigo-950/25 p-6 shadow-sm backdrop-blur-xl transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left side: Readiness Score Ring and Overview */}
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Radial score ring */}
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                {score}%
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Readiness
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide border font-mono ${getTierColor(
                  report.readinessTier
                )}`}
              >
                {report.readinessTier} Tier
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-mono">
                <Compass className="w-3.5 h-3.5 text-blue-500" /> Benchmarked Assessment
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Senior Engineering Interview Readiness:{' '}
              <span className="text-blue-600 dark:text-blue-400">{score}%</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              Calculated across challenge completion breadth, rubric criteria depth (root cause, security, reliability), and problem-solving streak.
            </p>

            {/* Weakest and Strongest Areas Pills */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-1">
              {report.weakestAreas.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Priority Focus:
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {report.weakestAreas.map((area) => (
                      <Link
                        key={area}
                        href={`/library?topic=${encodeURIComponent(area)}`}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                      >
                        {area}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {report.strongestAreas.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Strongest:
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {report.strongestAreas.map((area) => (
                      <span
                        key={area}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Quick launch recommendation */}
        {report.recommendedScenarioIds.length > 0 && (
          <div className="lg:w-80 flex flex-col justify-between p-4 rounded-xl border border-blue-500/25 bg-blue-500/5 dark:bg-blue-500/10 shadow-xs">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Recommended Next Challenge
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                Strengthen {report.weakestAreas[0] || 'Core Architecture'}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Targeted practice to close your highest-impact skill gap.
              </p>
            </div>

            <Link
              href={`/challenge/${report.recommendedScenarioIds[0]}`}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:shadow-blue-500/20"
            >
              <span>Launch Recommended</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Mandatory Transparent Disclaimer Notice */}
      <div className="mt-5 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
        <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-zinc-700 dark:text-zinc-300">Disclaimer: </strong>
          {report.disclaimer}
        </p>
      </div>
    </div>
  );
}
