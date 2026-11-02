# Reference: Point-In-Time Recovery (PITR) Disaster Recovery Architecture

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. PITR Architecture Overview:**\n- PITR combines a physical snapshot of the database files (**base backup**) with a continuous sequence of archived WAL segment files (**WAL archive**).\n- Because every single transaction commit is recorded sequentially in WAL, PostgreSQL can replay WAL records forward from the base backup up to an exact microsecond timestamp or transaction ID, stopping immediately before the disaster.\n\n**2. Prerequisites for PITR:**\n- `wal_level = replica` or `logical`.\n- Continuous WAL archiving enabled: `archive_mode = on` and `archive_command = 'wal-g wal-push %p'` (or S3 push).\n- Regular baseline backups taken with `pg_basebackup` or WAL-G.\n\n**3. Step-by-Step Restoration Procedure:**\n- *Step A (Stop & Isolate)*: Immediately stop the current production database instance to prevent further damage.\n- *Step B (Restore Base Backup)*: Provision a new recovery server and extract the most recent physical base backup taken before 14:32 UTC (e.g. the 00:00 UTC backup) into the data directory `$PGDATA`.\n- *Step C (Configure Recovery Target)*: In PostgreSQL 12+, configure `postgresql.conf` (or `recovery.signal`):\n```ini\nrestore_command = 'wal-g wal-fetch \"%f\" \"%p\"'\nrecovery_target_time = '2026-11-01 14:32:05 UTC'\nrecovery_target_action = 'pause' -- Pauses replay so DBA can verify tables before promoting\n```\n- *Step D (Signal Recovery)*: Create an empty file named `recovery.signal` in `$PGDATA`.\n- *Step E (Start Replay)*: Start PostgreSQL. Postgres replays archived WAL files sequentially up to `14:32:05 UTC` and pauses.\n- *Step F (Verify & Promote)*: The DBA connects in read-only mode, verifies `repayments` rows exist, and executes `SELECT pg_wal_replay_resume();` or promotes the database to read-write mode.",
    "followUp": {
      "question": "What is a PostgreSQL \"Timeline\" (`recovery_target_timeline`), and why does promoting a database create a new timeline ID?",
      "expectedAnswer": "A Timeline is a branch in PostgreSQL history. When a database completes recovery and opens for writes, PostgreSQL branches into a new timeline (e.g. from Timeline 1 to Timeline 2). This prevents WAL files generated on the new branch from overwriting WAL files from the previous timeline, allowing recovery to navigate alternative recovery branches."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Contrasts PITR with simple daily logical dumps",
      "Details required configuration (wal_level, archive_command, restore_command)",
      "Specifies recovery_target_time and recovery.signal",
      "Explains timelines and verification before promotion"
    ]
  },
  "expectedConcepts": [
    "Base backup + continuous WAL archive replay methodology",
    "wal_level, archive_mode, and archive_command prerequisites",
    "recovery.signal file and restore_command in PG 12+",
    "recovery_target_time exact stopping point",
    "recovery_target_action = pause for verification before promotion"
  ]
}
```
