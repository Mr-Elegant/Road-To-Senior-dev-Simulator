'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { WorkspaceScope } from './WorkspaceScope';

export function AuthBoundary({ children, navigation, footer }: { children: React.ReactNode; navigation?: React.ReactNode; footer?: React.ReactNode }) {
  const pathname = usePathname();
  const { data, isPending } = authClient.useSession();
  const accountId = data?.user.id || null;
  const [readyFor, setReadyFor] = useState<{ accountId: string | null } | undefined>(undefined);
  const [syncMessage, setSyncMessage] = useState('');
  const initializedFor = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (isPending) return;
    if (initializedFor.current === accountId && storage.getAccountId() === accountId) return;
    initializedFor.current = undefined;
    let active = true;
    setSyncMessage('');
    storage.setAccount(accountId);
    const hydrate = async () => {
      if (accountId) {
        const result = await storage.fetchFromPostgres();
        if (!result.success && active) setSyncMessage('Account history could not be loaded. Your work is saved on this device; retry from Settings.');
      }
      if (active) {
        initializedFor.current = accountId;
        setReadyFor({ accountId });
      }
    };
    void hydrate();
    return () => { active = false; };
  }, [accountId, isPending]);
  useEffect(() => {
    const listener = (event: Event) => setSyncMessage((event as CustomEvent<string>).detail);
    window.addEventListener('progress-sync-error', listener);
    return () => window.removeEventListener('progress-sync-error', listener);
  }, []);
  const ready = readyFor !== undefined && readyFor.accountId === accountId && storage.getAccountId() === accountId;
  // These pages do not read personal history and can render before identity resolves.
  const publicEntry = pathname === '/login' || pathname === '/signup' || pathname === '/enterprise-labs' || pathname === '/nextjs';
  return <WorkspaceScope.Provider value={{ accountId: isPending && readyFor === undefined ? undefined : accountId, ready }}>
    {navigation}
    {syncMessage && <div role="status" className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-800 dark:text-amber-300">{syncMessage} <button className="ml-2 underline" onClick={() => setSyncMessage('')}>Dismiss</button></div>}
    {publicEntry || ready ? <Fragment key={accountId ? `account:${accountId}` : 'visitor'}>{children}</Fragment> : <main className="flex-1 p-8 text-center text-sm text-zinc-500" role="status">{isPending ? 'Checking your session…' : 'Loading account history…'}</main>}
    {footer}
  </WorkspaceScope.Provider>;
}
