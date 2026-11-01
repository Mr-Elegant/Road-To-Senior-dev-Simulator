'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center font-bold text-lg">
            !
          </div>
          <h2 className="text-xl font-bold">Application Error</h2>
          <p className="text-xs text-zinc-400">
            A critical error interrupted the application shell.
          </p>
          {error?.message && (
            <p className="text-xs font-mono text-rose-400 bg-zinc-950 p-2.5 rounded-lg text-left break-all">
              {error.message}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}

