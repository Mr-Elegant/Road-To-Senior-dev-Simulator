import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Landmark, ShoppingCart, Building2, MessagesSquare } from 'lucide-react';
import { enterpriseLabs } from '@/data/enterpriseLabs';

export const metadata: Metadata = { title: 'Enterprise Labs | Full Stack Engineering Interview Lab' };
const icons: Record<string, typeof Landmark> = {
  'loan-operations': Landmark, 'commerce-operations': ShoppingCart, 'multi-tenant-saas': Building2,
  'real-time-collaboration': MessagesSquare,
};

export default function EnterpriseLabsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-300">Practice through a business workflow</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Enterprise Labs</h1>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Step into a project, understand the business, and fix the failures behind it.
          Follow a learning sequence across finance, commerce, SaaS, and real-time collaboration.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-zinc-200 dark:border-zinc-800 py-4 text-sm text-zinc-600 dark:text-zinc-400">
        <span><strong className="text-zinc-900 dark:text-zinc-100">{enterpriseLabs.length}</strong> projects available</span>
        <span><strong className="text-zinc-900 dark:text-zinc-100">{enterpriseLabs.reduce((count, lab) => count + lab.exercises.length, 0)}</strong> hands-on exercises</span>
        <span>Progress shared with your existing workspaces</span>
      </div>

      <section aria-label="Available enterprise projects" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {enterpriseLabs.map(lab => {
          const Icon = icons[lab.id] ?? Building2;
          return (
            <article key={lab.id} className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"><Icon className="w-5 h-5" aria-hidden="true" /></div>
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{lab.domain}</p>
              </div>
              <h2 className="text-xl font-semibold tracking-tight">{lab.title}</h2>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-3">{lab.summary}</p>
              <p className="mt-5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                {lab.format === 'dashboard' ? 'Interactive dashboard + bug lab' : 'Coding challenge collection'}
              </p>
              <ul aria-label={`${lab.title} skills`} className="flex flex-wrap gap-2 mt-3 mb-6">
                {lab.skills.map(skill => <li key={skill} className="text-xs px-2 py-1 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-700 dark:text-zinc-300">{skill}</li>)}
              </ul>
              <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{lab.exercises.length} exercises · {lab.exercises.reduce((count, exercise) => count + exercise.tests, 0)} behavioral cases</p>
                <Link href={`/enterprise-labs/${lab.id}`} aria-label={`Open ${lab.title} lab`} className="inline-flex items-center justify-between gap-3 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500">
                  Open Lab <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <aside className="max-w-3xl space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Choose a project or a technical topic</h2>
        <p>Enterprise Labs groups exercises by business context. The <Link href="/library" className="text-blue-700 dark:text-blue-300 underline underline-offset-4">Challenge Library</Link> lets you browse by technology and difficulty. Both open the same exercises and use the same saved attempts.</p>
      </aside>
    </div>
  );
}
