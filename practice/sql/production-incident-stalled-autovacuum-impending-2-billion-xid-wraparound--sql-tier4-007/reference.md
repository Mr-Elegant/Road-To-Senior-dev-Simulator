# Reference: Production Incident: Stalled Autovacuum & Impending 2-Billion XID Wraparound

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Incident Diagnosis:**\n- Process 5102 is an anti-wraparound autovacuum worker attempting to freeze `audit_logs` (relation 24590). It needs a `ShareUpdateExclusiveLock`.\n- Process 3892 is holding a conflicting lock or an open transaction. In many incidents, this is an application connection in `idle in transaction` state or a developer’s uncommitted psql session.\n- Furthermore, if Process 3892 has been open for 18 hours, its `backend_xmin` is pinning the visibility horizon, preventing VACUUM from freezing any tuples created after it started.\n\n**2. Diagnostic Investigation:**\n```sql\n-- 1. Inspect the blocking process\nSELECT pid, usename, client_addr, state, backend_xmin, \n       now() - xact_start AS xact_duration, query\nFROM pg_stat_activity\nWHERE pid = 3892;\n\n-- 2. Check oldest xmins holding back the database\nSELECT pid, usename, state, backend_xmin, query\nFROM pg_stat_activity\nWHERE backend_xmin IS NOT NULL\nORDER BY backend_xmin ASC\nLIMIT 5;\n```\n\n**3. Immediate Remediation (Unblock & Accelerate):**\n```sql\n-- Step A: Terminate the blocking connection immediately\nSELECT pg_terminate_backend(3892);\n\n-- Step B: Temporarily disable vacuum cost throttling in current session and run manual VACUUM FREEZE\nSET vacuum_cost_delay = 0;\nSET vacuum_cost_limit = 10000;\nVACUUM FREEZE ANALYZE VERBOSE audit_logs;\n```\nSetting `vacuum_cost_delay = 0` allows the vacuum to utilize full disk I/O bandwidth without sleeping, freezing millions of tuples per minute.\n\n**4. Long-Term Safeguards:**\n- Set `idle_in_transaction_session_timeout = '5min'` to automatically terminate abandoned transactions.\n- Monitor `SELECT datname, age(datfrozenxid) FROM pg_database;` with alerts at 1.0 billion transactions.",
    "followUp": {
      "question": "What happens if the database reaches $2^{31}$ transactions before the freeze completes?",
      "expectedAnswer": "PostgreSQL stops accepting all new client connections and will refuse any transaction that attempts to assign an XID. The database enters emergency recovery mode. The only way to restore service is to stop the server and run `postgres --single -D /data/dir saas_analytics` from the command line in single-user mode to execute `VACUUM FREEZE` without concurrency."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Identifies blocking PID 3892 and backend_xmin pinning",
      "Provides diagnostic queries for pg_stat_activity",
      "Terminates blocker and runs unthrottled VACUUM FREEZE (cost_delay = 0)",
      "Configures idle_in_transaction_session_timeout safeguard"
    ]
  },
  "expectedConcepts": [
    "ShareUpdateExclusiveLock conflict on table during autovacuum",
    "idle in transaction holding backend_xmin horizon",
    "pg_terminate_backend to kill offending blocker",
    "Disabling vacuum_cost_delay (set to 0) to maximize freeze throughput",
    "idle_in_transaction_session_timeout preventive safeguard"
  ]
}
```
