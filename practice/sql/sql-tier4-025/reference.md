# Reference: PostgreSQL Advisory Locks for Queue Worker Deadlock Prevention

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why Deadlocks Occurred:**\n- Transaction A updates `payments` for Order 1, then attempts to lock `customers` for Customer 42.\n- Transaction B updates `payments` for Order 2, then attempts to lock `customers` for Customer 42.\n- If both transactions acquire locks on different payment rows simultaneously and then both request exclusive locks on the same customer row, or if reverse ordering occurs, a deadlock occurs.\n\n**2. Resolution via Transaction Advisory Locks:**\n```sql\nBEGIN;\n-- Acquire advisory lock on the Customer entity ID at the start of the transaction\nSELECT pg_advisory_xact_lock(p_customer_id);\n\n-- All operations for Customer 42 across all endpoints are now serialized\nUPDATE customers\nSET balance = balance - p_refund_amount\nWHERE id = p_customer_id;\n\nUPDATE payments\nSET status = 'REFUNDED'\nWHERE id = p_payment_id;\n\nCOMMIT; -- Advisory lock automatically released\n```\nBecause any transaction touching Customer 42 acquires the advisory lock before touching any table rows, multiple transactions for the same customer queue orderly in memory, eliminating all circular wait conditions.",
    "code": "SELECT pg_advisory_xact_lock(42);\nUPDATE customers\nSET balance = balance - 50.00\nWHERE id = 42\nRETURNING id, balance;",
    "followUp": {
      "question": "What is the performance advantage of using `pg_advisory_xact_lock(customer_id)` over `SELECT id FROM customers WHERE id = 42 FOR UPDATE`?",
      "expectedAnswer": "`SELECT FOR UPDATE` requires reading the heap page, writing the transaction ID into the row's `xmax` header, generating WAL, and dirtying the 8KB page in `shared_buffers`. In contrast, `pg_advisory_xact_lock` executes 100% in server RAM in the shared memory lock table with zero disk reads, zero disk writes, zero WAL, and zero tuple bloat."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains deadlock elimination via serialized entity locking",
      "Uses pg_advisory_xact_lock with integer ID",
      "Contrasts advisory lock memory efficiency with row-level locks",
      "Demonstrates clean transaction lifecycle"
    ]
  },
  "expectedConcepts": [
    "Deadlock root cause: non-deterministic lock acquisition order across tables",
    "pg_advisory_xact_lock establishing mutual exclusion before table access",
    "Serialization of concurrent customer operations in shared memory",
    "Automatic lock release at COMMIT/ROLLBACK boundary"
  ]
}
```
