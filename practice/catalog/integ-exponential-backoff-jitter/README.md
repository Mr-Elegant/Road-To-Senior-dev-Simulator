# Third-Party Shipping API Retry Storm & Thundering Herd Incident

Collection: catalog · ID: `integ-exponential-backoff-jitter` · Mode: **guided**

## Business context

During warehouse shipping label generation, FedEx API experienced a 2-minute rate limit hiccup (HTTP 429). When FedEx recovered, 5,000 backend retry workers fired simultaneous requests at the exact same second, immediately knocking FedEx back down with another 429 rate limit error in a perpetual thundering herd retry loop.

## Task

The retry utility used fixed linear backoff (`setTimeout(retry, 2000)`). Every failing worker woke up at the exact same 2,000ms mark, creating synchronized spikes of traffic (Thundering Herd / Retry Storm). Implement Exponential Backoff with Full Jitter (Decorrelated Jitter) to randomize retry distributions.

## Candidate tasks

- Explain the mathematical cause of Thundering Herd in distributed retries.
- Implement Exponential Backoff with Full Jitter: `delay = Math.random() * Math.min(maxWait, baseWait * Math.pow(2, attempt))`.
- Read and prioritize the `Retry-After` header when HTTP 429 is encountered.

## Constraints

- Must implement Exponential Backoff formula: `min(maxWait, baseWait * 2^attempt)`.
- Must inject Full Jitter (random uniform distribution between 0 and calculated backoff).
- Must respect `Retry-After` HTTP header if provided by external API.

## Follow-up questions

- Which HTTP status codes should you retry, and which should you NEVER retry?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
