import { requirePageSession } from '@/lib/auth/server';
import { AccountControls } from '@/components/auth/AccountControls';

export default async function AccountPage() {
  const session = await requirePageSession('/account');
  return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Your workspace</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight">Account</h1>
    <p className="mt-3 font-medium">{session.user.name}</p>
    <p className="text-sm text-zinc-500">{session.user.email}</p>
    <AccountControls />
  </div>;
}
