import Link from 'next/link';
import type { NextjsPracticeInfo } from '@/data/nextjsPractice/types';

export function NextjsVersionPanel({ info }: { info: NextjsPracticeInfo }) {
  return (
    <section
      aria-label="Next.js version and verification scope"
      className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-6 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200"
    >
      <Link href="/nextjs" className="font-semibold underline">
        ← Next.js Engineering Lab
      </Link>
      <h3 className="font-semibold">
        {info.mode === 'policy'
          ? 'Executable application-policy model'
          : info.mode === 'framework-review'
            ? 'Framework review — real-server checks required'
            : 'Architecture — design and evidence review'}
      </h3>
      <p>
        <strong>Next.js 15:</strong> {info.next15}
      </p>
      <p>
        <strong>Next.js 16:</strong> {info.next16}
      </p>
      <details>
        <summary className="min-h-11 cursor-pointer font-semibold">
          Acceptance evidence and official references
        </summary>
        <ul className="ml-4 list-disc space-y-2">
          {info.verification.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
        <ul className="mt-3 space-y-2">
          {info.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {source.title} ↗
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
