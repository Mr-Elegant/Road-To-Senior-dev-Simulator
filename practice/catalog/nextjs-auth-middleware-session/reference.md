# Reference: Edge Middleware JWT Validation Infinite Redirect Loop

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "When Next.js Edge Middleware executes, it matches every path specified in the 'config.matcher'. If the middleware encounters an unauthenticated user on a protected route, it redirects them to '/login'.\nHowever, if '/login' is also matched by the middleware, the browser's subsequent GET request to '/login' will trigger the middleware again. The middleware sees no session cookie and issues another 307 redirect to '/login'. The browser halts after ~20 iterations with ERR_TOO_MANY_REDIRECTS.\n      \nFix:\n1. Exclude public routes and static assets either in the matcher regex or with explicit 'pathname' checks.\n2. Preserve original intended destination with '?callbackUrl='.",
    "codeOrArtifact": "import { NextResponse } from 'next/server';\n\nconst PUBLIC_PATHS = ['/login', '/signup', '/api/auth/callback', '/forgot-password'];\n\nexport function middleware(request) {\n  const { pathname } = request.nextUrl;\n  const token = request.cookies.get('session_token')?.value;\n\n  // 1. Allow public auth routes\n  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {\n    // If user is already logged in, redirect them to dashboard\n    if (token && pathname === '/login') {\n      return NextResponse.redirect(new URL('/dashboard', request.url));\n    }\n    return NextResponse.next();\n  }\n\n  // 2. Protect private routes\n  if (!token) {\n    const loginUrl = new URL('/login', request.url);\n    loginUrl.searchParams.set('callbackUrl', pathname);\n    return NextResponse.redirect(loginUrl);\n  }\n\n  return NextResponse.next();\n}\n\nexport const config = {\n  matcher: [\n    /*\n     * Match all request paths except for the ones starting with:\n     * - _next/static (static files)\n     * - _next/image (image optimization files)\n     * - favicon.ico (favicon file)\n     * - public folder assets\n     */\n    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',\n  ],\n};"
  },
  "rubric": [
    {
      "id": "rb-middleware-matching",
      "category": "security",
      "label": "Middleware Routing & Matcher Safety",
      "description": "Implements proper path whitelisting and matcher configuration.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Excludes public paths, static assets, and properly constructs redirect URL with return query."
        },
        {
          "score": 2,
          "description": "Fixes /login redirect but misses static assets or favicon."
        },
        {
          "score": 0,
          "description": "Leaves redirect loop intact."
        }
      ]
    }
  ],
  "alternatives": [
    "Using NextAuth.js (Auth.js) built-in authorized callback middleware.",
    "Validating JWT signature cryptographically using jose library inside Edge runtime."
  ],
  "commonMistakes": [
    "Not excluding Next.js static asset chunks: Every JS and CSS chunk request gets redirected to /login, breaking styles and hydration.",
    "Checking cookies via client-side JavaScript document.cookie instead of HTTP-only cookies in middleware."
  ],
  "followUps": [
    {
      "id": "next-fq-4",
      "question": "Why must session cookies have the `HttpOnly` and `SameSite=Lax` flags set?",
      "expectedConcepts": [
        "HttpOnly prevents XSS theft",
        "SameSite=Lax prevents CSRF attacks on navigation",
        "Secure flag enforces HTTPS"
      ],
      "sampleStrongAnswer": "The `HttpOnly` flag prevents client-side JavaScript from reading the cookie via `document.cookie`, mitigating credential theft in Cross-Site Scripting (XSS) attacks. `SameSite=Lax` ensures the cookie is not sent along with cross-site POST requests, protecting against Cross-Site Request Forgery (CSRF)."
    }
  ]
}
```
