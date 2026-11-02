# Multi-Gateway Webhook Event Normalization & Exhaustive Narrowing

Collection: catalog · ID: `ts-discriminated-unions-events` · Mode: **guided**

## Business context

A global subscription SaaS platform receives webhook events from Stripe, PayPal, and Adyen. Currently, developers use `any` casting, causing runtime crashes when payment gateway payload versions change or when unhandled event types slip through into billing ledger workers.

## Task

Build a strongly-typed webhook event dispatch system using discriminated unions and an exhaustive checking utility (`assertNever`). The compiler must enforce that every possible payment event type is handled at compile time, rejecting any PR that adds a new event without an exhaustive handler.

## Candidate tasks

- Implement switch cases covering all union members with safe payload access.
- Use `assertNever(event)` in the default branch to enforce compile-time verification.
- Explain how discriminated unions differ from nominal typing or runtime schema validators like Zod.

## Constraints

- Zero usage of `any` or loose `unknown` casts.
- Must enforce compile-time exhaustiveness: if a new event is added to the union, omission in the dispatcher must cause a TypeScript compilation error.
- Must provide type narrowing on `event.payload` based on `event.provider` and `event.type`.

## Follow-up questions

- Why does TypeScript type-checking not protect your application from malformed JSON payloads at runtime?

## Work locally

Edit [solution.ts](solution.ts) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
