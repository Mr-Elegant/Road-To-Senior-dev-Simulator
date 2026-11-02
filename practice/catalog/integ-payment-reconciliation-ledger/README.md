# Automated Nightly Payment Gateway Reconciliation & Variance Ledger

Collection: catalog · ID: `integ-payment-reconciliation-ledger` · Mode: **guided**

## Business context

A subscription SaaS processes $500,000 daily across Stripe and PayPal. Month-end accounting closes revealed a $42,000 discrepancy between the internal database and the bank settlement payout due to silent chargeback fees, unrecorded currency conversions, and dropped webhook events.

## Task

Design an automated payment reconciliation engine. The worker fetches the daily settlement balance transaction CSV/API feed from Stripe, parses all events (charges, refunds, dispute fees, transfer payout fees), compares against internal database order records, and outputs a three-way reconciliation report classifying matches, internal omissions, gateway omissions, and fee variances.

## Candidate tasks

- Build hash map lookup indexes on both datasets by `orderId` in O(N) time.
- Identify charges present in Gateway but missing in internal database (e.g. dropped webhooks).
- Identify charges recorded in internal DB but not settled in Gateway (e.g. failed authorizations).
- Verify net settlement math: `gross - fee === net`.

## Constraints

- Detect 4 variance classes: Matched, MissingInternal, MissingGateway, AmountMismatch.
- Calculate net fees and variance totals with penny precision.
- Generate audit ledger entries for automated accountant review.

## Follow-up questions

- What is Double-Entry Bookkeeping and why is it mandatory for fintech payment platforms?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
