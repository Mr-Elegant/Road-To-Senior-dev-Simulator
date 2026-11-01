import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { safeDestination } from './validation';

export async function getSession(requestHeaders?: Headers) {
  return auth.api.getSession({ headers: requestHeaders || await headers(), query: { disableCookieCache: true } });
}

export async function requirePageSession(destination: string) {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(safeDestination(destination))}`);
  return session;
}

export class AccessError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function requireApiSession(request: Request) {
  const session = await getSession(request.headers);
  if (!session) throw new AccessError(401, 'Sign in to continue. Your session may have expired.');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const trustedOrigin = new URL(process.env.BETTER_AUTH_URL || 'http://localhost:3000').origin;
    if (origin !== trustedOrigin || request.headers.get('sec-fetch-site') === 'cross-site') throw new AccessError(403, 'Request origin is not allowed.');
    if (!request.headers.get('content-type')?.startsWith('application/json')) throw new AccessError(415, 'Send an application/json request.');
  }
  return session.user;
}

export function apiError(error: unknown) {
  if (error instanceof AccessError) return NextResponse.json({ error: error.message }, { status: error.status });
  return NextResponse.json({ error: 'The request could not be completed. Please try again.' }, { status: 500 });
}
