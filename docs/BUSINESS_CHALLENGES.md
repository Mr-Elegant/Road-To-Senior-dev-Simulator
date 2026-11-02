# E-commerce and SaaS challenges

Six senior exercises extend the existing scenario library. Search **E-commerce** or **SaaS** in `/library`, or follow this sequence:

| Step | Challenge URL | What you fix |
| --- | --- | --- |
| 1 | `/challenge/commerce-inventory-reservations` | Overselling, duplicate reservations, repeated release |
| 2 | `/challenge/commerce-payment-reconciliation` | Duplicate delivery, reused payment identity, late failure |
| 3 | `/challenge/saas-tenant-authorization` | Cross-tenant invoice access and incorrect role selection |
| 4 | `/challenge/saas-subscription-entitlements` | Stale billing snapshots and expired access |
| 5 | `/challenge/commerce-resumable-catalog-import` | Destructive retries, partial failure, cross-tenant SKU updates |
| 6 | `/challenge/saas-safe-audit-history` | Secret capture and untrusted audit attribution |

## Candidate workflow

Read the explicit input/output contract, run the broken starter, edit `solution(input)`, and rerun tests. Each exercise has two visible example fixtures and additional cases for edge behavior. Use progressive hints before revealing the reference. Submit through the existing rubric flow to record an attempt. Behavioral test results and the written production assessment serve different purposes.

Each solution includes runnable JavaScript, diagnosis, production boundaries, verification ideas, alternatives, common mistakes, and an interview follow-up. The pack has **53 behavioral cases**. Repository checks compare authored references against independently specified JSON outputs with deeply frozen inputs. A browser journey runs every starter and reference through the real workspace.

## Scope of the model

These functions model deterministic business decisions. They do not connect to payment providers, modify production inventory, or provision tenants. The subscription versions come from an explicitly serialized internal reconciler; they are not inferred from Stripe delivery order or timestamps. Payment `verified` is trusted adapter output in fixtures, not signature verification.

Database race safety, tenant enforcement, provider reconciliation, import durability, and audit storage require the production mechanisms discussed in each solution. Existing practice-runner limitations remain unchanged; this pack does not add the dedicated loan lab's worker boundary. Hidden fixture labels are a learning aid, not a protected assessment system.

## Source and verification entry points

- [Commerce scenarios](../src/data/scenarios/commerce.ts)
- [SaaS scenarios](../src/data/scenarios/saas.ts)
- [Behavioral and evaluator tests](../tests/unit/businessChallenges.test.ts)
- [Browser journeys](../tests/e2e/businessChallenges.spec.ts)
- [Implementation plan](../tasks/plan.md) and [completion checklist](../tasks/todo.md)

Run focused checks with `node node_modules/vitest/vitest.mjs run tests/unit/businessChallenges.test.ts tests/unit/scenarios.test.ts`. The browser journeys use `node node_modules/@playwright/test/cli.js test tests/e2e/businessChallenges.spec.ts --workers=1` against a running application, following the root README's verification environment setup.
