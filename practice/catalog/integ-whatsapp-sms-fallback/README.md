# Resilient Multi-Provider WhatsApp & SMS Fallback Orchestrator

Collection: catalog · ID: `integ-whatsapp-sms-fallback` · Mode: **guided**

## Business context

A global fintech sends high-security One-Time Passwords (OTPs) for 2FA login. During an outage of the primary SMS gateway (Twilio), users in Brazil and India were blocked from logging in for 45 minutes, leading to customer attrition.

## Task

Build a resilient multi-provider notification orchestrator with Circuit Breaker and cascading fallback: Attempt WhatsApp via Meta Cloud API first (cheaper & faster); if delivery fails or times out (after 3s), fallback to Twilio SMS; if Twilio fails or its circuit breaker is OPEN, fallback to AWS SNS. Maintain delivery status telemetry.

## Candidate tasks

- Implement Circuit Breaker states (`CLOSED`, `OPEN`, `HALF-OPEN`) for each messaging provider.
- Attempt providers in priority order (WhatsApp -> Twilio -> AWS SNS).
- Implement per-provider timeouts using `AbortController` or `Promise.race()`.

## Constraints

- Total end-to-end delivery timeout must not exceed 6 seconds.
- Circuit breaker must trip to OPEN if a provider experiences 5 consecutive failures.
- Providers in OPEN state must be bypassed automatically until cooldown period expires.

## Follow-up questions

- Why should 4xx HTTP responses NOT trip a provider circuit breaker?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
