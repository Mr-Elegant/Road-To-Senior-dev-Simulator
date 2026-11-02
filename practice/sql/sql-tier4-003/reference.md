# Reference: Production Incident: Replication Lag Spike & Disk Exhaustion on Primary

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Root Cause Analysis:**\n- PostgreSQL uses Write-Ahead Logging (WAL). In streaming replication with replication slots, the primary **guarantees** it will never delete WAL segments that have not yet been acknowledged by the replication slot.\n- If a replica stalls, network disconnects, or a long-running analytical query on the standby holds back the replay LSN, the primary retains all generated WAL files in `pg_wal`.\n- Over 2 hours, 245 GB of WAL accumulated on the primary, threatening disk crash.\n\n**2. Diagnostic Query on Primary:**\n```sql\nSELECT \n    slot_name, \n    slot_type, \n    active, \n    wal_status,\n    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_bytes\nFROM pg_replication_slots;\n```\n\n**3. Immediate Emergency Mitigation:**\nIf the primary disk is at 98%, to prevent total database crash:\n```sql\n-- If replica is permanently stuck, drop the slot to immediately free WAL disk space\nSELECT pg_drop_replication_slot('standby_replica_slot');\n-- Checkpoints will immediately remove obsolete WAL files from pg_wal\nCHECKPOINT;\n```\n*(Note: The dropped replica must be rebuilt from a fresh basebackup later).*\n\n**4. Permanent Architectural Safeguards (PostgreSQL 13+):**\n- **`max_slot_wal_keep_size`**: Set a hard safety ceiling (e.g. `max_slot_wal_keep_size = 50GB`). If a replica lags beyond 50GB, PostgreSQL automatically invalidates the slot and deletes WAL, sacrificing the replica to protect the primary from disk failure.\n- **`hot_standby_feedback`**: If enabled, standby informs primary of its oldest active transaction, preventing primary VACUUM from removing rows needed by standby queries (prevents recovery conflicts), but risks table bloat on primary.",
    "followUp": {
      "question": "What is a \"recovery conflict\" on a read replica, and how does `max_standby_streaming_delay` handle it?",
      "expectedAnswer": "A recovery conflict occurs when WAL replay on a replica needs to delete or vacuum dead tuples that a concurrent read query on that replica is still reading. PostgreSQL pauses WAL replay for up to `max_standby_streaming_delay` (default 30s). If the read query is still running after this timeout, PostgreSQL cancels the read query with error `canceling statement due to conflict with recovery` to allow WAL replay to continue."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why replication slots pin WAL files on primary storage",
      "Provides diagnostic SQL for pg_replication_slots lag",
      "Details max_slot_wal_keep_size safety ceiling configuration",
      "Explains recovery conflict cancellation and max_standby_streaming_delay"
    ]
  },
  "expectedConcepts": [
    "Replication slot WAL retention guarantee on primary",
    "pg_replication_slots restart_lsn and retained bytes calculation",
    "max_slot_wal_keep_size safety ceiling in PG 13+",
    "hot_standby_feedback vs recovery conflict trade-offs",
    "Emergency slot drop and CHECKPOINT to free disk space"
  ]
}
```
