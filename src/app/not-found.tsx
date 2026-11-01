import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        404 — Resource Not Found
      </h1>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
        The scenario, round, or practice session you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}

