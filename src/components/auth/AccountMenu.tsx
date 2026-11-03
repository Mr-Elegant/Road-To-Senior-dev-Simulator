'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useWorkspaceScope } from './WorkspaceScope';

export function AccountMenu() {
  const { data: session, isPending } = authClient.useSession();
  const scope = useWorkspaceScope();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function logout() {
    if (pending) return;
    setPending(true); setError('');
    try {
      const result = await authClient.signOut();
      if (result.error) { setError('Logout failed. Retry.'); return; }
      window.location.assign('/login');
    } catch { setError('Logout failed. Retry.'); }
    finally { setPending(false); }
  }
  if (isPending && !(scope.ready && scope.accountId === null)) return <span role="status" className="text-xs text-zinc-500">Loading…</span>;
  if (!session) return <div className="flex items-center gap-2 text-xs font-semibold"><Link href="/login" className="rounded-lg px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">Login</Link><Link href="/signup" className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">Signup</Link></div>;
  return <div className="flex items-center gap-2 text-xs"><Link href="/account" className="max-w-20 truncate font-semibold text-blue-600 hover:underline dark:text-blue-400" title={session.user.email}>{session.user.name}</Link><button disabled={pending} onClick={logout} className="rounded-lg border border-zinc-300 px-2 py-2 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800">{pending ? 'Leaving…' : 'Logout'}</button>{error && <span role="alert">{error}</span>}</div>;
}
