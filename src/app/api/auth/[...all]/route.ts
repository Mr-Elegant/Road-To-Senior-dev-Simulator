import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextResponse } from 'next/server';
import { signupSchema } from '@/lib/auth/validation';
import { readBoundedJson } from '@/lib/auth/request';
import { apiError } from '@/lib/auth/server';

export const runtime = 'nodejs';
const handlers = toNextJsHandler(auth);
export const GET = handlers.GET;

export async function POST(request: Request) {
  try {
    const path = new URL(request.url).pathname;
    // Better Auth's session controls deliberately send bodyless POST requests.
    // Its origin/CSRF middleware still applies to these endpoints.
    const allowEmpty = ['/api/auth/sign-out', '/api/auth/revoke-other-sessions', '/api/auth/revoke-sessions'].includes(path);
    if (!allowEmpty && !request.headers.get('content-type')?.startsWith('application/json')) return NextResponse.json({ message: 'Send an application/json request.' }, { status: 415 });
    const input = await readBoundedJson(request.clone(), 16384, allowEmpty);
    if (path === '/api/auth/sign-up/email') {
      const result = signupSchema.safeParse(input);
      if (!result.success) return NextResponse.json({ message: result.error.issues[0].message }, { status: 422 });
    }
    return await handlers.POST(request);
  } catch (error) {
    return apiError(error);
  }
}
