# Reference: Atomic Distributed Rate Limiting & Token Bucket in Pure PostgreSQL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Algorithm Mechanics:**\n- Rather than running a background tick thread to refill tokens, calculate refilled tokens on-demand at the exact moment a request arrives:\n  $$\\text{new\\_tokens} = \\min(\\text{max\\_tokens}, \\text{current\\_tokens} + \\Delta t \\times \\text{refill\\_rate})$$\n- By packaging this inside a single `UPDATE ... WHERE tenant_id = $1 RETURNING ...`, PostgreSQL acquires an exclusive row-level lock on that tenant’s row, guaranteeing strictly atomic serialization of concurrent requests without race conditions.\n\n**2. High-Throughput Considerations:**\n- Because high-traffic tenants will update this row hundreds of times per second, the table will suffer from severe MVCC tuple bloat.\n- To support 10,000 req/sec in PostgreSQL:\n  - Set `WITH (fillfactor = 70)` on the table to ensure Heap-Only Tuple (HOT) updates without touching index pages.\n  - Set `autovacuum_vacuum_scale_factor = 0.01` and `autovacuum_vacuum_cost_delay = 0` on this specific table.\n  - Ensure no indexes exist on `tokens` or `last_refilled_at`.",
    "code": "WITH updated_bucket AS (\n    UPDATE rate_limit_buckets\n    SET \n        tokens = CASE \n            WHEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) >= 1.0\n            THEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) - 1.0\n            ELSE LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec))\n        END,\n        last_refilled_at = clock_timestamp()\n    WHERE tenant_id = 101\n    RETURNING tenant_id, tokens, max_tokens\n)\nSELECT \n    tenant_id,\n    tokens,\n    CASE WHEN tokens >= 0.0 THEN true ELSE false END AS allowed\nFROM updated_bucket;",
    "followUp": {
      "question": "Why should you use `clock_timestamp()` instead of `CURRENT_TIMESTAMP` or `NOW()` in rate-limiting calculations?",
      "expectedAnswer": "`CURRENT_TIMESTAMP` (or `NOW()`) returns the start time of the **current transaction** and never changes throughout the transaction. If multiple requests or steps execute within the same transaction or if a transaction remains open, `NOW()` will return stale time. `clock_timestamp()` reads the actual real-time operating system clock at the exact microsecond of function execution."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Implements elapsed-time token refill formula correctly",
      "Uses atomic UPDATE with RETURNING to ensure concurrency safety",
      "Specifies HOT updates and fillfactor tuning for write churn",
      "Differentiates clock_timestamp() from CURRENT_TIMESTAMP"
    ]
  },
  "expectedConcepts": [
    "Atomic token refill calculation based on elapsed time (clock_timestamp)",
    "Single UPDATE statement row-level lock preventing race conditions",
    "HOT (Heap-Only Tuple) update optimization with fillfactor = 70",
    "Zero index maintenance on frequently mutated columns",
    "Trade-offs of database-level rate limiting vs in-memory Redis"
  ]
}
```
