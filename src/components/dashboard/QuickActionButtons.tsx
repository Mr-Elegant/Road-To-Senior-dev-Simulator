'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shuffle, Timer, Trophy, Flame, RotateCcw, Code2, Sparkles, Landmark, GraduationCap, Database } from 'lucide-react';
import { Scenario } from '@/types/scenario';
import { UserProgressData } from '@/types/userProgress';

interface QuickActionButtonsProps {
  allScenarios: Pick<Scenario, 'id' | 'topic'>[];
  progress: UserProgressData | null;
  weakestTopic?: string;
}

export function QuickActionButtons({
  allScenarios,
  progress,
  weakestTopic,
}: QuickActionButtonsProps) {
  const router = useRouter();

  const handleRandom = () => {
    if (allScenarios.length === 0) return;
    const randomIdx = Math.floor(Math.random() * allScenarios.length);
    router.push(`/challenge/${allScenarios[randomIdx].id}`);
  };

  const handlePracticeWeak = () => {
    if (weakestTopic) {
      router.push(`/library?topic=${encodeURIComponent(weakestTopic)}`);
    } else {
      router.push('/library');
    }
  };

  const handleReviewIncorrect = () => {
    const attempts = progress?.attempts || [];
    const incorrect = attempts.filter((a) => a.totalScorePercentage < 70);
    if (incorrect.length > 0) {
      router.push(`/challenge/${incorrect[0].scenarioId}`);
    } else {
      router.push('/library?filter=needs_practice');
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Primary Simulation Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Start a random challenge */}
        <button
          onClick={handleRandom}
          className="px-3.5 py-2 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Shuffle className="w-3.5 h-3.5 text-indigo-500" />
          <span>Start Random Challenge</span>
        </button>

        {/* 2. Start a timed interview */}
        <button
          onClick={() => router.push('/interview?mode=timed')}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Start Timed Interview</span>
        </button>

        {/* 3. Start a senior-level mock interview */}
        <button
          onClick={() => router.push('/interview?mode=senior_mock')}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs shadow-purple-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Senior Mock Interview</span>
        </button>

        {/* 4. AI Conversational Interviewer */}
        <button
          onClick={() => router.push('/interview?mode=ai')}
          className="px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center gap-1.5 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Interviewer (Gemini)</span>
        </button>
      </div>

      {/* Domain Tracks & Remediation Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tier 1 Beginner Track */}
        <button onClick={()=>router.push('/nextjs')} className="flex min-h-11 items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-500/20 dark:text-blue-300"><Code2 className="h-3.5 w-3.5"/>Next.js Lab (110 challenges)</button>
        <button
          onClick={() => router.push('/interview?tier=tier-1')}
          className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
          <span>Beginner Track (Tier 1)</span>
        </button>

        {/* SQL & PostgreSQL Lab */}
        <button
          onClick={() => router.push('/sql')}
          className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-cyan-500" />
          <span>SQL & Postgres Lab (120 Qs)</span>
        </button>

        {/* Practice weak topics */}
        <button
          onClick={handlePracticeWeak}
          className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Practice Weak Topics ({weakestTopic || 'All'})</span>
        </button>

        {/* Review incorrect answers */}
        <button
          onClick={handleReviewIncorrect}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>Review Incorrect Answers</span>
        </button>

        {/* In-Browser Coding Practice */}
        <button
          onClick={() => router.push('/practice')}
          className="px-3 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5 text-teal-500" />
          <span>Coding Practice (Monaco)</span>
        </button>

        {/* Enterprise Loan Management Dashboard */}
        <button
          onClick={() => router.push('/challenges/loan-management')}
          className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Landmark className="w-3.5 h-3.5 text-purple-500" />
          <span>Loan Dashboard (Redux)</span>
        </button>
      </div>
    </div>
  );
}
