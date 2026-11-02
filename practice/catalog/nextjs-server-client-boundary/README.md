# Secret Key Leakage Across Next.js Server-Client Boundary

Collection: catalog · ID: `nextjs-server-client-boundary` · Mode: **guided**

## Business context

A fintech startup operates a subscription billing portal built with Next.js App Router. A security vulnerability report flags that the live production JavaScript bundle downloaded by customers in their browser contains `sk_live_...` Stripe Secret API keys in plain text.

## Task

A Server Component page fetched tenant payment settings and passed the entire database configuration object as a prop into a Client Component `<PaymentSettingsForm />` decorated with `"use client"`. Even though the form only displayed the currency and public key, Next.js serialized the entire prop object into the client HTML payload (`self.__next_f.push(...)`), exposing the live private secret key.

## Candidate tasks

- Explain how Next.js App Router serializes props passed from Server Components to Client Components.
- Refactor the page to sanitize props and only pass explicitly allowed public fields: `{ publishableKey, currency }`.
- Explain how `import "server-only"` works at build time to prevent accidental secret leakage.

## Constraints

- Stripe secret keys must never be bundled or serialized into client HTML/JS payloads.
- Only public publishable keys (`pk_live_...`) may be exposed to the browser.
- Use package `server-only` to guarantee build-time enforcement against server module importation into client code.

## Follow-up questions

- What is React's `experimental_taintUniqueValue` and how does it prevent data leaks in Next.js?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
