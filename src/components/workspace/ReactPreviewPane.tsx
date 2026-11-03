'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { ReactJourney } from '@/types/reactExercise';
import { runReactFrame } from '@/lib/reactPractice/runner';

export function ReactPreviewPane({ code, sampleProps, onClose, typescript = false }: {
  code: string; sampleProps?: ReactJourney['props']; onClose: () => void; typescript?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    // Preview props are passed separately from a test journey so the component stays mounted.
    const previewCode = sampleProps ? `${code}\nconst OriginalApp = module.exports.default; module.exports.default = () => require('react').createElement(OriginalApp, ${JSON.stringify(sampleProps)});` : code;
    const start = async () => {
      if (typescript) {
        const errors = await (await import('@/lib/reactTypescript/runner')).checkReactTypes(code, controller.signal);
        if (errors.length) return { error: errors.join('\n') };
      }
      return runReactFrame(host.current!, previewCode, undefined, controller.signal, typescript);
    };
    start()
      .then(reply => { if (!controller.signal.aborted) { setError(reply.error ?? ''); setLoading(false); } })
      .catch(reason => { if (!controller.signal.aborted) { setError(reason instanceof Error ? reason.message : 'Preview failed.'); setLoading(false); } });
    return () => controller.abort();
  }, [code, sampleProps, typescript]);
  return <section aria-label="Component preview" className="h-64 max-h-[50%] min-h-0 shrink-0 flex flex-col border-t border-zinc-800">
    <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-1 bg-zinc-900 text-zinc-300 text-xs">
      <span>Component preview · run Preview again to apply edits</span>
      <button type="button" aria-label="Close component preview" onClick={onClose} className="p-2 rounded hover:bg-zinc-800"><X className="h-4 w-4" /></button>
    </div>
    {loading && <p role="status" className="text-xs text-zinc-400 px-3">Starting React preview…</p>}
    {error && <p role="alert" className="text-xs text-red-400 px-3 break-words">{error}</p>}
    <div ref={host} className="min-h-0 flex-1" />
  </section>;
}
