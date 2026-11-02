import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getEnterpriseLab } from '@/data/enterpriseLabs';
import { EnterpriseLabExercises } from '@/components/enterprise/EnterpriseLabExercises';

export const metadata: Metadata = { title: 'Project Overview | Enterprise Labs' };

export default async function EnterpriseLabPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const lab = getEnterpriseLab(project);
  if (!lab) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Link href="/enterprise-labs" className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"><ArrowLeft className="w-4 h-4" aria-hidden="true" /> All enterprise labs</Link>
      <header className="space-y-4 max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-300">{lab.domain} / {lab.format === 'dashboard' ? 'Dashboard + bug lab' : 'Coding challenge collection'}</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{lab.title}</h1>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{lab.summary}</p>
        <ul aria-label="Skills practiced" className="flex flex-wrap gap-2">
          {lab.skills.map(skill => <li key={skill} className="text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">{skill}</li>)}
        </ul>
      </header>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 border-y border-zinc-200 dark:border-zinc-800 py-6 sm:py-8">
        <section aria-labelledby="business-context-heading" className="space-y-3">
          <h2 id="business-context-heading" className="text-lg font-semibold">The business context</h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{lab.businessContext}</p>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {lab.format === 'dashboard'
              ? 'Explore a working dashboard, then fix isolated JavaScript exercises. Exercise submissions do not change the demonstration application.'
              : 'Work through editable JavaScript challenges with deterministic fixtures and detailed reference solutions. This collection currently focuses on coding exercises.'}
          </p>
        </section>
        <section aria-labelledby="learning-sequence-heading" className="space-y-3">
          <h2 id="learning-sequence-heading" className="text-lg font-semibold">Your learning sequence</h2>
          <ol className="list-decimal pl-5 space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {lab.workflow.map(step => <li key={step} className="pl-1">{step}</li>)}
          </ol>
        </section>
      </div>

      {lab.dashboardHref && <aside className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-5">
        <div className="space-y-1"><h2 className="font-semibold">Explore the loan dashboard</h2><p className="text-sm text-zinc-600 dark:text-zinc-400">Try the workflow before fixing its failure modes. Sign in to open the dashboard and bug lab.</p></div>
        <Link href={lab.dashboardHref} className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500">Open dashboard <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
      </aside>}

      <EnterpriseLabExercises lab={lab} />
    </div>
  );
}
