# Flash-Sale Batch Processor Microtask Queue Starvation

Collection: catalog · ID: `js-event-loop-microtasks` · Mode: **guided**

## Business context

During Black Friday peak traffic on a flash-sale e-commerce platform, the checkout order-ingestion service experiences severe WebSocket heartbeat timeouts and dropping health-check endpoints, leading Kubernetes to repeatedly restart healthy pods.

## Task

The order batching function processes order queues recursively using Promise.resolve().then(processNextOrder). While CPU load appears moderate (~65%), the HTTP server stops responding to TCP health probes and WebSocket ping/pongs disconnect thousands of shoppers. Diagnose why the event loop is blocked and implement a cooperative scheduling mechanism.

## Candidate tasks

- Identify why Promise.resolve().then() recursion starves macrotasks like I/O and setTimeout.
- Refactor the processor to use cooperative scheduling (e.g., yielding via setImmediate or setTimeout every N iterations or when a budget threshold is exceeded).
- Explain the difference in event loop phases (Timer, Poll, Check, Microtask drain).

## Constraints

- Orders must continue to process with maximum throughput without starving macrotasks (I/O, timers, incoming network packets).
- Memory consumption must remain bounded under a 50,000 order surge.
- Cannot use synchronous blocking loops.

## Follow-up questions

- What is the priority difference between process.nextTick() and Promise.then() in Node.js?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
