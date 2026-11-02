# Reference: Two-Phase Commit (2PC) and Orphaned Prepared Transaction Disasters

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Two-Phase Commit (2PC) Mechanics:**\n- `PREPARE TRANSACTION 'gid';`: Flushes all transaction modifications, locks, and state durably to disk (in `pg_twophase`). The backend connection terminates and returns to the pool.\n- `COMMIT PREPARED 'gid';` or `ROLLBACK PREPARED 'gid';`: Executed later by the distributed transaction coordinator to finalize the transaction.\n\n**2. The Orphaned 2PC Disaster:**\n- **Survives Server Reboots**: Unlike normal in-memory transactions, a prepared transaction **never expires and survives server restarts**.\n- **Permanent Locks**: All row and table locks acquired by the prepared transaction remain held indefinitely until explicitly committed or rolled back.\n- **Global xmin Horizon Pinning**: The prepared transaction retains its original transaction ID (`xmin`). As the rest of the database executes millions of subsequent transactions, the global `xmin` horizon cannot advance past the orphaned 2PC. Consequently, **VACUUM cannot clean up a single dead tuple across any table in the entire database**, causing catastrophic table bloat and eventually emergency XID wraparound shutdown.\n\n**3. Diagnostic and Remediation SQL:**\n```sql\n-- 1. Inspect orphaned prepared transactions\nSELECT gid, prepared, owner, database\nFROM pg_prepared_xacts\nORDER BY prepared ASC;\n\n-- 2. Terminate and discard the orphaned transaction\nROLLBACK PREPARED 'disburse_loan_49102';\n```\nAfter rolling back, the xmin horizon advances immediately, and VACUUM can reclaim dead space.",
    "followUp": {
      "question": "Should web applications or microservices use PostgreSQL 2PC directly, or is an alternative architectural pattern preferred?",
      "expectedAnswer": "Direct 2PC is strongly discouraged in microservice architectures because coordinators are single points of failure that cause orphaned distributed locks. Industry best practice favors the **Saga Pattern** or **Transactional Outbox Pattern** with asynchronous eventual consistency and compensating transactions, which avoids holding synchronous locks across service boundaries."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains 2PC protocol and persistence in pg_twophase",
      "Details why prepared transactions persist after connection drops",
      "Explains global xmin horizon pinning and database-wide bloat",
      "Provides pg_prepared_xacts query and ROLLBACK PREPARED syntax"
    ]
  },
  "expectedConcepts": [
    "PREPARE TRANSACTION and pg_twophase durability",
    "Prepared transactions surviving client disconnection and server restarts",
    "Infinite row lock retention",
    "Holding back catalog xmin horizon and preventing VACUUM across the entire database",
    "ROLLBACK PREPARED remediation"
  ]
}
```
