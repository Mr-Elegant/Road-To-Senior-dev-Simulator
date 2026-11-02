# Stripe Payment Webhook Replay & Duplicate Credit Crediting

Collection: catalog · ID: `integ-webhook-idempotency-replay` · Mode: **guided**

## Business context

A digital media platform charges users $20 to buy 200 credits. Due to a temporary 4-second database latency spike, our webhook handler took 6 seconds to respond with 200 OK. Stripe considered the request timed out and retried the webhook 3 times over the next 10 minutes. Because the handler lacked idempotency checking, the user received 800 credits for a single $20 purchase.

## Task

Webhooks use "at-least-once" delivery semantics; retries, duplicate deliveries, and out-of-order deliveries are normal. Refactor the webhook receiver to use an atomic Idempotency Key record in PostgreSQL or Redis, verify cryptographic webhook signatures, and return immediate 200 OK for previously processed event IDs.

## Candidate tasks

- Verify the `stripe-signature` header using `stripe.webhooks.constructEvent(rawBody, sig, secret)`.
- Implement an `idempotency_keys` table or transactional `INSERT ... ON CONFLICT DO NOTHING` on `event.id`.
- Ensure duplicate retries immediately return `200 OK` without throwing or re-crediting balance.

## Constraints

- Must guarantee exactly-once business side effects (granting credits).
- Must verify Stripe HMAC-SHA256 signature against webhook secret.
- Must return 200 OK on duplicate deliveries without re-executing credit grants.

## Follow-up questions

- Why does Stripe require the raw unparsed HTTP request body for signature verification?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
