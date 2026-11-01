import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, Award, Cpu, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/70 backdrop-blur-md py-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm tracking-tight">
                Full Stack Engineering Interview Lab
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md">
              A high-fidelity simulation platform designed for engineers with 2–10 years of experience.
              Prepare for Senior, Staff, and Principal engineering interviews through realistic production incidents,
              system design architectural trade-offs, code reviews, and deep debugging.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-2 font-mono">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-500" /> Sandboxed Safe Execution
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Zero Data Leakage
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-500" /> Rubric-Based Scoring
              </span>
            </div>
          </div>

          {/* Quick Practice Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Core Practice Domains
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/library?topic=JavaScript" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  JavaScript & Event Loop
                </Link>
              </li>
              <li>
                <Link href="/library?topic=React" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  React Re-rendering & Hooks
                </Link>
              </li>
              <li>
                <Link href="/library?topic=Next.js" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Next.js App Router & SSR
                </Link>
              </li>
              <li>
                <Link href="/library?topic=Databases" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  PostgreSQL Deadlocks & Indexes
                </Link>
              </li>
              <li>
                <Link href="/library?topic=System%20Design" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  System Design & Scalability
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Evaluation Integrity
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Transparent, objective rubrics for every scenario. Performance scores serve as structured skill benchmarks and do not constitute a guaranteed outcome in company-specific hiring processes.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>v1.0.0 • Local Architecture</span>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-3">
          <div>© {new Date().getFullYear()} Full Stack Engineering Interview Lab. Built for senior engineering craft.</div>
          <div className="flex gap-4">
            <Link href="/progress" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Export / Import Progress
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link href="/settings" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Database & Persistence
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
