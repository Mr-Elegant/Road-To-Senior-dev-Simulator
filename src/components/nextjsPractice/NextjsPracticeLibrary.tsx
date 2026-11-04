'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2 } from 'lucide-react';
import type { Difficulty } from '@/types/scenario';
import type {
  NextjsPracticeMode,
  NextjsVersionScope,
} from '@/data/nextjsPractice/types';

export interface NextjsListing {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  minutes: number;
  chapter: string;
  order: number;
  mode: NextjsPracticeMode;
  versions: NextjsVersionScope;
}
const modeLabels = {
  policy: 'Policy coding',
  'framework-review': 'Framework review',
  architecture: 'Architecture',
};
const levelLabels = {
  Beginner: 'Beginner',
  'Mid-Level': 'Intermediate',
  Senior: 'Senior',
  'Staff/Principal': 'Staff / Architect',
};
const versionLabels = {
  '15-and-16': 'Next.js 15 + 16',
  '15-to-16': '15 → 16 migration',
  '16-only': 'Next.js 16 only',
};
const control =
  'min-h-11 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:outline-2 focus-visible:outline-blue-500';

export function NextjsPracticeLibrary({
  topics,
  snapshot,
}: {
  topics: NextjsListing[];
  snapshot: {
    checked: string;
    latestStable: string;
    maintenance15: string;
    simulator: string;
  };
}) {
  const [query, setQuery] = useState(''),
    [level, setLevel] = useState('all'),
    [version, setVersion] = useState('all'),
    [mode, setMode] = useState('all'),
    [chapter, setChapter] = useState('all');
  const chapters = useMemo(
    () => [...new Set(topics.map((topic) => topic.chapter))].sort(),
    [topics],
  );
  const filtered = useMemo(
    () =>
      topics.filter((topic) => {
        const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        return (
          terms.every((term) =>
            `${topic.title} ${topic.chapter} ${topic.id} ${topic.description}`
              .toLowerCase()
              .includes(term),
          ) &&
          (level === 'all' || topic.difficulty === level) &&
          (mode === 'all' || topic.mode === mode) &&
          (chapter === 'all' || topic.chapter === chapter) &&
          (version === 'all' ||
            (version === '15'
              ? topic.versions !== '16-only'
              : version === '16'
                ? true
                : topic.versions === version))
        );
      }),
    [topics, query, level, version, mode, chapter],
  );
  function reset() {
    setQuery('');
    setLevel('all');
    setVersion('all');
    setMode('all');
    setChapter('all');
  }
  return (
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <p className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400">
          <Code2 className="h-4 w-4" /> VERSION-AWARE ENGINEERING PRACTICE
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Next.js Engineering Lab
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          110 challenges from beginner to architect. Build application policies,
          review real framework code, and design production systems with
          explicit Next.js 15 and 16 assumptions.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(['policy', 'framework-review', 'architecture'] as const).map(
            (kind) => (
              <div
                key={kind}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {topics.filter((topic) => topic.mode === kind).length}
                </p>
                <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {modeLabels[kind]}
                </h2>
                <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {kind === 'policy'
                    ? 'Exact-result tests run in the browser and local IDE. Models do not execute a Next.js server.'
                    : kind === 'framework-review'
                      ? 'Defective files, corrected references and real-server acceptance checks. Rubric-based review.'
                      : 'Design canvas, requirements, reference decisions and failure/recovery analysis.'}
                </p>
              </div>
            ),
          )}
        </div>
        <p className="max-w-3xl rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-6 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
          Version snapshot {snapshot.checked}: latest stable{' '}
          {snapshot.latestStable}; 15.x maintenance {snapshot.maintenance15}.
          The simulator stays on {snapshot.simulator}. Cache Components and
          newer prefetching features are opt-in exercises, with their
          configuration called out.
        </p>
        <Link
          href="/library?topic=Next.js"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          <BookOpen className="h-4 w-4" /> All Next.js scenarios, including the
          existing exercises
        </Link>
      </header>
      <section
        aria-label="Filter Next.js challenges"
        className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2 lg:grid-cols-3"
      >
        <label className="space-y-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Search challenges
          <input
            type="search"
            className={control}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search routing, caches, authentication…"
          />
        </label>
        <label className="space-y-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Level
          <select
            className={control}
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="all">All levels</option>
            {Object.entries(levelLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Version scope
          <select
            className={control}
            value={version}
            onChange={(event) => setVersion(event.target.value)}
          >
            <option value="all">All version scopes</option>
            <option value="15">Works with Next.js 15</option>
            <option value="16">Works with Next.js 16</option>
            <option value="15-to-16">Migration comparisons</option>
            <option value="16-only">16-specific features</option>
          </select>
        </label>
        <label className="space-y-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Practice mode
          <select
            className={control}
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            <option value="all">All practice modes</option>
            {Object.entries(modeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Chapter
          <select
            className={control}
            value={chapter}
            onChange={(event) => setChapter(event.target.value)}
          >
            <option value="all">All chapters</option>
            {chapters.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <button className={control} onClick={reset}>
          Reset filters
        </button>
      </section>
      <p role="status" className="text-sm text-zinc-600 dark:text-zinc-400">
        {filtered.length} of {topics.length} challenges
      </p>
      {!filtered.length && (
        <section className="rounded-xl border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            No matching challenges
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Try a broader search or reset the filters.
          </p>
        </section>
      )}
      <section
        aria-label="Next.js challenges"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {filtered.map((topic) => (
          <article
            key={topic.id}
            className="flex min-w-0 flex-col rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
              {String(topic.order).padStart(3, '0')} /{' '}
              {levelLabels[topic.difficulty]}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {topic.title}
            </h2>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {topic.chapter}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-600 dark:text-zinc-300">
              <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-700">
                {versionLabels[topic.versions]}
              </span>
              <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-700">
                {modeLabels[topic.mode]}
              </span>
              <span className="py-1">{topic.minutes} min</span>
            </div>
            <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600 [overflow-wrap:anywhere] dark:text-zinc-400">
              {topic.description}
            </p>
            <Link
              href={`/challenge/${topic.id}`}
              prefetch={false}
              aria-label={`Open ${topic.title}`}
              className="mt-5 inline-flex min-h-11 items-center justify-between gap-2 border-t border-zinc-200 pt-3 text-sm font-semibold text-blue-600 hover:underline dark:border-zinc-800 dark:text-blue-400"
            >
              Open challenge
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
