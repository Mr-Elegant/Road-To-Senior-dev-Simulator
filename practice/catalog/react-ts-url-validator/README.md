# React + TypeScript: URL Validator

Collection: catalog · ID: `react-ts-url-validator` · Mode: **react**

## Business context

An integrations setup form needs to catch unusable website addresses before a user saves the configuration.

## Task

Export App with a controlled input labelled Website. Trim its value for validation. An empty trimmed value shows Enter a web address. Otherwise accept only absolute URLs parsed by URL whose protocol is http: or https: and whose username and password are empty. Show Valid web address or Invalid web address in [data-testid="feedback"]. Put URL.href in [data-testid="normalized"] for accepted input and an empty string otherwise. Do not automatically add a scheme, navigate, or request the address.

TypeScript contract: export default App and export AppProps. Use strict TSX with typed props, state, event handlers, refs and domain records. The compiler rejects implicit/explicit any and suppression directives before DOM tests or preview. Only react and react/jsx-runtime imports are supported.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.
- Model the component data and narrow nullable refs and unknown errors without disabling type checking.

## Constraints

- Validation updates while typing and never throws for malformed input.
- localhost is allowed if it has an explicit HTTP(S) scheme. This is a syntax check, not an SSRF or network-safety check.
- Keep the supplied AppProps contract and type-safe state transitions. A passing submission must type-check and pass the original DOM journeys.

## Follow-up questions

- How would a backend safely fetch a user-supplied URL?

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-url-validator
npm run practice:watch -- catalog/react-ts-url-validator
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
