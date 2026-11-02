# High-Throughput REST Ingestion & Zod Schema Validation Guard

Collection: catalog · ID: `node-rest-api-validation-zod` · Mode: **guided**

## Business context

A partner API receives raw telemetry payloads from thousands of connected IoT charging stations. Corrupted payloads with missing fields, negative numbers, and malicious prototype pollution strings caused downstream SQL exceptions and unhandled worker crashes.

## Task

Design a robust, high-performance request validation middleware using Zod. Define a strict schema with input sanitization, custom error formatting (RFC 7807 Problem Details), stripping unknown properties (`.strict()` or `.strip()`), and prototype pollution guards.

## Candidate tasks

- Write Zod schema enforcing types, minimum values, enum statuses, and ISO-8601 date strings.
- Handle ZodError and transform it into RFC 7807 Problem Details format: `{ type, title, status: 400, errors: [{ field, message }] }`.
- Explain how `schema.parse()` vs `schema.safeParse()` prevents unhandled exceptions.

## Constraints

- Reject malformed payloads with 400 Bad Request and detailed field-level error messages.
- Strip unknown keys to prevent prototype pollution or mass-assignment vulnerabilities.
- Sanitize string inputs to eliminate XSS script tags.

## Follow-up questions

- Why is Ajv significantly faster than Zod for massive JSON validation workloads?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
