# Code Review PR #412: Marketplace Payout Split & Transfer Engine

Collection: catalog · ID: `review-pr-payment-split` · Mode: **guided**

## Business context

A software engineer submitted Pull Request #412: "Implement vendor payout splitting for marketplace orders". If merged as-is, this code will cause cumulative financial discrepancies due to floating-point rounding, security bypasses permitting unauthorized vendor payouts, and unhandled promise rejections.

## Task

Conduct a thorough Senior/Staff-level code review of PR #412. Identify critical issues spanning Correctness (floating point math), Security (missing IDOR authorization check on vendor recipient), Reliability (unhandled promise in async map), and Maintainability (magic numbers and lack of audit logging).

## Candidate tasks

- Identify Line 12-14: Insecure Direct Object Reference (IDOR) - missing permission check ensuring caller has admin or owner rights.
- Identify Line 18-20: IEEE 754 Floating point inaccuracy; money should always be represented as integer cents or using an arbitrary-precision Decimal library (e.g. `decimal.js` or `BigInt`).
- Identify Line 27: Stripe API expects integer cents (`Math.round(payoutAmountInCents)`), not floating dollars.
- Identify Line 25-33: `order.vendorSplits.map(async ...)` spawns unawaited promises that swallow errors and fail silently.

## Constraints

- Identify at least 4 distinct architectural and code-level defects.
- Provide specific line-by-line feedback with suggested remediation.
- Classify findings by severity: Critical, High, Medium, Low.

## Follow-up questions

- What are Basis Points (bps) and why are they standard for financial commission calculations?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
