# Reference: Production Incident: Replica WAL Replay Lag Induced by Long Standby Queries

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why Standby WAL Replay Pauses:**\n- On the primary, VACUUM removes dead tuples and logs these cleanup actions into WAL.\n- When the streaming replica replays this WAL, it must remove those exact same physical tuples from its local disk pages. To do so, the recovery process requires exclusive access to those pages.\n- If a long-running read query on the standby is reading those pages, a **recovery conflict** occurs.\n- PostgreSQL halts WAL replay on the standby for up to `max_standby_streaming_delay` (default 30 seconds) to allow the read query to finish.\n- If `max_standby_streaming_delay = -1` or is set to hours, **WAL replay stops completely**, causing replication lag to accumulate indefinitely!\n\n**2. Resolution & Configuration Tuning:**\n- **Strict Delay Timeout**: Keep `max_standby_streaming_delay = 30s` (or `60s`). If a query conflicts for longer than 30 seconds, PostgreSQL cancels the query with `canceling statement due to conflict with recovery`, protecting the replica from falling behind.\n- **`hot_standby_feedback = on`**: The standby sends its oldest transaction snapshot back to the primary. The primary's VACUUM will delay removing dead tuples that the standby is reading. *Warning*: This prevents recovery conflicts on the standby, but can cause severe table bloat on the **primary** if standby queries run for hours!\n\n**3. Production Architecture Best Practice:**\n- Never mix short-lived OLTP read queries and long-running OLAP queries on the same standby.\n- Provision a **dedicated analytical replica** configured with `hot_standby_feedback = on` and `max_standby_streaming_delay = 1h`, isolated from the customer-facing OLTP read replica pool.",
    "followUp": {
      "question": "What query can an SRE run on the replica to check how much time is remaining before a conflicting statement is terminated by `max_standby_streaming_delay`?",
      "expectedAnswer": "In PostgreSQL 14+, the view `pg_stat_database_conflicts` tracks the number of conflicts per database (`confl_tablespace`, `confl_lock`, `confl_snapshot`, `confl_bufferpin`, `confl_deadlock`). Inspecting `pg_stat_activity` on the replica shows the query start time, allowing the operator to calculate remaining time against `max_standby_streaming_delay`."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why WAL replay conflicts with long-running standby reads",
      "Details max_standby_streaming_delay query cancellation",
      "Explains hot_standby_feedback and trade-off with primary bloat",
      "Recommends dedicated analytical replica tiering"
    ]
  },
  "expectedConcepts": [
    "Recovery conflict caused by WAL replay needing to remove tuples read by standby queries",
    "max_standby_streaming_delay timeout behavior",
    "hot_standby_feedback propagating snapshot to primary to delay vacuum",
    "Risk of primary table bloat when hot_standby_feedback is enabled",
    "Architectural segregation: separate OLTP and OLAP read replicas"
  ]
}
```
