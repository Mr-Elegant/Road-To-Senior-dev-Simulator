# OpenTelemetry Trace Bottleneck Analysis in Microservice Mesh

Collection: catalog · ID: `ops-distributed-tracing-bottleneck` · Mode: **guided**

## Business context

A ride-hailing and delivery dispatch API has a P99 latency SLA of 500ms. In production, P99 latency has drifted to 4,200ms. Because the request passes through API Gateway, Order Service, Driver Matching Service, Pricing Service, and Notification Service, engineers are blaming each other's services.

## Task

Analyze the OpenTelemetry distributed trace waterfall JSON. Trace spans reveal that Driver Matching Service calls Pricing Service sequentially in a loop for 20 candidate drivers instead of a single batch call. Refactor the service interaction to use parallel / batch gRPC calls and identify how trace context propagation (`traceparent` header) tracks requests across boundaries.

## Candidate tasks

- Inspect span waterfall: identify parent span, child spans, and sequential time gap.
- Refactor sequential calls to batch RPC `pricingClient.getBatchDriverQuotes(...)` or bounded `Promise.all()`.
- Explain the format of the W3C `traceparent` header: `00-trace_id-parent_id-trace_flags`.

## Constraints

- P99 request latency must drop below 400ms.
- Must preserve W3C TraceContext propagation across HTTP / gRPC calls.
- Transform N sequential remote calls into a single batch call or parallel execution with bounded concurrency.

## Follow-up questions

- What is the structure of the W3C `traceparent` HTTP header?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
