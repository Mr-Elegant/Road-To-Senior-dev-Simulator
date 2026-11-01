'use client';

import { useState } from 'react';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { authClient } from '@/lib/auth-client';

export function AccountControls() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  async function importProgress() {
    if (pending) return;
    setPending(true);
    const result = await storage.mergeAnonymousProgress();
    setMessage(result.message); setPending(false);
  }
  async function revokeOthers() {
    if (pending) return;
    setPending(true);
    try {
      const result = await authClient.revokeOtherSessions();
      setMessage(result.error ? 'Could not sign out other devices. Please retry.' : 'Other devices have been signed out. This session remains active.');
    } catch { setMessage('Could not connect. Please retry.'); }
    finally { setPending(false); }
  }
  return <div className="mt-8 space-y-6">
    <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="font-semibold">Bring your anonymous practice with you</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Import attempts, bookmarks, notes, beginner questions, and SQL progress from this device. Existing account records take priority. Repeating the import won’t duplicate attempts, and the original anonymous history stays on this device.</p>
      <button onClick={importProgress} disabled={pending} className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{pending ? 'Please wait…' : 'Import anonymous progress'}</button>
    </section>
    <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="font-semibold">Sessions</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Sessions expire after seven days of inactivity. You can sign out other devices here.</p>
      <button onClick={revokeOthers} disabled={pending} className="mt-4 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Sign out other devices</button>
    </section>
    {message && <p role="status" className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm">{message}</p>}
  </div>;
}
