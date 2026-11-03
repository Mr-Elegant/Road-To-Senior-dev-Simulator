'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Code2 } from 'lucide-react';
import type { FrontendPracticeTopic } from '@/types/frontendPractice';

export function FrontendPracticeLibrary({ topics, typescript = false }: { topics: FrontendPracticeTopic[]; typescript?: boolean }) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const filtered = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return topics.filter(topic => (language === 'all' || topic.language === language)
      && (difficulty === 'all' || topic.difficulty === difficulty)
      && terms.every(term => `${topic.title} ${topic.question} ${topic.checks.join(' ')}`.toLowerCase().includes(term)));
  }, [topics, query, language, difficulty]);
  const reset = () => { setQuery(''); setLanguage('all'); setDifficulty('all'); };
  const control = 'min-h-11 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500';
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-7">
    <header className="space-y-3">
      <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400"><Code2 className="h-4 w-4" /> Frontend Practice</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{typescript ? '113 challenges. React + TypeScript.' : '203 questions. React and JavaScript.'}</h1>
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{typescript ? 'Practice every React topic with typed props, state, events and refs. Each TSX workspace includes strict type checking, interactive previews, behavioral tests, a typed reference solution and its own saved progress.' : 'Every topic has a runnable coding workspace, starter, reference solution and executable cases. React exercises include component previews and DOM journeys; JavaScript exercises compare exact results and validation errors. Each exercise states its bounded contract.'}</p>
      <div className="flex flex-wrap gap-3 text-xs text-zinc-600 dark:text-zinc-400">{typescript ? <><span>39 easy · 60 medium · 14 hard</span><span>379 DOM cases + strict type checking</span></> : <><span>113 React topics</span><span>90 JavaScript topics</span><span>75 easy · 97 medium · 31 hard</span></>}</div>
      <Link href={typescript ? '/frontend-practice' : '/react-typescript'} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">{typescript ? 'React + JavaScript practice' : 'React + TypeScript practice — 113 challenges'}<ArrowRight className="h-4 w-4" /></Link>
      <Link href="/library" className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"><BookOpen className="h-4 w-4" /> Engineering scenario catalog</Link>
    </header>
    <section aria-label="Filter frontend questions" className="grid gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] items-end">
      <label className="flex flex-col gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">Search questions<input className={control} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search all ${topics.length} questions…`} /></label>
      {!typescript && <label className="flex flex-col gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300"><span>Track</span><select aria-label="Track" className={control} value={language} onChange={event => setLanguage(event.target.value)}><option value="all">React + JavaScript</option><option value="React.js">React</option><option value="JavaScript">JavaScript</option></select></label>}
      <label className="flex flex-col gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300"><span>Difficulty</span><select aria-label="Difficulty" className={control} value={difficulty} onChange={event => setDifficulty(event.target.value)}><option value="all">All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
      <button type="button" className={control} onClick={reset}>Reset filters</button>
    </section>
    <p role="status" className="text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} of {topics.length} questions</p>
    {!filtered.length && <section className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8"><h2 className="font-semibold text-zinc-900 dark:text-zinc-100">No matching questions</h2><p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Try another keyword or reset the filters.</p></section>}
    <section aria-label="Frontend questions" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map(topic => <article key={topic.slug} className="flex min-w-0 flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 shadow-sm">
        <p className="text-xs font-mono text-blue-600 dark:text-blue-400">{typescript ? 'React + TypeScript' : topic.language} · {topic.difficulty}</p>
        <h2 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{topic.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{topic.question}</p>
        <Link href={`/${typescript ? 'react-typescript' : 'frontend-practice'}/${topic.slug}`} prefetch={false} aria-label={`Open ${topic.title} question`} className="mt-5 inline-flex min-h-11 items-center justify-between gap-2 border-t border-zinc-200 dark:border-zinc-800 pt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Open question<ArrowRight className="h-4 w-4 shrink-0" /></Link>
      </article>)}
    </section>
  </div>;
}
