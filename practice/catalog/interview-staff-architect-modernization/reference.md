# Reference: Staff Architect Interview: Legacy Monolith Modernization to Event-Driven Architecture

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Senior/Staff Architect Structured Response:\n1. Extraction Sequence & Bounded Contexts:\n- Avoid the \"Big Bang Rewrite\" trap (which has an 80%+ failure rate in enterprise software).\n- Apply Domain-Driven Design (DDD) to map Bounded Contexts.\n- First extract edge, read-heavy, or loosely coupled domains (e.g. Notification Service or Product Catalog). This validates CI/CD pipelines, observability, and networking before tackling core financial transactions.\n- Extract high-contention bottlenecks next (e.g. Inventory Reservation).\n\n2. Strangler Fig Pattern:\n- Place an API Gateway (Envoy / Kong / Cloudflare) in front of the legacy monolith.\n- Initially, 100% of traffic routes to the monolith.\n- As the new Inventory Service is built, route '/api/v1/inventory/*' to the new service while routing the rest to the monolith.\n- Run shadow traffic (dark launching / dual writing) to verify parity and latency before cutting over reads.\n\n3. Database Decomposition:\n- The #1 anti-pattern is creating microservices that all talk to the same shared database (a \"Distributed Monolith\").\n- Each microservice must own its private data store (Database-per-Service pattern).\n- Use Change Data Capture (Debezium + Kafka) to stream data from the legacy DB to the new service's database during the transition period.\n\n4. Saga Pattern: Orchestration vs Choreography\n- For complex multi-step workflows like Checkout -> Reserve Inventory -> Charge Card -> Generate Shipping Label:\n  - Choreography (Event-Driven): Services listen to Kafka events and emit next events. Good for simple flows (2-3 steps), but becomes an un-debuggable \"spaghetti graph\" with cyclical failure loops when flows grow complex.\n  - Orchestration (Workflow Engine like Temporal / AWS Step Functions): A centralized workflow orchestrator explicitly coordinates step execution, handles retries, and executes compensating transactions if a step fails. Highly recommended for enterprise financial workflows.",
    "codeOrArtifact": "Architecture Transformation:\nPhase 1: Facade\n[Client] ──► [API Gateway] ──(100% traffic)──► [Legacy Monolith] ──► [Shared DB]\n\nPhase 2: Strangler Extraction\n[Client] ──► [API Gateway] ──(90% traffic)───► [Legacy Monolith]\n                    │\n                    └───(/inventory/*)──────► [Inventory Service] ──► [Inventory DB]\n                                                    ▲\n                                                    │ (CDC Sync: Debezium)\n                                            [Shared Monolith DB]"
  },
  "rubric": [
    {
      "id": "rb-interview-strangler",
      "category": "tradeoffs",
      "label": "Strangler Fig Pattern & Progressive Migration",
      "description": "Details progressive extraction via API gateway routing, dual-reads, and CDC.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Mastery of Strangler Fig, API Gateway facade, CDC data sync, and incremental risk mitigation."
        },
        {
          "score": 1,
          "description": "Suggests big-bang total rewrite (classic anti-pattern)."
        },
        {
          "score": 0,
          "description": "Vague migration steps."
        }
      ]
    },
    {
      "id": "rb-interview-sagas",
      "category": "reliability",
      "label": "Distributed Sagas & Data Consistency",
      "description": "Compares Orchestration vs Choreography, compensation transactions, and idempotency.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Deep technical analysis of Choreography vs Orchestration, compensation transactions, and observability."
        },
        {
          "score": 2,
          "description": "Understands Sagas but unaware of orchestration trade-offs."
        },
        {
          "score": 0,
          "description": "Assumes two-phase commit (2PC) works across microservices."
        }
      ]
    }
  ],
  "alternatives": [
    "Modular Monolith architecture first: refactoring code into strict in-process modules before splitting into physical network services."
  ],
  "commonMistakes": [
    "Recommending a complete ground-up rewrite from scratch: business features stall for 2 years and the rewrite frequently fails.",
    "Allowing new microservices to directly query tables in the monolith database."
  ],
  "followUps": [
    {
      "id": "staff-fq-1",
      "question": "Why is a Modular Monolith often a superior intermediate step before microservices?",
      "expectedConcepts": [
        "Enforces domain boundaries without network latency or distributed transaction complexity",
        "Allows fast refactoring before committing to network serialization"
      ],
      "sampleStrongAnswer": "A Modular Monolith enforces strict domain boundaries, module encapsulation, and clean API interfaces within a single deployable unit. It eliminates the operational overhead of distributed microservices (network latency, distributed tracing, partial failures, Sagas) while providing the architectural clarity needed to cleanly spin out services later if independent scaling or deployment velocity demands it."
    }
  ]
}
```
