# Staff Architect Interview: Legacy Monolith Modernization to Event-Driven Architecture

Collection: catalog · ID: `interview-staff-architect-modernization` · Mode: **guided**

## Business context

A multi-billion dollar retail and subscription enterprise runs on a 12-year-old monolithic Ruby on Rails / PostgreSQL codebase. The database is hitting hardware scaling limits (96-core server at 85% CPU during normal days). Deploying any code change takes 45 minutes and occasionally introduces regression bugs across unrelated domains.

## Task

Lead an architectural discussion to decompose the monolith into domain-driven modular microservices (Identity, Catalog, Checkout, Inventory, Fulfillment). You must address data migration without downtime (Strangler Fig pattern), shared database decomposition, distributed transaction management, and team organizational alignment (Conway's Law).

## Candidate tasks

- Question 1: How do you identify which bounded context / domain to carve out first from the monolith?
- Question 2: Explain how the Strangler Fig Pattern and API Gateway reverse proxies route traffic progressively.
- Question 3: How do you decouple the shared PostgreSQL database without breaking transactional integrity?
- Question 4: Compare Saga Orchestration (e.g. Temporal) vs Saga Choreography (Kafka events) for the checkout workflow.
- Question 5: How do you apply Conway's Law and Domain-Driven Design (DDD) to restructure engineering teams?

## Constraints

- Zero downtime and zero lost customer orders during multi-year migration.
- Must avoid "Distributed Monolith" anti-patterns.
- Provide clear technical trade-offs between Choreography vs Orchestration for order fulfillment.

## Follow-up questions

- Why is a Modular Monolith often a superior intermediate step before microservices?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
