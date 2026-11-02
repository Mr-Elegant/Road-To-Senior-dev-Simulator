# High-Throughput Metrics Aggregator Garbage Collection Latency Spikes

Collection: catalog · ID: `js-perf-object-allocation` · Mode: **guided**

## Business context

A telemetry agent ingests 100,000 JSON log metrics per second. P99 latency spikes above 2,500ms every 15 seconds. APM profiling indicates that V8 Scavenge and Mark-Sweep garbage collection pauses consume 35% of total CPU time due to massive ephemeral object allocations.

## Task

Analyze the metrics parser and buffer pipeline. The current implementation allocates new object literals, closures, and intermediate strings for every incoming telemetry frame. Redesign the parsing loop using object pooling, typed arrays, or in-place buffer mutation to eliminate GC pressure.

## Candidate tasks

- Identify memory allocation hotspots: `line.split`, intermediate object creation, nested metadata objects.
- Implement a single-pass parser that avoids creating temporary objects for each line.
- Explain how V8 Young Generation (Nursery/Intermediate) and Old Generation memory layout impacts latency.

## Constraints

- Must sustain 100,000 items/sec without triggering major GC pauses over 50ms.
- Zero new heap allocations in the critical hot path.
- Accurately calculate min, max, sum, and count metrics.

## Follow-up questions

- What flags can you pass to Node.js to trace garbage collection in production?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
