'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { evolvingIncidents } from '@/data/incidents';
import { ChallengeCard } from '@/components/library/ChallengeCard';
import { storage } from '@/lib/persistence/localStorageAdapter';
import type { UserProgressData } from '@/types/userProgress';

export default function IncidentsPage() {
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  useEffect(() => { void storage.getProgress().then(setProgress); }, []);
  const toggleBookmark = async (id: string) => { await storage.toggleBookmark(id); setProgress(await storage.getProgress()); };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-3">
      <p className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-300">Production response lab</p>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Evolving production incidents</h1>
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">The first alert is only the beginning. Investigate changing telemetry, choose a response, and handle the consequences as the incident develops.</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-700 dark:text-zinc-300"><span><strong>{evolvingIncidents.length}</strong> incidents</span><span><strong>{evolvingIncidents.reduce((sum, scenario) => sum + scenario.incidentSimulation!.stages.length, 0)}</strong> timed developments</span><span>Detailed solutions and recovery playbooks</span></div>
    </header>
    <section aria-label="How incident practice works" className="grid md:grid-cols-3 gap-5 text-sm">
      {[
        ['01 · Investigate', 'Inspect the alert, logs, metrics, customer reports and recent change. Start paused and use the simulation clock at your own pace.'],
        ['02 · Respond', 'Choose an action and explain your reasoning. Watch the consequence, then respond to the next development. Unanswered deadlines record inaction.'],
        ['03 · Review', 'Finish the written report, compare decisions with the reference response, and save your self-assessment to progress. Drafts resume paused on this device.'],
      ].map(([title, text]) => <div key={title} className="border-l-2 border-amber-500/60 pl-4"><h2 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2><p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">{text}</p></div>)}
    </section>
    <section aria-label="Evolving incident scenarios" className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {evolvingIncidents.map((scenario) => {
        const scores = progress?.attempts.filter((attempt) => attempt.scenarioId === scenario.id).map((attempt) => attempt.totalScorePercentage) ?? [];
        return <ChallengeCard key={scenario.id} scenario={scenario} isBookmarked={progress?.bookmarkedScenarioIds.includes(scenario.id) ?? false} onToggleBookmark={toggleBookmark} bestScore={scores.length ? Math.max(...scores) : undefined} />;
      })}
    </section>
    <p className="text-sm text-zinc-600 dark:text-zinc-400">Looking for the existing incident exercises? <Link href="/library?type=incident" className="text-blue-600 dark:text-blue-300 underline">Browse all production incidents</Link>.</p>
  </div>;
}
