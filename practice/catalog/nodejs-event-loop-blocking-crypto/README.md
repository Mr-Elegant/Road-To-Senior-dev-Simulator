# Auth Gateway Event-Loop Freezing on CPU-Intensive Hashing

Collection: catalog · ID: `nodejs-event-loop-blocking-crypto` · Mode: **guided**

## Business context

During morning peak login hours (9:00 AM), an enterprise SSO authentication gateway suffers massive latency spikes. Simple GET `/health` probes jump from 2ms to 8,000ms, and ALB load balancers take instances out of service, causing cascading outages.

## Task

The password verification endpoint used synchronous `bcrypt.compareSync(password, hash)` with 14 salt rounds. Because Node.js is single-threaded on its JavaScript main thread, each synchronous hash blocks the entire event loop for 350ms. With 20 concurrent logins, all other incoming HTTP connections and TCP keep-alives are queued and frozen for over 7 seconds.

## Candidate tasks

- Explain how `bcrypt.compareSync` blocks the V8 thread vs how `bcrypt.compare` utilizes the libuv worker pool.
- Refactor to asynchronous `await bcrypt.compare(plainPassword, passwordHash)`.
- Explain the default size of `UV_THREADPOOL_SIZE` (4) and how to tune it for crypto-heavy Node applications.

## Constraints

- Must eliminate main event-loop blocking.
- Must maintain high password hashing security parameters (e.g. bcrypt work factor 12-14 or Argon2id).
- Event loop lag during concurrent logins must stay under 25ms.

## Follow-up questions

- What types of operations use the libuv thread pool in Node.js?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
