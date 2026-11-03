# React UI: Web Address Inspector

Collection: catalog · ID: `react-ui-web-address` · Mode: **react**

## Business context

An integrations setup form needs to catch unusable website addresses before a user saves the configuration.

## Task

Export App with a controlled input labelled Website. Trim its value for validation. An empty trimmed value shows Enter a web address. Otherwise accept only absolute URLs parsed by URL whose protocol is http: or https: and whose username and password are empty. Show Valid web address or Invalid web address in [data-testid="feedback"]. Put URL.href in [data-testid="normalized"] for accepted input and an empty string otherwise. Do not automatically add a scheme, navigate, or request the address.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.

## Constraints

- Validation updates while typing and never throws for malformed input.
- localhost is allowed if it has an explicit HTTP(S) scheme. This is a syntax check, not an SSRF or network-safety check.

## Follow-up questions

- How would a backend safely fetch a user-supplied URL?

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ui-web-address
npm run practice:watch -- catalog/react-ui-web-address
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
