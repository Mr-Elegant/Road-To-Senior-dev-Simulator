'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { Scenario } from '@/types/scenario';
import { getDifficultyColor, getTypeBadge } from '@/lib/utils';

interface ChallengeCardProps {
  scenario: Scenario;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  bestScore?: number;
}

export function ChallengeCard({
  scenario,
  isBookmarked,
  onToggleBookmark,
  bestScore,
}: ChallengeCardProps) {
  const diffColor = getDifficultyColor(scenario.difficulty);
  const typeBadge = getTypeBadge(scenario.type);
  const isCompleted = (bestScore ?? 0) >= 70;

  return (
    <div className="group rounded-2xl glass-card p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
      <div>
        {/* Header: Type, Difficulty, Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {scenario.reactExercise && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-cyan-500/40 text-cyan-700 dark:text-cyan-200">React UI · Preview + tests</span>}
            {scenario.incidentSimulation && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-amber-500/40 text-amber-700 dark:text-amber-200">Evolving · {scenario.incidentSimulation.stages.length} stages</span>}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${typeBadge.color}`}
            >
              {typeBadge.label}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}
            >
              {scenario.difficulty}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleBookmark(scenario.id);
            }}
            className={`p-1.5 rounded-lg transition-all ${
              isBookmarked
                ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Challenge'}
            aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark Challenge'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link href={`/challenge/${scenario.id}`} className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-snug">
            {scenario.title}
          </h3>
        </Link>

        {/* Subtopic & Domain */}
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
          {scenario.topic} • {scenario.subtopic}
        </div>

        {/* Problem Statement Excerpt */}
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
          {scenario.problemStatement}
        </p>
      </div>

      {/* Footer: Duration, Score status, Launch */}
      <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            {scenario.estimatedMinutes}m
          </span>

          {bestScore !== undefined && (
            <span
              className={`flex items-center gap-1 font-mono font-semibold text-[11px] ${
                isCompleted
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              {Math.round(bestScore)}%
            </span>
          )}
        </div>

        <Link
          href={`/challenge/${scenario.id}`}
          className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span>Solve</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
