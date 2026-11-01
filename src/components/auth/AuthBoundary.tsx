'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { storage } from '@/lib/persistence/localStorageAdapter';

export function AuthBoundary({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const accountId = data?.user.id || null;
  const [readyFor, setReadyFor] = useState<string | null | undefined>(undefined);
  const [syncMessage, setSyncMessage] = useState('');
  useEffect(() => {
    if (isPending) return;
    let active = true;
    storage.setAccount(accountId);
    const hydrate = async () => {
      if (accountId) {
        const result = await storage.fetchFromPostgres();
        if (!result.success && active) setSyncMessage('Account history could not be loaded. Your work is saved on this device; retry from Settings.');
      }
      if (active) setReadyFor(accountId);
    };
    void hydrate();
    return () => { active = false; };
  }, [accountId, isPending]);
  useEffect(() => {
    const listener = (event: Event) => setSyncMessage((event as CustomEvent<string>).detail);
    window.addEventListener('progress-sync-error', listener);
    return () => window.removeEventListener('progress-sync-error', listener);
  }, []);
  if (isPending || readyFor !== accountId) return <div role="status" className="p-8 text-center text-sm text-zinc-500">Loading your workspace…</div>;
  return <>{syncMessage && <div role="status" className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-800 dark:text-amber-300">{syncMessage} <button className="ml-2 underline" onClick={() => setSyncMessage('')}>Dismiss</button></div>}{children}</>;
}
