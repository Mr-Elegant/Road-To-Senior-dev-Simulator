# Reference: PostgreSQL Read Replicas and Replication Lag

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Most PostgreSQL replication is asynchronous: writes commit immediately on the Primary node, and WAL records stream asynchronously to Read Replicas. Replication Lag is the delay (milliseconds to seconds) before the replica applies those WAL changes.\nThe user experienced a Read-After-Write Consistency failure: the update was written to the Primary, but the redirect read was routed to a lagging Read Replica.\nSolutions:\n1. Sticky routing: Route reads from recently-modified sessions to the Primary for 5–10 seconds.\n2. LSN tracking: The primary returns its current Log Sequence Number (LSN); the read query waits on the replica until it replays up to that LSN.\n3. Route user-profile editing views strictly to the Primary.",
    "followUp": {
      "question": "Why not use Synchronous Replication for all read replicas to eliminate lag completely?",
      "expectedAnswer": "Synchronous replication forces every write transaction to block and wait until the slowest replica acknowledges receipt. A network blip or replica crash will freeze all writes on the primary database."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains asynchronous replication lag",
      "Diagnoses read-after-write inconsistency",
      "Provides concrete mitigation architectures"
    ]
  },
  "expectedConcepts": [
    "Asynchronous replication delay",
    "Read-after-write consistency failure",
    "Read replica routing architecture",
    "Session-level sticky primary routing"
  ]
}
```
