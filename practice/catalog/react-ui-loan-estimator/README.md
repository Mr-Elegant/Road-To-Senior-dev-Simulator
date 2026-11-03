# React UI: Monthly Loan Estimator

Collection: catalog · ID: `react-ui-loan-estimator` · Mode: **react**

## Business context

A lending demo needs a transparent monthly-payment estimate with an explicit zero-interest path and clear invalid-input feedback.

## Task

Export App. Render initially empty inputs labelled Principal, Annual rate, and Years, with names principal, rate, and years. A native form with a Calculate button computes a payment on submit. Accept finite numeric values: principal > 0, annual percentage rate >= 0, and whole-number years from 1 to 50. Blank or invalid fields set [data-testid="error"] to Enter valid loan details and clear [data-testid="payment"]. For n=years*12 and r=annualRate/1200, use P/n when r=0; otherwise P*r/(1-(1+r)^(-n)). Display only payment.toFixed(2) in payment. Valid submission clears error. Prevent browser navigation. Assume accepted principal <= 1000000000 and annual rate <= 100.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.

## Constraints

- Use type=text or type=number inputs with the documented names; all three fields must accept controlled edits.
- This educational estimate excludes fees, taxes, insurance, lender rounding rules, and financial advice.

## Follow-up questions

- What changes for production lending calculations?

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ui-loan-estimator
npm run practice:watch -- catalog/react-ui-loan-estimator
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
