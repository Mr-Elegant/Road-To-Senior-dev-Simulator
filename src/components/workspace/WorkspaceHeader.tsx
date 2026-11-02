'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bookmark,
  Lightbulb,
  Send,
  Eye,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { Scenario } from '@/types/scenario';
import { getDifficultyColor, getTypeBadge, formatDuration } from '@/lib/utils';

interface WorkspaceHeaderProps {
  scenario: Scenario;
  timeSpentSeconds: number;
  hintsUsedCount: number;
  totalHintsCount: number;
  onOpenHints: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSubmit: () => void;
  onRevealSolution: () => void;
  onReset: () => void;
  hasReferenceSolution: boolean;
  isSubmitting?: boolean;
}

export function WorkspaceHeader({
  scenario,
  timeSpentSeconds,
  hintsUsedCount,
  totalHintsCount,
  onOpenHints,
  isBookmarked,
  onToggleBookmark,
  onSubmit,
  onRevealSolution,
  onReset,
  isSubmitting,
}: WorkspaceHeaderProps) {
  const diffColor = getDifficultyColor(scenario.difficulty);
  const typeBadge = getTypeBadge(scenario.type);

  return (
    <header className="shrink-0 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back link, title, badges */}
        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
            title="Back to Challenge Library"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
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
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                {scenario.topic}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight">
              {scenario.title}
            </h1>
          </div>
        </div>

        {/* Right: Timer, Hints, Bookmark, Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-xs font-mono text-zinc-700 dark:text-zinc-300 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold">{formatDuration(timeSpentSeconds)}</span>
          </div>

          {/* Progressive Hints Button */}
          <button
            onClick={onOpenHints}
            className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Open Progressive Hints"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Hints ({hintsUsedCount}/{totalHintsCount})
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
            aria-label={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Reveal Reference Solution */}
          <button
            onClick={onRevealSolution}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Inspect reference architecture and solutions"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Reference Solution</span>
          </button>

          {/* Reset Workspace */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Reset code and inputs"
            aria-label="Reset workspace"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Submit and Evaluate Button */}
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit & Evaluate</span>
          </button>
        </div>
      </div>
    </header>
  );
}
