import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/api/auth/callback', '/forgot-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session_token')?.value;

  // 1. Allow public auth routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    // If user is already logged in, redirect them to dashboard
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect private routes
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
