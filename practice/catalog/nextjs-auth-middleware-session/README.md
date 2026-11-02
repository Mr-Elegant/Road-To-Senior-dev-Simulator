# Edge Middleware JWT Validation Infinite Redirect Loop

Collection: catalog · ID: `nextjs-auth-middleware-session` · Mode: **guided**

## Business context

A B2B SaaS platform deployed Next.js Edge Middleware for authentication. Immediately after deployment, all enterprise users logging into `/dashboard` receive a `ERR_TOO_MANY_REDIRECTS` browser error.

## Task

The middleware intercepts all requests, checks for a session token cookie, and if invalid or expired, redirects to `/login`. However, `/login` itself was not excluded in the middleware matcher config or route check. When the user was redirected to `/login`, the middleware ran again, found no cookie, and redirected to `/login` infinitely.

## Candidate tasks

- Identify the missing route exclusion condition causing `ERR_TOO_MANY_REDIRECTS`.
- Configure the matcher regex to exclude `/_next/static`, `/_next/image`, `favicon.ico`, and public auth routes.
- Attach `?redirectUrl=` parameter so user returns to target page after login.

## Constraints

- Public routes (`/login`, `/signup`, `/api/auth`, `/_next`, `/favicon.ico`) must be excluded from authentication redirects.
- Must properly forward cookies and path headers using `NextResponse.next()`.
- Redirect URL must preserve original destination query parameter (e.g. `/login?from=/dashboard`).

## Follow-up questions

- Why must session cookies have the `HttpOnly` and `SameSite=Lax` flags set?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
