# Reference: Autovacuum Tuning, Table Bloat, and Freeze Wraparound

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. The XID Wraparound Problem:**\n- PostgreSQL uses 32-bit unsigned transaction IDs (XIDs), allowing ~4.29 billion unique IDs.\n- Visibility logic considers XIDs modulo $2^{31}$: an XID is in the past if it is within $2^{31}$ transactions behind the current XID; otherwise it is treated as in the future.\n- If a table reaches $2^{31}$ (2.14 billion) transactions without freezing, old past transactions would suddenly appear to be in the future, rendering historical data invisible.\n- At 2 billion XIDs, PostgreSQL triggers an aggressive anti-wraparound autovacuum. If it reaches 2.14 billion, PostgreSQL shuts down and enters single-user mode to prevent data corruption.\n\n**2. VACUUM FREEZE:**\n- Freezing replaces an old tuple’s `xmin` with a special `FrozenTransactionId` (value 2), or sets the `HEAP_XMIN_FROZEN` hint bit in the tuple header, signifying this tuple is permanently visible to all past and future transactions.\n\n**3. Tuning to Prevent Starvation:**\n- `autovacuum_max_workers`: Increase from 3 to 6-8 on multi-core servers.\n- `autovacuum_vacuum_cost_limit`: Default (200 in older versions, 2000 in PG 16+) is too low; raise to 1000-5000 so vacuum workers run faster without sleeping.\n- `autovacuum_vacuum_cost_delay`: Reduce from 20ms or 2ms to 0ms or 2ms to prevent unnecessary throttle sleep.\n- Per-table tuning: For high-churn tables (e.g. `payments`):\n  `ALTER TABLE payments SET (autovacuum_vacuum_scale_factor = 0.05, autovacuum_vacuum_threshold = 1000);`",
    "followUp": {
      "question": "Why does a long-running transaction or an abandoned replication slot prevent VACUUM from cleaning dead rows, even if autovacuum runs constantly?",
      "expectedAnswer": "VACUUM can only remove dead tuple versions whose `xmax` is older than the oldest active transaction snapshot (`xmin horizon`). If an open transaction or an inactive logical replication slot holds back the catalog `xmin`, VACUUM cannot remove any dead rows generated after that transaction began, causing table and index bloat across the entire database."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains 32-bit circular XID space and 2^31 wraparound failure mode",
      "Details VACUUM FREEZE and FrozenTransactionId mechanics",
      "Explains cost limit / cost delay worker throttling",
      "Identifies oldest active transaction/replication slot xmin horizon"
    ]
  },
  "expectedConcepts": [
    "32-bit XID space and modulo 2^31 visibility horizon",
    "FrozenTransactionId / HEAP_XMIN_FROZEN hint bit",
    "Anti-wraparound autovacuum and emergency database shutdown",
    "autovacuum_vacuum_cost_limit and cost_delay throttling",
    "Per-table scale_factor and threshold tuning"
  ]
}
```
