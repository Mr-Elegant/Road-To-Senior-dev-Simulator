'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Terminal } from 'lucide-react';
import { emailSchema, safeDestination, signupSchema } from '@/lib/auth/validation';

export function AuthForm({ mode, destination }: { mode: 'login' | 'signup'; destination: string }) {
  const signup = mode === 'signup';
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError(''); setSuccess(''); setFieldErrors({});
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = signup ? signupSchema.safeParse(fields) : emailSchema.safeParse(String(fields.email).trim());
    if (!parsed.success) {
      setFieldErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0] || 'email'), issue.message])));
      return;
    }
    if (!fields.password) { setFieldErrors({ password: 'Enter your password.' }); return; }
    submitting.current = true; setPending(true);
    try {
      const response = await fetch(`/api/auth/${signup ? 'sign-up' : 'sign-in'}/email`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, email: String(fields.email).trim().toLowerCase(), rememberMe: true }),
      });
      if (!response.ok) {
        if (response.status === 429) setError('Too many attempts. Please wait a minute and try again.');
        else if (response.status >= 500) setError('Sign-in is temporarily unavailable. Please try again shortly.');
        else setError(signup ? 'Unable to create this account. Check your details or try logging in if you already registered.' : 'Email or password is incorrect.');
        return;
      }
      setSuccess(signup ? 'Account created. Opening your workspace…' : 'Signed in. Opening your workspace…');
      window.location.assign(safeDestination(destination));
    } catch { setError('Could not connect. Check your connection and try again.'); }
    finally { submitting.current = false; setPending(false); }
  }

  const inputClass = 'mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100';
  const inputs = [
    ...(signup ? [{ name: 'name', label: 'Name', type: 'text', autoComplete: 'name', minLength: 2, maxLength: 100 }] : []),
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', minLength: 3, maxLength: 254 },
    { name: 'password', label: 'Password', type: 'password', autoComplete: signup ? 'new-password' : 'current-password', minLength: signup ? 12 : 1, maxLength: 128 },
    ...(signup ? [{ name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password', minLength: 12, maxLength: 128 }] : []),
  ];
  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl items-center justify-center px-4 py-10 sm:py-16">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="auth-heading">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><Terminal size={22} /></div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Full Stack Interview Lab</p>
        <h1 id="auth-heading" className="text-2xl font-bold tracking-tight">{signup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{signup ? 'Keep your practice history in one place and pick up where you left off.' : 'Sign in to your saved progress and interview workspace.'}</p>
        <form onSubmit={submit} className="mt-6 space-y-4" aria-busy={pending}>
          {inputs.map((input) => <div key={input.name}>
            <label htmlFor={input.name} className="text-sm font-medium">{input.label}</label>
            <input {...input} id={input.name} required disabled={pending} className={inputClass} aria-invalid={Boolean(fieldErrors[input.name])} aria-describedby={fieldErrors[input.name] ? `${input.name}-error` : input.name === 'password' && signup ? 'password-help' : undefined} />
            {fieldErrors[input.name] && <p id={`${input.name}-error`} className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors[input.name]}</p>}
            {signup && input.name === 'password' && <p id="password-help" className="mt-1 text-xs text-zinc-500">Use 12–128 characters. A unique passphrase works well.</p>}
          </div>)}
          {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
          {success && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{success}</p>}
          <button type="submit" disabled={pending || Boolean(success)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}{pending ? 'Please wait…' : signup ? 'Create account' : 'Log in'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-zinc-600 dark:text-zinc-400">{signup ? 'Already registered?' : 'New here?'}{' '}<Link className="font-semibold text-blue-600 hover:underline dark:text-blue-400" href={`/${signup ? 'login' : 'signup'}?next=${encodeURIComponent(destination)}`}>{signup ? 'Log in' : 'Create an account'}</Link></p>
        <p className="mt-6 text-center text-xs text-zinc-500">Your anonymous practice stays on this device.</p>
        <Link href="/library" className="mt-3 block text-center text-xs text-zinc-500 underline">Continue practicing without an account</Link>
      </section>
    </div>
  );
}
