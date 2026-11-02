import { NextResponse } from 'next/server';

/**
 * Buggy Next.js Auth Middleware
 */
export function middleware(request) {
  const token = request.cookies.get('session_token')?.value;

  // BUG 1: Matches /login and public assets, causing infinite redirect loop!
  if (!token) {
    // BUG 2: Creating new URL without preserving return URL
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// BUG 3: Matcher does not filter out static assets or public routes
export const config = {
  matcher: ['/:path*'],
};

function solution(input) {
  return "redirect_loop_resolved";
}