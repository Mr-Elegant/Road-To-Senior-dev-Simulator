# SSE Connection Manager Request Context Closure Leak

Collection: catalog · ID: `js-closures-memory-leak` · Mode: **guided**

## Business context

A subscription trading platform provides real-time Server-Sent Events (SSE) to push portfolio updates. Over 24 hours of operation, the service Node.js process RSS memory swells from 150MB to 3.8GB, triggering container out-of-memory crashes.

## Task

Heap snapshot inspection reveals thousands of retained ClientSession closures holding large http.IncomingMessage and AuthToken contexts in memory even though the user has only subscribed to price alerts. Fix the retention pattern and prevent closure-based memory leaks.

## Candidate tasks

- Identify how the lexical scope closure retains `requestMetadata` and `req` in V8 heap.
- Refactor `registerConnection` to extract only the needed primitive identifiers (`clientId`, `res`) and nullify references.
- Ensure the disconnect listener (`req.on("close")`) removes the client from `this.clients`.

## Constraints

- Must maintain real-time push to active SSE clients.
- Must properly clean up listeners and references when client disconnects.
- Cannot retain unneeded request payloads or auth credential strings in long-lived client descriptors.

## Follow-up questions

- How do you take and analyze a Node.js heap dump in production without taking the server down?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
