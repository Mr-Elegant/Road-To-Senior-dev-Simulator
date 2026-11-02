# Enterprise Labs

Open `/enterprise-labs` from the main navigation to practice within a business project. The hub provides three project cards and overview pages:

| Project | Overview | Available experience |
| --- | --- | --- |
| Loan Operations | `/enterprise-labs/loan-operations` | Interactive loan dashboard and eight editable bug exercises; sign-in required to launch these workspaces |
| Commerce Operations | `/enterprise-labs/commerce-operations` | Three coding challenges covering reservations, payments, and catalog imports |
| Multi-Tenant SaaS | `/enterprise-labs/multi-tenant-saas` | Three coding challenges covering authorization, subscriptions, and audit history |

Each overview explains the business context, skills, recommended sequence, and current capabilities. The hub replaces the standalone Loan Dashboard navigation entry; the original dashboard URL and all direct exercise links remain supported. Challenge Library browsing continues to work independently.

## Shared progress

The overview reads the existing account-scoped storage adapter. It creates no separate attempt history or database records. It displays the best valid saved score for each exercise and counts an exercise as passed at 70% or above.

- Catalog exercises use the existing saved rubric percentage. Behavioral test execution does not independently change that percentage.
- Loan exercises reuse `bestLoanLabScores`: only a valid full-suite submission with the correct case count contributes, and the score derives from cases passed. A sample run or claimed rubric score cannot count as a full loan submission.
- Repeated submissions cannot reduce the displayed best score or count an exercise twice.
- Initial progress is shown as loading, with a retry state if loading fails. Account changes follow the application's existing authentication boundary. Returning to the page or focusing the browser refreshes the view.

## Adding a future project

Add a usable project to [the registry](../src/data/enterpriseLabs.ts), with a unique URL-safe ID, domain, format, summary, business context, skills, workflow, and real exercise links. Reuse existing scenario IDs and scoring rules. Do not publish empty cards or describe a challenge collection as a finished interactive application.

The hub, overview route, exercise count, and progress view derive from the registry. A dashboard link is optional. New execution or evaluation modes need their own tested implementation before being registered.

## Code and verification

- [Hub page](../src/app/enterprise-labs/page.tsx)
- [Project overview route](../src/app/enterprise-labs/[project]/page.tsx)
- [Exercise list and progress UI](../src/components/enterprise/EnterpriseLabExercises.tsx)
- [Progress calculation](../src/lib/enterpriseLabs.ts)
- [Unit tests](../tests/unit/enterpriseLabs.test.ts)
- [Browser tests](../tests/e2e/enterpriseLabs.spec.ts)
- [Acceptance checklist](../tasks/enterprise-labs.md)

Focused checks: `node node_modules/vitest/vitest.mjs run tests/unit/enterpriseLabs.test.ts` and `node node_modules/@playwright/test/cli.js test tests/e2e/enterpriseLabs.spec.ts --workers=1`. Browser journeys follow the root README's production verification setup and cover navigation, rubric progress, full-suite loan progress, account isolation, unknown routes, keyboard access, and responsive layouts.
