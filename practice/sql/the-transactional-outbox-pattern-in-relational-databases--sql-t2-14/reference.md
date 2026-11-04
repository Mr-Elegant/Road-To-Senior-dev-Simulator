# Reference: The Transactional Outbox Pattern in Relational Databases

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The Dual-Write Problem occurs when an application writes to two independent systems (e.g. PostgreSQL and Kafka) without distributed transactions; one can fail while the other succeeds, causing desynchronization. Solution: The Transactional Outbox Pattern.\n1. Add an `outbox` table in PostgreSQL.\n2. In a single local ACID transaction, insert the order into `orders` AND insert the event payload into `outbox`.\n3. An asynchronous message relay (or Change-Data-Capture / Debezium) polls the `outbox` table and publishes events to Kafka with at-least-once delivery guarantees.\n4. Once acknowledged by Kafka, the outbox record is marked published or deleted.",
    "followUp": {
      "question": "What is the trade-off of polling the outbox table vs using PostgreSQL logical decoding (Debezium)?",
      "expectedAnswer": "Polling executes frequent SELECT/UPDATE queries that add database load and table bloat. Logical decoding reads changes directly from the PostgreSQL Write-Ahead Log (WAL) with zero query overhead and millisecond latency."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines Dual-Write problem",
      "Explains outbox table role in local transaction",
      "Explains relay mechanism"
    ]
  },
  "expectedConcepts": [
    "Dual-Write problem and distributed failure",
    "Outbox table in same local transaction",
    "Atomicity guarantees message persistence",
    "CDC (Change Data Capture) or Polling relay"
  ]
}
```
