import { SqlQuestion } from '@/types/sqlTrack';

export const TIER4_SENIOR_QUESTIONS: SqlQuestion[] = [
  {
    id: 'sql-tier4-001',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 1,
    title: 'Production Incident: Multi-Transaction Deadlock Graph & Lock Queue Analysis',
    category: 'Locks and Deadlocks',
    questionType: 'incident',
    datasetId: 'ecommerce',
    realWorldScenario:
      'During Black Friday peak traffic, 40 API pods fail with HTTP 500 errors. Database CPU hits 100%, and application logs show repeating `ERROR: 40P01: deadlock detected`. The PostgreSQL log displays a complex lock cycle between three concurrent transactions.',
    questionStatement:
      'Analyze the PostgreSQL deadlock detection mechanism (`deadlock_timeout`). Given the telemetry and log snippet below, trace the cycle in the lock graph. Explain why deadlocks occur even when individual queries are fast, and detail architectural strategies to eliminate deadlocks permanently.',
    incidentDetails: {
      symptoms: [
        'Massive API latency spike (p99 > 30s)',
        'HTTP 500 responses across checkout and refund endpoints',
        'Active PostgreSQL backend connections maxed out at 400',
        'Database logs flooded with ERROR: 40P01: deadlock detected'
      ],
      systemTelemetry: {
        activeConnections: 395,
        lockWaitsCount: 182,
        cpuUtilizationPercent: 98,
        bufferCacheHitRatio: 99.2,
        logSnippet:
          '2026-11-01 10:14:02 UTC [1201]: [3-1] user=app,db=ecommerce ERROR:  deadlock detected\n' +
          'DETAIL:  Process 1201 waits for ShareLock on transaction 89104; blocked by process 1204.\n' +
          'Process 1204 waits for ExclusiveLock on tuple (48, 12) of relation 16402 of database 16384; blocked by process 1209.\n' +
          'Process 1209 waits for ShareLock on transaction 89102; blocked by process 1201.\n' +
          'HINT:  See server log for query details.\n' +
          'STATEMENT:  UPDATE payments SET status = \'CAPTURED\' WHERE order_id = 91823;'
      },
      candidateTasks: [
        'Decode the 3-process lock dependency cycle from the error log',
        'Explain why deadlock_timeout (default 1s) prevents infinite lock hangs',
        'Provide the exact query to inspect live lock contention in pg_locks and pg_stat_activity',
        'Detail the two permanent architectural remediations: strict resource acquisition ordering and optimistic concurrency'
      ]
    },
    referenceAnswer:
      '**1. Lock Dependency Cycle Analysis:**\n- **Process 1201** holds Transaction 89102 and waits for Transaction 89104 (held by Process 1204).\n- **Process 1204** holds Transaction 89104 and waits for a row-level lock on tuple `(48,12)` in `payments` (held by Process 1209).\n- **Process 1209** holds the row-level lock and waits for Transaction 89102 (held by Process 1201).\n- Cycle: `1201 -> 1204 -> 1209 -> 1201`. A classic 3-way circular wait.\n\n**2. Deadlock Detection Mechanics:**\n- When a query requests a conflicting lock, it sleeps on a lock queue. If the lock is not granted within `deadlock_timeout` (default 1000ms), PostgreSQL wakes up the deadlock detection worker.\n- The worker executes a cycle-finding algorithm (Tarjan\'s / DFS) on the directed wait-for graph.\n- Upon detecting a cycle, PostgreSQL chooses one transaction as the "deadlock victim", terminates its query with SQLSTATE `40P01`, and rolls back its transaction, allowing the other two transactions to proceed.\n\n**3. Diagnostic Query for Live Contention:**\n```sql\nSELECT \n    blocked_locks.pid     AS blocked_pid,\n    blocked_activity.usename  AS blocked_user,\n    blocking_locks.pid    AS blocking_pid,\n    blocking_activity.usename AS blocking_user,\n    blocked_activity.query    AS blocked_statement,\n    blocking_activity.query   AS blocking_statement\nFROM  pg_catalog.pg_locks         blocked_locks\nJOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid\nJOIN pg_catalog.pg_locks         blocking_locks \n    ON blocking_locks.locktype = blocked_locks.locktype\n    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database\n    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation\n    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page\n    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple\n    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid\n    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid\n    AND blocking_locks.pid != blocked_locks.pid\nJOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid\nWHERE NOT blocked_locks.granted;\n```\n\n**4. Architectural Remediation:**\n- **Strict Global Lock Ordering**: If multiple rows or tables must be updated in a transaction (e.g. `orders` and `inventory`), always acquire locks in the exact same deterministic order across all application endpoints (e.g., sort IDs: `SELECT ... WHERE id IN (10, 20) ORDER BY id FOR UPDATE`).\n- **Client Retry Loops with Jitter**: Exponential backoff and random jitter for any query failing with `40P01`.\n- **Reduce Transaction Scope**: Never perform third-party HTTP API calls or message queue pushes while holding database row locks.',
    expectedConcepts: [
      'Circular wait graph analysis (1201 -> 1204 -> 1209 -> 1201)',
      'deadlock_timeout and background cycle detection algorithm',
      'pg_locks and pg_stat_activity join query for diagnosing blocking chains',
      'Strict deterministic lock acquisition ordering (sorting IDs)',
      'Never holding DB locks during external network I/O'
    ],
    hints: [
      'Follow the processes in the log snippet: who is holding what transaction ID?',
      'Why does PostgreSQL wait 1 second before checking for a deadlock?',
      'How does sorting IDs before locking prevent cycles?'
    ],
    followUp: {
      question:
        'Why does reducing `deadlock_timeout` from 1s to 50ms in a high-concurrency database often hurt performance rather than helping?',
      expectedAnswer:
        'The deadlock detector requires acquiring exclusive shared-memory locks across the entire PostgreSQL lock table to compute the directed wait-for graph. Running this heavy graph traversal every 50ms across hundreds of concurrent transactions consumes severe CPU and introduces internal spinlock/LWLocks contention, degrading overall server throughput.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Accurately traces 3-process deadlock cycle from log snippet',
        'Explains deadlock_timeout and Tarjan DFS cycle-detection mechanics',
        'Provides correct pg_locks / pg_stat_activity query for live blocking',
        'Proposes deterministic lock ordering and keeping network calls out of transactions'
      ]
    }
  },
  {
    id: 'sql-tier4-002',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 2,
    title: 'Zero-Downtime Column Rename and Type Migration in 24/7 Production',
    category: 'Migrations and Schema Evolution',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A core table `orders` (100 million rows, 3,000 writes/sec) has a column `amount INT` storing dollars that must be converted to `amount_cents BIGINT` to support multi-currency fractional cents. A naive `ALTER TABLE orders ALTER COLUMN amount TYPE BIGINT;` will lock the table for 45 minutes.',
    questionStatement:
      'Design a comprehensive zero-downtime database migration pattern to migrate `amount` to `amount_cents BIGINT` without locking concurrent writes or disrupting older application versions. Detail the expand-and-contract (dual-write) pattern with views, triggers, batch backfills, and final cleanup.',
    referenceAnswer:
      '**The Zero-Downtime Expand-and-Contract Migration Pattern:**\n\n**Phase 1: Expand (Add New Column & Dual-Write Trigger)**\n```sql\n-- 1. Add new column as nullable (instant metadata lock in PG 11+)\nALTER TABLE orders ADD COLUMN amount_cents BIGINT;\n\n-- 2. Create dual-write trigger function so new writes populate both old and new columns\nCREATE OR REPLACE FUNCTION trg_sync_orders_amount()\nRETURNS TRIGGER AS $$\nBEGIN\n    IF NEW.amount_cents IS NULL AND NEW.amount IS NOT NULL THEN\n        NEW.amount_cents := NEW.amount * 100;\n    ELSIF NEW.amount_cents IS NOT NULL AND NEW.amount IS NULL THEN\n        NEW.amount := (NEW.amount_cents / 100)::INT;\n    END IF;\n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_orders_amount_sync\nBEFORE INSERT OR UPDATE ON orders\nFOR EACH ROW EXECUTE FUNCTION trg_sync_orders_amount();\n```\n\n**Phase 2: Historical Batch Backfill (No Table Locks)**\nRun a background worker updating existing records in chunks of 5,000 using keyset pagination:\n```sql\n-- Run in loop with sleep(0.05) between batches\nUPDATE orders\nSET amount_cents = amount * 100\nWHERE id BETWEEN 1 AND 5000\n  AND amount_cents IS NULL;\n```\n\n**Phase 3: Deploy Application Code (Read & Write New Column)**\n- Deploy new application code that reads from and writes to `amount_cents`.\n\n**Phase 4: Contract (Drop Trigger & Old Column)**\n```sql\n-- 1. Add NOT NULL constraint safely using NOT VALID and VALIDATE\nALTER TABLE orders ADD CONSTRAINT chk_amount_cents_not_null CHECK (amount_cents IS NOT NULL) NOT VALID;\nALTER TABLE orders VALIDATE CONSTRAINT chk_amount_cents_not_null;\n\n-- 2. Drop the sync trigger\nDROP TRIGGER trg_orders_amount_sync ON orders;\nDROP FUNCTION trg_sync_orders_amount();\n\n-- 3. Drop old column (metadata-only lock in PG)\nALTER TABLE orders DROP COLUMN amount;\n```',
    expectedConcepts: [
      'Expand-and-contract (parallel-run) migration methodology',
      'Dual-write trigger to synchronize live writes during transition',
      'Keyset batch backfill with pause to prevent lock and WAL saturation',
      'NOT VALID check constraint followed by VALIDATE CONSTRAINT',
      'Zero application downtime and rollback capability'
    ],
    hints: [
      'Why does ALTER TABLE ... ALTER COLUMN TYPE lock the entire table and rewrite all rows?',
      'How does a dual-write trigger allow old and new code to run simultaneously?',
      'How do you backfill 100 million rows without blowing up WAL or holding row locks?'
    ],
    followUp: {
      question:
        'Instead of triggers, can generated columns (`GENERATED ALWAYS AS ... STORED`) be used to migrate column types?',
      expectedAnswer:
        'No, because PostgreSQL `STORED` generated columns cannot be written to directly by application inserts or updates. Furthermore, adding a `STORED` generated column in PostgreSQL requires rewriting the entire table on disk under an `ACCESS EXCLUSIVE` lock, defeating zero-downtime objectives.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains why ALTER COLUMN TYPE causes table rewrite and downtime',
        'Provides dual-write trigger synchronization logic',
        'Details non-blocking chunked backfill using keyset ranges',
        'Validates constraints safely without table rewrite'
      ]
    }
  },
  {
    id: 'sql-tier4-003',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 3,
    title: 'Production Incident: Replication Lag Spike & Disk Exhaustion on Primary',
    category: 'Backup, Recovery, and Replication',
    questionType: 'incident',
    datasetId: 'ecommerce',
    realWorldScenario:
      'At 02:00 AM, the primary database disk usage surges from 40% to 98% in two hours. Monitoring shows physical streaming replication lag to the read-replica increased from 0 bytes to 250 GB. The team suspects an unconsumed replication slot or long-running replica query.',
    questionStatement:
      'Investigate the root cause of WAL retention accumulation on PostgreSQL primaries. Analyze how physical replication slots (`pg_replication_slots`), `wal_keep_size`, and long-running queries on standby (`hot_standby_feedback`) cause disk exhaustion on the primary. Provide immediate mitigation and permanent architectural safeguards.',
    incidentDetails: {
      symptoms: [
        'Primary PostgreSQL disk usage alert: 98% full',
        'Streaming replication lag: 245 GB behind',
        'Standby replica reporting delayed data',
        'Risk of primary entering read-only panic if disk reaches 100%'
      ],
      systemTelemetry: {
        activeConnections: 64,
        replicationLagBytes: 263188283392, // ~245 GB
        cpuUtilizationPercent: 42,
        bufferCacheHitRatio: 99.1,
        logSnippet:
          '2026-11-01 02:45:10 UTC [104]: [1-1] LOG:  checkpoints are occurring too frequently (9 seconds apart)\n' +
          '2026-11-01 02:45:10 UTC [104]: [2-1] HINT:  Consider increasing the configuration parameter "max_wal_size".\n' +
          '2026-11-01 02:50:00 UTC [890]: [1-1] WARNING:  canceling statement due to conflict with recovery\n' +
          '2026-11-01 02:50:00 UTC [890]: [2-1] DETAIL:  User query might have needed to see row versions that must be removed.'
      },
      candidateTasks: [
        'Identify which replication slot is retaining WAL via pg_replication_slots',
        'Explain how max_slot_wal_keep_size prevents disk exhaustion',
        'Analyze hot_standby_feedback vs max_standby_streaming_delay trade-offs',
        'Execute emergency procedure to drop or invalidate stalled slot safely'
      ]
    },
    referenceAnswer:
      '**1. Root Cause Analysis:**\n- PostgreSQL uses Write-Ahead Logging (WAL). In streaming replication with replication slots, the primary **guarantees** it will never delete WAL segments that have not yet been acknowledged by the replication slot.\n- If a replica stalls, network disconnects, or a long-running analytical query on the standby holds back the replay LSN, the primary retains all generated WAL files in `pg_wal`.\n- Over 2 hours, 245 GB of WAL accumulated on the primary, threatening disk crash.\n\n**2. Diagnostic Query on Primary:**\n```sql\nSELECT \n    slot_name, \n    slot_type, \n    active, \n    wal_status,\n    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_bytes\nFROM pg_replication_slots;\n```\n\n**3. Immediate Emergency Mitigation:**\nIf the primary disk is at 98%, to prevent total database crash:\n```sql\n-- If replica is permanently stuck, drop the slot to immediately free WAL disk space\nSELECT pg_drop_replication_slot(\'standby_replica_slot\');\n-- Checkpoints will immediately remove obsolete WAL files from pg_wal\nCHECKPOINT;\n```\n*(Note: The dropped replica must be rebuilt from a fresh basebackup later).*\n\n**4. Permanent Architectural Safeguards (PostgreSQL 13+):**\n- **`max_slot_wal_keep_size`**: Set a hard safety ceiling (e.g. `max_slot_wal_keep_size = 50GB`). If a replica lags beyond 50GB, PostgreSQL automatically invalidates the slot and deletes WAL, sacrificing the replica to protect the primary from disk failure.\n- **`hot_standby_feedback`**: If enabled, standby informs primary of its oldest active transaction, preventing primary VACUUM from removing rows needed by standby queries (prevents recovery conflicts), but risks table bloat on primary.',
    expectedConcepts: [
      'Replication slot WAL retention guarantee on primary',
      'pg_replication_slots restart_lsn and retained bytes calculation',
      'max_slot_wal_keep_size safety ceiling in PG 13+',
      'hot_standby_feedback vs recovery conflict trade-offs',
      'Emergency slot drop and CHECKPOINT to free disk space'
    ],
    hints: [
      'Why does a primary refuse to delete WAL segments when a replication slot exists?',
      'What PostgreSQL 13 parameter sets a maximum limit on WAL retained by a slot?',
      'Check pg_wal_lsn_diff to calculate lag bytes.'
    ],
    followUp: {
      question:
        'What is a "recovery conflict" on a read replica, and how does `max_standby_streaming_delay` handle it?',
      expectedAnswer:
        'A recovery conflict occurs when WAL replay on a replica needs to delete or vacuum dead tuples that a concurrent read query on that replica is still reading. PostgreSQL pauses WAL replay for up to `max_standby_streaming_delay` (default 30s). If the read query is still running after this timeout, PostgreSQL cancels the read query with error `canceling statement due to conflict with recovery` to allow WAL replay to continue.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains why replication slots pin WAL files on primary storage',
        'Provides diagnostic SQL for pg_replication_slots lag',
        'Details max_slot_wal_keep_size safety ceiling configuration',
        'Explains recovery conflict cancellation and max_standby_streaming_delay'
      ]
    }
  },
  {
    id: 'sql-tier4-004',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 4,
    title: 'Zero-Downtime Table Bloat Remediation: pg_repack vs VACUUM FULL',
    category: 'Production Debugging',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Due to a buggy batch job that updated 5 million rows 20 times in a loop, the `inventory` table ballooned from 4 GB to 85 GB. Queries doing sequential scans are now 20x slower. Running `VACUUM FULL inventory;` is rejected by leadership because it requires an ACCESS EXCLUSIVE lock for 3 hours.',
    questionStatement:
      'Explain why standard `VACUUM` cannot return space to the OS. Compare `VACUUM FULL` with `pg_repack`. Detail step-by-step how `pg_repack` rebuilds the table and all indexes online without holding exclusive locks, and explain its log-replay catch-up phase.',
    referenceAnswer:
      '**1. Why Standard VACUUM Cannot Shrink Files:**\n- Standard `VACUUM` marks dead tuples as reusable space inside existing 8KB pages and updates the Free Space Map (FSM).\n- It can only truncate the physical file if dead pages happen to be at the very end of the file. If even a single live row sits on the last page of the file, standard `VACUUM` cannot shrink the file, leaving the OS file size unchanged.\n\n**2. VACUUM FULL vs pg_repack:**\n- **VACUUM FULL**: Creates a new compact copy of the table file and moves live rows into it. **Requires an `ACCESS EXCLUSIVE` lock** on the table for the entire duration, blocking ALL reads (`SELECT`) and writes (`INSERT/UPDATE/DELETE`).\n- **pg_repack**: An open-source extension that rebuilds tables and indexes **online with zero read/write downtime**, acquiring only a minimal brief lock at the start and end of the process.\n\n**3. Step-by-Step pg_repack Internal Mechanism:**\n- *Step A*: Creates an empty log table and attaches a trigger to the original table to record all live `INSERT`, `UPDATE`, and `DELETE` changes.\n- *Step B*: Creates a new destination table file with the same schema.\n- *Step C*: Copies all live rows from the old table to the new table in bulk.\n- *Step D*: Builds all indexes on the new table.\n- *Step E*: Replays changes accumulated in the log table onto the new table until lag is near zero.\n- *Step F*: Acquires a brief `ACCESS EXCLUSIVE` lock (for ~50ms), swaps the system catalog pointers (`pg_class` relfilenode) between old and new tables, and drops the old bloated table.',
    expectedConcepts: [
      'Why standard VACUUM only updates FSM and cannot return middle pages to OS',
      'VACUUM FULL ACCESS EXCLUSIVE lock blocking all reads and writes',
      'pg_repack shadow table, trigger logging, and online bulk copy',
      'Log replay catch-up phase',
      'Brief catalog pointer swap (relfilenode) for zero downtime'
    ],
    hints: [
      'Why can standard VACUUM only truncate pages from the end of the file?',
      'How does pg_repack capture concurrent writes that happen while it copies rows?',
      'How does it finalize the replacement in catalog tables?'
    ],
    followUp: {
      question:
        'What disk space requirement must the database server satisfy before running `pg_repack` or `VACUUM FULL` on an 85GB table?',
      expectedAnswer:
        'Both `pg_repack` and `VACUUM FULL` require at least double the table\'s current storage in free disk space (~90-100 GB free). Because they build a complete second copy of the table and all its indexes on disk simultaneously before swapping and dropping the original, running out of disk space during the operation aborts the process and can crash the database.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains why standard VACUUM cannot release sparse pages to the OS',
        'Details the ACCESS EXCLUSIVE lock hazard of VACUUM FULL',
        'Provides step-by-step mechanics of pg_repack online table rebuilding',
        'Identifies 2x disk space requirement during table compaction'
      ]
    }
  },
  {
    id: 'sql-tier4-005',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 5,
    title: 'Checkpoint Tuning & WAL Generation Spikes: Eliminating I/O Spikes',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Every 5 minutes, database write latency spikes from 1.5ms to 850ms for 30 seconds. System telemetry shows 100% disk write bandwidth saturation coinciding with PostgreSQL log messages: `LOG: checkpoints are occurring too frequently (30 seconds apart)` and `checkpoint starting: time`.',
    questionStatement:
      'Explain the PostgreSQL Checkpoint mechanism. What triggers a checkpoint (`checkpoint_timeout` vs `max_wal_size`)? How does checkpoint spreading (`checkpoint_completion_target`) smooth out disk I/O, and what are full-page writes (`full_page_writes`) after a checkpoint?',
    referenceAnswer:
      '**1. What a Checkpoint Does:**\n- PostgreSQL buffers table and index page modifications in memory (`shared_buffers`). Dirty pages are not immediately written to disk.\n- A checkpoint flushes all dirty shared buffer pages to persistent disk storage, writes a checkpoint record to the WAL, and removes obsolete WAL files.\n- It guarantees that crash recovery will only need to replay WAL records generated **after** the checkpoint record.\n\n**2. Checkpoint Triggers:**\n- **Time-based**: `checkpoint_timeout` (default 5 min). A checkpoint runs automatically when this duration expires.\n- **Volume-based**: `max_wal_size` (default 1GB). If WAL volume generated since last checkpoint exceeds this ceiling, PostgreSQL triggers an **immediate emergency checkpoint** (`checkpoints occurring too frequently`), causing severe disk I/O storms.\n\n**3. Checkpoint Spreading (Smoothing I/O):**\n- `checkpoint_completion_target`: Sets the fraction of `checkpoint_timeout` over which the checkpoint I/O should be smoothed (default 0.9 in modern PG).\n- If `checkpoint_timeout = 15min` and `checkpoint_completion_target = 0.9`, Postgres spreads dirty page writes over $15 \\times 0.9 = 13.5$ minutes, eliminating sharp disk I/O spikes.\n\n**4. Full-Page Writes (FPWs) and Write Amplification:**\n- To protect against torn pages (where the OS or disk controller writes half of an 8KB page during a sudden power loss), PostgreSQL writes the **entire 8KB image** of every page modified for the first time after a checkpoint into WAL.\n- If checkpoints occur every 30 seconds, almost every page write triggers an 8KB full-page write into WAL, causing massive WAL write amplification and disk saturation.\n\n**5. Production Tuning Recommendations:**\n```ini\ncheckpoint_timeout = 15min (or 30min)\nmax_wal_size = 32GB (or 64GB on write-heavy databases)\ncheckpoint_completion_target = 0.9\nmin_wal_size = 4GB\n```',
    expectedConcepts: [
      'Dirty page flushing from shared_buffers to persistent storage',
      'checkpoint_timeout vs max_wal_size triggers',
      'checkpoint_completion_target I/O spreading over time',
      'full_page_writes (FPW) preventing torn pages after crash',
      'Write amplification caused by frequent checkpoints'
    ],
    hints: [
      'What happens when dirty pages are dumped all at once versus smoothed over the interval?',
      'Why does PostgreSQL write an entire 8KB page image into WAL on its first modification after checkpoint?',
      'What parameter should be increased when logs say checkpoints are occurring too frequently?'
    ],
    followUp: {
      question:
        'What is the trade-off of increasing `checkpoint_timeout` to 30 minutes and `max_wal_size` to 64GB?',
      expectedAnswer:
        'The trade-off is crash recovery time (MTTR). In the event of an abrupt server crash or power failure, PostgreSQL must replay all WAL records generated since the last successful checkpoint. A 30-minute checkpoint interval means recovery replay will take several minutes to complete before the database can accept incoming connections.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains dirty page flushing and crash recovery boundary',
        'Differentiates time-based vs volume-based checkpoint triggers',
        'Explains checkpoint_completion_target I/O smoothing calculation',
        'Details full-page writes (FPW) mechanics and recovery trade-offs'
      ]
    }
  },
  {
    id: 'sql-tier4-006',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 6,
    title: 'Point-In-Time Recovery (PITR) Disaster Recovery Architecture',
    category: 'Backup, Recovery, and Replication',
    questionType: 'conceptual',
    datasetId: 'loan_management',
    realWorldScenario:
      'At 14:32:10 UTC, a junior developer running an ad-hoc cleanup script accidentally executed `DELETE FROM repayments;` without a WHERE clause in production. Nightly pg_dump backups were taken at 00:00 UTC (14 hours ago).',
    questionStatement:
      'Design a Point-In-Time Recovery (PITR) procedure to restore the database to 14:32:05 UTC (5 seconds prior to the incident), recovering all 14 hours of transactions without data loss. Explain physical base backups (`pg_basebackup`), continuous WAL archiving (`archive_command` / WAL-G), and `recovery_target_time`.',
    referenceAnswer:
      '**1. PITR Architecture Overview:**\n- PITR combines a physical snapshot of the database files (**base backup**) with a continuous sequence of archived WAL segment files (**WAL archive**).\n- Because every single transaction commit is recorded sequentially in WAL, PostgreSQL can replay WAL records forward from the base backup up to an exact microsecond timestamp or transaction ID, stopping immediately before the disaster.\n\n**2. Prerequisites for PITR:**\n- `wal_level = replica` or `logical`.\n- Continuous WAL archiving enabled: `archive_mode = on` and `archive_command = \'wal-g wal-push %p\'` (or S3 push).\n- Regular baseline backups taken with `pg_basebackup` or WAL-G.\n\n**3. Step-by-Step Restoration Procedure:**\n- *Step A (Stop & Isolate)*: Immediately stop the current production database instance to prevent further damage.\n- *Step B (Restore Base Backup)*: Provision a new recovery server and extract the most recent physical base backup taken before 14:32 UTC (e.g. the 00:00 UTC backup) into the data directory `$PGDATA`.\n- *Step C (Configure Recovery Target)*: In PostgreSQL 12+, configure `postgresql.conf` (or `recovery.signal`):\n```ini\nrestore_command = \'wal-g wal-fetch "%f" "%p"\'\nrecovery_target_time = \'2026-11-01 14:32:05 UTC\'\nrecovery_target_action = \'pause\' -- Pauses replay so DBA can verify tables before promoting\n```\n- *Step D (Signal Recovery)*: Create an empty file named `recovery.signal` in `$PGDATA`.\n- *Step E (Start Replay)*: Start PostgreSQL. Postgres replays archived WAL files sequentially up to `14:32:05 UTC` and pauses.\n- *Step F (Verify & Promote)*: The DBA connects in read-only mode, verifies `repayments` rows exist, and executes `SELECT pg_wal_replay_resume();` or promotes the database to read-write mode.',
    expectedConcepts: [
      'Base backup + continuous WAL archive replay methodology',
      'wal_level, archive_mode, and archive_command prerequisites',
      'recovery.signal file and restore_command in PG 12+',
      'recovery_target_time exact stopping point',
      'recovery_target_action = pause for verification before promotion'
    ],
    hints: [
      'Why is a pg_dump logical backup alone insufficient for restoring to an exact microsecond?',
      'How does recovery.signal tell PostgreSQL to enter recovery mode?',
      'What parameter pauses replay so you can inspect data before promoting to write mode?'
    ],
    followUp: {
      question:
        'What is a PostgreSQL "Timeline" (`recovery_target_timeline`), and why does promoting a database create a new timeline ID?',
      expectedAnswer:
        'A Timeline is a branch in PostgreSQL history. When a database completes recovery and opens for writes, PostgreSQL branches into a new timeline (e.g. from Timeline 1 to Timeline 2). This prevents WAL files generated on the new branch from overwriting WAL files from the previous timeline, allowing recovery to navigate alternative recovery branches.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Contrasts PITR with simple daily logical dumps',
        'Details required configuration (wal_level, archive_command, restore_command)',
        'Specifies recovery_target_time and recovery.signal',
        'Explains timelines and verification before promotion'
      ]
    }
  },
  {
    id: 'sql-tier4-007',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 7,
    title: 'Production Incident: Stalled Autovacuum & Impending 2-Billion XID Wraparound',
    category: 'Production Debugging',
    questionType: 'incident',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'A multi-terabyte SaaS database generates a pager alert: `Transaction ID wraparound threshold reached: database age is 2,050,000,000. PostgreSQL will refuse new transactions in 90 million XIDs.` An anti-wraparound autovacuum process on `audit_logs` has been stuck for 18 hours.',
    questionStatement:
      'Diagnose why the anti-wraparound autovacuum is blocked from advancing the datfrozenxid horizon. Inspect the telemetry, identify blocking queries or idle sessions, and write the immediate commands to unblock vacuum and prevent emergency database shutdown.',
    incidentDetails: {
      symptoms: [
        'Emergency alert: database age 2,050,000,000 XIDs',
        'Database will enter read-only mode at 2,147,483,648 XIDs',
        'Autovacuum worker running for 18 hours with 0% progress',
        'VACUUM FREEZE blocked waiting for lock'
      ],
      systemTelemetry: {
        activeConnections: 112,
        lockWaitsCount: 14,
        cpuUtilizationPercent: 28,
        bufferCacheHitRatio: 99.4,
        logSnippet:
          '2026-11-01 08:00:15 UTC [4012]: [1-1] WARNING:  database "saas_analytics" must be vacuumed within 97483648 transactions\n' +
          '2026-11-01 08:00:15 UTC [4012]: [2-1] HINT:  To avoid a database shutdown, execute a database-wide VACUUM in that database.\n' +
          '2026-11-01 08:00:20 UTC [5102]: [1-1] LOG:  process 5102 still waiting for ShareUpdateExclusiveLock on relation 24590 of database 16384 after 1000.123 ms\n' +
          'DETAIL:  Process holding the lock: 3892. Wait queue: 5102.'
      },
      candidateTasks: [
        'Determine the state and query of PID 3892 blocking the autovacuum worker',
        'Identify oldest xmin holding back the frozen horizon across pg_stat_activity',
        'Terminate blocking backend using pg_terminate_backend',
        'Execute manual VACUUM FREEZE with vacuum_cost_limit tuning'
      ]
    },
    referenceAnswer:
      '**1. Incident Diagnosis:**\n- Process 5102 is an anti-wraparound autovacuum worker attempting to freeze `audit_logs` (relation 24590). It needs a `ShareUpdateExclusiveLock`.\n- Process 3892 is holding a conflicting lock or an open transaction. In many incidents, this is an application connection in `idle in transaction` state or a developer’s uncommitted psql session.\n- Furthermore, if Process 3892 has been open for 18 hours, its `backend_xmin` is pinning the visibility horizon, preventing VACUUM from freezing any tuples created after it started.\n\n**2. Diagnostic Investigation:**\n```sql\n-- 1. Inspect the blocking process\nSELECT pid, usename, client_addr, state, backend_xmin, \n       now() - xact_start AS xact_duration, query\nFROM pg_stat_activity\nWHERE pid = 3892;\n\n-- 2. Check oldest xmins holding back the database\nSELECT pid, usename, state, backend_xmin, query\nFROM pg_stat_activity\nWHERE backend_xmin IS NOT NULL\nORDER BY backend_xmin ASC\nLIMIT 5;\n```\n\n**3. Immediate Remediation (Unblock & Accelerate):**\n```sql\n-- Step A: Terminate the blocking connection immediately\nSELECT pg_terminate_backend(3892);\n\n-- Step B: Temporarily disable vacuum cost throttling in current session and run manual VACUUM FREEZE\nSET vacuum_cost_delay = 0;\nSET vacuum_cost_limit = 10000;\nVACUUM FREEZE ANALYZE VERBOSE audit_logs;\n```\nSetting `vacuum_cost_delay = 0` allows the vacuum to utilize full disk I/O bandwidth without sleeping, freezing millions of tuples per minute.\n\n**4. Long-Term Safeguards:**\n- Set `idle_in_transaction_session_timeout = \'5min\'` to automatically terminate abandoned transactions.\n- Monitor `SELECT datname, age(datfrozenxid) FROM pg_database;` with alerts at 1.0 billion transactions.',
    expectedConcepts: [
      'ShareUpdateExclusiveLock conflict on table during autovacuum',
      'idle in transaction holding backend_xmin horizon',
      'pg_terminate_backend to kill offending blocker',
      'Disabling vacuum_cost_delay (set to 0) to maximize freeze throughput',
      'idle_in_transaction_session_timeout preventive safeguard'
    ],
    hints: [
      'What lock does autovacuum require, and what is process 3892 doing?',
      'Why does an idle in transaction session prevent VACUUM from cleaning rows?',
      'How do you make VACUUM run as fast as possible without throttling?'
    ],
    followUp: {
      question:
        'What happens if the database reaches $2^{31}$ transactions before the freeze completes?',
      expectedAnswer:
        'PostgreSQL stops accepting all new client connections and will refuse any transaction that attempts to assign an XID. The database enters emergency recovery mode. The only way to restore service is to stop the server and run `postgres --single -D /data/dir saas_analytics` from the command line in single-user mode to execute `VACUUM FREEZE` without concurrency.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Identifies blocking PID 3892 and backend_xmin pinning',
        'Provides diagnostic queries for pg_stat_activity',
        'Terminates blocker and runs unthrottled VACUUM FREEZE (cost_delay = 0)',
        'Configures idle_in_transaction_session_timeout safeguard'
      ]
    }
  },
  {
    id: 'sql-tier4-008',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 8,
    title: 'Corrupt Index Remediation and REINDEX CONCURRENTLY Failures',
    category: 'Indexes and Query Planning',
    questionType: 'incident',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A primary key lookup on `orders` where `id = 45910` returns 0 rows. However, `SELECT * FROM orders WHERE id = 45910` with `SET enable_indexscan = off;` returns the row! The B-tree index is corrupt. A developer ran `REINDEX INDEX CONCURRENTLY idx_orders_pkey;` which failed midway after a network timeout.',
    questionStatement:
      'Explain how B-tree index corruption manifests in PostgreSQL. What state is an index left in when `REINDEX CONCURRENTLY` is interrupted? Detail the safe recovery procedure to rebuild the corrupt primary key index online without locking checkout transactions.',
    incidentDetails: {
      symptoms: [
        'Data inconsistency: Index Scan misses existing rows',
        'Sequential scan finds the row',
        'REINDEX CONCURRENTLY aborted midway',
        'pg_class shows duplicate or invalid index entries'
      ],
      systemTelemetry: {
        activeConnections: 80,
        lockWaitsCount: 0,
        cpuUtilizationPercent: 45,
        bufferCacheHitRatio: 98.8,
        logSnippet:
          '2026-11-01 11:20:00 UTC [7120]: [1-1] ERROR:  canceling statement due to statement timeout\n' +
          '2026-11-01 11:20:00 UTC [7120]: [2-1] STATEMENT:  REINDEX INDEX CONCURRENTLY idx_orders_pkey;\n' +
          '2026-11-01 11:20:05 UTC [7125]: [1-1] LOG:  index "idx_orders_pkey_ccnew" marked as invalid'
      },
      candidateTasks: [
        'Inspect pg_index to verify indisvalid and indisready flags',
        'Explain why idx_orders_pkey_ccnew was left behind by interrupted reindex',
        'Drop invalid temporary index concurrently',
        'Execute safe REINDEX CONCURRENTLY with increased statement_timeout'
      ]
    },
    referenceAnswer:
      '**1. B-Tree Index Corruption Symptoms:**\n- When an index page is corrupted (due to hardware disk corruption, OS caching bugs, or RAM bit-flips), the B-tree routing keys can point to incorrect child pages. An index scan follows the incorrect branch, concludes the key does not exist, and returns 0 rows, while a sequential scan reads the physical heap and finds the row.\n\n**2. The REINDEX CONCURRENTLY Interrupted State:**\n- When `REINDEX CONCURRENTLY` runs, PostgreSQL creates a new shadow index named `<indexname>_ccnew`.\n- It builds the new index in two passes while live writes update both the old and new indexes.\n- If interrupted midway (e.g. timeout or connection drop), the operation leaves `<indexname>_ccnew` in an **INVALID** state (`indisvalid = false`, but `indisready = true`).\n- This dead index is updated on every single INSERT and UPDATE, causing double index write amplification and consuming disk space, but the query planner will never use it.\n\n**3. Safe Recovery Procedure:**\n```sql\n-- Step 1: Identify invalid indexes in the database\nSELECT \n    c.relname AS index_name,\n    i.indisvalid,\n    i.indisready\nFROM pg_index i\nJOIN pg_class c ON c.oid = i.indexrelid\nWHERE NOT i.indisvalid;\n\n-- Step 2: Concurrently drop the leftover invalid temporary index\nDROP INDEX CONCURRENTLY IF EXISTS idx_orders_pkey_ccnew;\n\n-- Step 3: Run REINDEX CONCURRENTLY with statement_timeout disabled for this session\nSET statement_timeout = 0;\nREINDEX INDEX CONCURRENTLY idx_orders_pkey;\n```\nBecause `REINDEX CONCURRENTLY` on PostgreSQL 12+ acquires only `SHARE UPDATE EXCLUSIVE` locks, read and write queries against `orders` continue without blocking.',
    expectedConcepts: [
      'Index corruption causing index scan to miss rows found by sequential scan',
      'REINDEX CONCURRENTLY shadow index naming convention (_ccnew)',
      'Invalid index state (indisvalid = false) causing write amplification',
      'DROP INDEX CONCURRENTLY to clean up failed index builds',
      'Setting statement_timeout = 0 for heavy maintenance operations'
    ],
    hints: [
      'Look for the _ccnew index left behind in the log snippet.',
      'Check pg_index to see why the invalid index is still maintained on writes.',
      'Always disable statement_timeout when running REINDEX on large tables.'
    ],
    followUp: {
      question:
        'What official PostgreSQL extension can detect B-tree index logical corruption without waiting for queries to return wrong data?',
      expectedAnswer:
        'The `amcheck` extension. It provides the function `bt_index_check(index_oid)` and `bt_index_parent_check(index_oid)` to verify the structural integrity of B-tree invariant ordering across all sibling and parent-child pages.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains why corrupt index returns 0 rows while seq scan succeeds',
        'Explains _ccnew leftover index and write amplification impact',
        'Details cleanup of invalid index and re-execution with statement_timeout = 0',
        'Mentions amcheck extension for structural verification'
      ]
    }
  },
  {
    id: 'sql-tier4-009',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 9,
    title: 'Atomic Distributed Rate Limiting & Token Bucket in Pure PostgreSQL',
    category: 'Query Optimization',
    questionType: 'executable',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'To prevent external API abuse without introducing Redis infrastructure, your architect wants to implement a high-throughput Token Bucket rate limiter directly in PostgreSQL. Each tenant has a bucket with a max burst limit and a continuous refill rate.',
    questionStatement:
      'Design a concurrency-safe Token Bucket rate limiter in PostgreSQL using an atomic `INSERT ... ON CONFLICT DO UPDATE` statement. Given a request requiring 1 token, compute elapsed time refills dynamically, deduct the token if available, and return a boolean indicating whether the request was allowed.',
    starterCode:
      '-- Concurrency-safe rate limit token bucket deduction\n-- Table schema: (tenant_id INT PRIMARY KEY, tokens NUMERIC, max_tokens NUMERIC, refill_rate_per_sec NUMERIC, last_refilled_at TIMESTAMPTZ)\nWITH updated_bucket AS (\n    UPDATE rate_limit_buckets\n    SET \n        tokens = CASE \n            -- If refilled tokens >= 1, deduct 1 token\n            WHEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) >= 1.0\n            THEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) - 1.0\n            -- Otherwise leave current refilled tokens\n            ELSE LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec))\n        END,\n        last_refilled_at = clock_timestamp()\n    WHERE tenant_id = 101\n    RETURNING tenant_id, tokens, max_tokens\n)\nSELECT \n    tenant_id,\n    tokens,\n    CASE WHEN tokens >= 0.0 THEN true ELSE false END AS allowed\nFROM updated_bucket;',
    sqlSolution:
      'WITH updated_bucket AS (\n    UPDATE rate_limit_buckets\n    SET \n        tokens = CASE \n            WHEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) >= 1.0\n            THEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) - 1.0\n            ELSE LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec))\n        END,\n        last_refilled_at = clock_timestamp()\n    WHERE tenant_id = 101\n    RETURNING tenant_id, tokens, max_tokens\n)\nSELECT \n    tenant_id,\n    tokens,\n    CASE WHEN tokens >= 0.0 THEN true ELSE false END AS allowed\nFROM updated_bucket;',
    referenceAnswer:
      '**1. Algorithm Mechanics:**\n- Rather than running a background tick thread to refill tokens, calculate refilled tokens on-demand at the exact moment a request arrives:\n  $$\\text{new\\_tokens} = \\min(\\text{max\\_tokens}, \\text{current\\_tokens} + \\Delta t \\times \\text{refill\\_rate})$$\n- By packaging this inside a single `UPDATE ... WHERE tenant_id = $1 RETURNING ...`, PostgreSQL acquires an exclusive row-level lock on that tenant’s row, guaranteeing strictly atomic serialization of concurrent requests without race conditions.\n\n**2. High-Throughput Considerations:**\n- Because high-traffic tenants will update this row hundreds of times per second, the table will suffer from severe MVCC tuple bloat.\n- To support 10,000 req/sec in PostgreSQL:\n  - Set `WITH (fillfactor = 70)` on the table to ensure Heap-Only Tuple (HOT) updates without touching index pages.\n  - Set `autovacuum_vacuum_scale_factor = 0.01` and `autovacuum_vacuum_cost_delay = 0` on this specific table.\n  - Ensure no indexes exist on `tokens` or `last_refilled_at`.',
    expectedConcepts: [
      'Atomic token refill calculation based on elapsed time (clock_timestamp)',
      'Single UPDATE statement row-level lock preventing race conditions',
      'HOT (Heap-Only Tuple) update optimization with fillfactor = 70',
      'Zero index maintenance on frequently mutated columns',
      'Trade-offs of database-level rate limiting vs in-memory Redis'
    ],
    hints: [
      'Use clock_timestamp() rather than CURRENT_TIMESTAMP because clock_timestamp() advances during a statement.',
      'LEAST(max_tokens, tokens + elapsed * rate) caps the tokens to bucket capacity.',
      'Why is fillfactor essential for a row updated 100 times per second?'
    ],
    followUp: {
      question:
        'Why should you use `clock_timestamp()` instead of `CURRENT_TIMESTAMP` or `NOW()` in rate-limiting calculations?',
      expectedAnswer:
        '`CURRENT_TIMESTAMP` (or `NOW()`) returns the start time of the **current transaction** and never changes throughout the transaction. If multiple requests or steps execute within the same transaction or if a transaction remains open, `NOW()` will return stale time. `clock_timestamp()` reads the actual real-time operating system clock at the exact microsecond of function execution.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Implements elapsed-time token refill formula correctly',
        'Uses atomic UPDATE with RETURNING to ensure concurrency safety',
        'Specifies HOT updates and fillfactor tuning for write churn',
        'Differentiates clock_timestamp() from CURRENT_TIMESTAMP'
      ]
    },
    testCases: [
      {
        id: 'tc-tier4-009-1',
        description: 'Verify token bucket deduction and allowed status',
        setupSql:
          'CREATE TABLE rate_limit_buckets (tenant_id INT PRIMARY KEY, tokens NUMERIC, max_tokens NUMERIC, refill_rate_per_sec NUMERIC, last_refilled_at TIMESTAMP);\nINSERT INTO rate_limit_buckets VALUES (101, 10.0, 10.0, 1.0, \'2026-01-01 00:00:00\');',
        expectedOutputSql:
          'UPDATE rate_limit_buckets SET tokens = 9.0 WHERE tenant_id = 101; SELECT tenant_id, tokens, true AS allowed FROM rate_limit_buckets WHERE tenant_id = 101;',
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier4-010',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 10,
    title: 'Multi-Tenant Database Architectures: Trade-Off Analysis at Scale',
    category: 'Database Design and Normalization',
    questionType: 'design',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'Your B2B SaaS startup is scaling from 100 to 10,000 enterprise customers, including Fortune 500 banks with strict data isolation and custom schema requirements. The VP of Engineering asks you to recommend the database architecture.',
    questionStatement:
      'Conduct an exhaustive architectural trade-off analysis of the three multi-tenant PostgreSQL patterns: (1) Shared Database, Shared Schema with Row-Level Security; (2) Shared Database, Separate Schema per Tenant; and (3) Separate Database per Tenant. Evaluate each across system catalog limits, connection pool limits, migration complexity, and backup isolation.',
    referenceAnswer:
      '**1. Pattern 1: Shared Database, Shared Schema (with RLS)**\n- **Architecture**: Single database, all tenants share tables (`tenant_id` column on every table), enforced by Row-Level Security policies.\n- **Pros**: Simplest schema migrations (run once), maximum connection pool efficiency, lowest infrastructure cost.\n- **Cons**: "Noisy neighbor" problem (one tenant\'s heavy query degrades others), impossible to restore single tenant from physical backup without ETL, strict developer discipline needed to prevent data leaks.\n- **Scale Limit**: ~5,000-50,000 tenants before partitioning is mandatory.\n\n**2. Pattern 2: Shared Database, Separate Schema per Tenant (`CREATE SCHEMA tenant_42`)**\n- **Architecture**: One database instance, each tenant has its own isolated schema with private tables.\n- **Pros**: Logical data separation, per-tenant table customization, search_path routing.\n- **Cons**: **PostgreSQL System Catalog Bloat Disaster**. If you have 10,000 tenants and 50 tables, PostgreSQL must maintain $10,000 \\times 50 = 500,000$ tables in `pg_class` and `pg_attribute`. System catalog caches (`relcache`) exhaust gigabytes of RAM. Migrations must loop through 10,000 schemas, taking hours.\n- **Recommendation**: Avoid beyond ~500 tenants.\n\n**3. Pattern 3: Separate Database per Tenant**\n- **Architecture**: Each tenant has a dedicated PostgreSQL database (or container).\n- **Pros**: Absolute physical security isolation, independent backup and restore, zero noisy neighbor risk, easy regulatory compliance (SOC2/HIPAA).\n- **Cons**: High connection pool overhead (PgBouncer must manage separate pools per DB), costly multi-database migration pipelines, idle resource waste for small tenants.\n\n**Hybrid Architecture (Industry Best Practice):**\n- Standard Tier: Shared Database with RLS for 98% of small/mid-sized tenants.\n- Enterprise Tier: Dedicated Database per tenant for high-paying enterprise contracts.',
    expectedConcepts: [
      'Shared schema with RLS cost and migration simplicity',
      'Schema-per-tenant system catalog (pg_class) bloat limit',
      'Database-per-tenant isolation, backup, and connection pooling cost',
      'Noisy neighbor problem and noisy tenant partitioning',
      'Hybrid tiering architecture (Shared + Dedicated Enterprise)'
    ],
    hints: [
      'What happens to pg_class when you have 10,000 schemas each with 100 tables?',
      'How does single-tenant backup restore work in a shared schema?',
      'Consider the hybrid approach used by companies like Salesforce and Slack.'
    ],
    followUp: {
      question:
        'Why does PgBouncer struggle when an application uses the Separate Database per Tenant model with 5,000 databases?',
      expectedAnswer:
        'PgBouncer maintains separate connection pools per `(database, user)` pair. If 5,000 databases each require even a minimum pool of 2 backend connections, PostgreSQL would require at least 10,000 backend processes, completely exhausting server memory and exceeding max_connections.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Analyzes all three multi-tenant models systematically',
        'Identifies catalog bloat (pg_class/relcache) in schema-per-tenant',
        'Evaluates connection pooling constraints in database-per-tenant',
        'Proposes hybrid tiering architecture for real-world enterprise SaaS'
      ]
    }
  },
  {
    id: 'sql-tier4-011',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 11,
    title: 'Production Incident: Cascading Lock Pileup Caused by Missing Foreign Key Index',
    category: 'Locks and Deadlocks',
    questionType: 'incident',
    datasetId: 'ecommerce',
    realWorldScenario:
      'During a customer account deletion workflow, a batch script deletes 1,000 inactive accounts from `customers`. Within 10 seconds, the entire payment API freezes. Investigation shows that deleting a row from `customers` triggers a table-wide `ShareLock` or sequential scan on `orders`.',
    questionStatement:
      'Explain how PostgreSQL enforces foreign key constraints during DELETE/UPDATE of parent rows. Why does a foreign key column without an index on the child table cause table-level lock contention and cascading API outages? Write the query to detect all unindexed foreign keys across the database.',
    incidentDetails: {
      symptoms: [
        'API freeze during customer account deletions',
        'Hundreds of INSERT/UPDATE transactions queued on orders table',
        'pg_stat_activity shows DELETE FROM customers waiting on locks',
        'High disk I/O on orders heap table'
      ],
      systemTelemetry: {
        activeConnections: 198,
        lockWaitsCount: 165,
        cpuUtilizationPercent: 92,
        bufferCacheHitRatio: 97.4,
        logSnippet:
          '2026-11-01 14:05:01 UTC [2910]: [1-1] LOG:  process 2910 still waiting for RowShareLock on relation "orders" after 1000.412 ms\n' +
          '2026-11-01 14:05:01 UTC [2910]: [2-1] STATEMENT:  DELETE FROM customers WHERE id = 48102;\n' +
          '2026-11-01 14:05:05 UTC [3104]: [1-1] LOG:  process 3104 still waiting for ExclusiveLock on relation "orders"'
      },
      candidateTasks: [
        'Explain why PostgreSQL must scan child table on parent DELETE',
        'Demonstrate that PostgreSQL does NOT automatically index foreign keys',
        'Provide the system catalog query to identify all unindexed foreign keys',
        'Generate DDL to create missing indexes CONCURRENTLY'
      ]
    },
    referenceAnswer:
      '**1. Foreign Key Verification Mechanics:**\n- When a row is deleted or has its primary key updated in a parent table (`customers`), PostgreSQL must verify that no child rows in `orders` reference that parent row (`ON DELETE RESTRICT/NO ACTION`) or cascade the delete (`ON DELETE CASCADE`).\n- To perform this check, PostgreSQL queries the child table: `SELECT 1 FROM orders WHERE customer_id = $1`.\n- **The Critical Trap**: PostgreSQL automatically creates a unique index on the parent table’s PRIMARY KEY, but **it NEVER automatically creates an index on foreign key columns in child tables**.\n- Without an index on `orders(customer_id)`, every single parent row deletion triggers a **full sequential scan of the 40-million row `orders` table** while holding row locks, locking out concurrent writes and exhausting connection pools.\n\n**2. System Catalog Query to Detect All Unindexed Foreign Keys:**\n```sql\nSELECT \n    c.conrelid::regclass AS child_table,\n    c.conname AS foreign_key_name,\n    string_agg(a.attname, \', \' ORDER BY array_position(c.conkey, a.attnum)) AS fk_columns\nFROM pg_constraint c\nJOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)\nWHERE c.contype = \'f\'\n  AND NOT EXISTS (\n      SELECT 1 FROM pg_index i\n      WHERE i.indrelid = c.conrelid\n        AND i.indkey[0:array_length(c.conkey, 1) - 1] = c.conkey\n  )\nGROUP BY c.conrelid, c.conname;\n```\n\n**3. Remediation:**\n```sql\nCREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);\n```',
    expectedConcepts: [
      'Child table scan on parent row deletion',
      'PostgreSQL does NOT automatically index foreign keys',
      'Full sequential scan of child table under lock for every deleted parent row',
      'System catalog query comparing pg_constraint with pg_index',
      'CREATE INDEX CONCURRENTLY on foreign key column'
    ],
    hints: [
      'Does PostgreSQL create an index on child table foreign key columns automatically?',
      'What must the database do when you delete a customer with 10 million orders in the database?',
      'Look at pg_constraint where contype = \'f\'.'
    ],
    followUp: {
      question:
        'Does an `INSERT` into the child table (`orders`) require an index on `orders(customer_id)` to verify the foreign key?',
      expectedAnswer:
        'No. An insert into the child table only needs to verify that the parent customer exists (`SELECT 1 FROM customers WHERE id = $1`). Because `customers.id` is the primary key, it is already indexed. The missing index on the child table only harms parent `DELETE` and parent `UPDATE` operations.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains why parent DELETE triggers child table scans',
        'Highlights that foreign keys are not automatically indexed in PostgreSQL',
        'Provides accurate system catalog query to detect unindexed foreign keys',
        'Recommends CREATE INDEX CONCURRENTLY mitigation'
      ]
    }
  },
  {
    id: 'sql-tier4-012',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 12,
    title: 'Two-Phase Commit (2PC) and Orphaned Prepared Transaction Disasters',
    category: 'Transactions and ACID',
    questionType: 'incident',
    datasetId: 'loan_management',
    realWorldScenario:
      'An external microservice coordinator used PostgreSQL Two-Phase Commit (`PREPARE TRANSACTION`) to coordinate loan disbursements across a banking ledger and core PostgreSQL. The coordinator service crashed midway. Days later, table bloat explodes and autovacuum is paralyzed.',
    questionStatement:
      'Explain Two-Phase Commit (2PC) in PostgreSQL (`PREPARE TRANSACTION` and `COMMIT PREPARED`). What happens when a prepared transaction is orphaned? Why do orphaned prepared transactions lock table rows indefinitely and prevent VACUUM from freezing dead tuples across the entire database?',
    incidentDetails: {
      symptoms: [
        'Autovacuum unable to clean dead rows',
        'Table and index bloat increasing by 15 GB/day',
        'Rows locked by non-existent connection',
        'pg_prepared_xacts shows transaction open for 14 days'
      ],
      systemTelemetry: {
        activeConnections: 45,
        lockWaitsCount: 8,
        cpuUtilizationPercent: 22,
        bufferCacheHitRatio: 98.2,
        logSnippet:
          '2026-11-01 03:00:00 UTC [102]: [1-1] WARNING:  oldest active transaction id is 981204, held by prepared transaction "disburse_loan_49102"\n' +
          '2026-11-01 03:00:00 UTC [102]: [2-1] DETAIL:  Transaction prepared 340 hours ago.'
      },
      candidateTasks: [
        'Inspect pg_prepared_xacts catalog table',
        'Explain why prepared transactions survive client disconnects and server restarts',
        'Analyze how an orphaned 2PC holds back the global xmin horizon',
        'Execute ROLLBACK PREPARED to recover the database'
      ]
    },
    referenceAnswer:
      '**1. Two-Phase Commit (2PC) Mechanics:**\n- `PREPARE TRANSACTION \'gid\';`: Flushes all transaction modifications, locks, and state durably to disk (in `pg_twophase`). The backend connection terminates and returns to the pool.\n- `COMMIT PREPARED \'gid\';` or `ROLLBACK PREPARED \'gid\';`: Executed later by the distributed transaction coordinator to finalize the transaction.\n\n**2. The Orphaned 2PC Disaster:**\n- **Survives Server Reboots**: Unlike normal in-memory transactions, a prepared transaction **never expires and survives server restarts**.\n- **Permanent Locks**: All row and table locks acquired by the prepared transaction remain held indefinitely until explicitly committed or rolled back.\n- **Global xmin Horizon Pinning**: The prepared transaction retains its original transaction ID (`xmin`). As the rest of the database executes millions of subsequent transactions, the global `xmin` horizon cannot advance past the orphaned 2PC. Consequently, **VACUUM cannot clean up a single dead tuple across any table in the entire database**, causing catastrophic table bloat and eventually emergency XID wraparound shutdown.\n\n**3. Diagnostic and Remediation SQL:**\n```sql\n-- 1. Inspect orphaned prepared transactions\nSELECT gid, prepared, owner, database\nFROM pg_prepared_xacts\nORDER BY prepared ASC;\n\n-- 2. Terminate and discard the orphaned transaction\nROLLBACK PREPARED \'disburse_loan_49102\';\n```\nAfter rolling back, the xmin horizon advances immediately, and VACUUM can reclaim dead space.',
    expectedConcepts: [
      'PREPARE TRANSACTION and pg_twophase durability',
      'Prepared transactions surviving client disconnection and server restarts',
      'Infinite row lock retention',
      'Holding back catalog xmin horizon and preventing VACUUM across the entire database',
      'ROLLBACK PREPARED remediation'
    ],
    hints: [
      'Does a prepared transaction abort when the client connection closes?',
      'What catalog table lists all open prepared transactions?',
      'Why does an old transaction ID prevent VACUUM from removing dead rows anywhere?'
    ],
    followUp: {
      question:
        'Should web applications or microservices use PostgreSQL 2PC directly, or is an alternative architectural pattern preferred?',
      expectedAnswer:
        'Direct 2PC is strongly discouraged in microservice architectures because coordinators are single points of failure that cause orphaned distributed locks. Industry best practice favors the **Saga Pattern** or **Transactional Outbox Pattern** with asynchronous eventual consistency and compensating transactions, which avoids holding synchronous locks across service boundaries.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains 2PC protocol and persistence in pg_twophase',
        'Details why prepared transactions persist after connection drops',
        'Explains global xmin horizon pinning and database-wide bloat',
        'Provides pg_prepared_xacts query and ROLLBACK PREPARED syntax'
      ]
    }
  },
  {
    id: 'sql-tier4-013',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 13,
    title: 'Linux OOM Killer Tuning, overcommit_memory, and PostgreSQL Work_mem',
    category: 'Production Debugging',
    questionType: 'incident',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Without warning, the primary PostgreSQL instance abruptly shuts down during month-end reporting. Kernel syslog shows: `Out of Memory: Killed process 4102 (postgres) total-vm: 64GB, anon-rss: 58GB`. After restart, the database went through a 15-minute crash recovery.',
    questionStatement:
      'Analyze how Linux Out-Of-Memory (OOM) Killer interacts with PostgreSQL memory management. Explain `shared_buffers` vs `work_mem` multiplication per connection, Linux `vm.overcommit_memory`, `vm.overcommit_ratio`, and how to configure `oom_score_adj` to protect the PostgreSQL postmaster.',
    incidentDetails: {
      symptoms: [
        'Sudden total database crash and connection drop',
        'Kernel dmesg: Out of Memory: Killed process',
        '15-minute crash recovery replay on restart',
        'Dozens of complex analytical queries running concurrently'
      ],
      systemTelemetry: {
        activeConnections: 350,
        cpuUtilizationPercent: 95,
        bufferCacheHitRatio: 99.0,
        logSnippet:
          'kernel: [89104.12] Out of memory: Kill process 4102 (postgres) score 852 or sacrifice child\n' +
          'kernel: [89104.14] Killed process 4102 (postgres) total-vm:67108864kB, anon-rss:61440000kB\n' +
          'postgres[101]: [1-1] LOG:  server process (PID 4102) was terminated by signal 9: Killed\n' +
          'postgres[101]: [2-1] LOG:  terminating any other active server processes\n' +
          'postgres[101]: [3-1] LOG:  all server processes terminated; reinitializing shared memory and database'
      },
      candidateTasks: [
        'Explain why Linux killed postmaster or backend child with SIGKILL (signal 9)',
        'Demonstrate how work_mem * max_connections causes RAM oversubscription',
        'Configure Linux vm.overcommit_memory = 2 and vm.overcommit_ratio',
        'Configure oom_score_adj = -1000 for the main postmaster process'
      ]
    },
    referenceAnswer:
      '**1. How the Crash Happened (Signal 9 SIGKILL):**\n- When the Linux kernel runs out of physical RAM and swap, the OOM Killer chooses a process with a high badness score and issues `SIGKILL` (signal 9).\n- If the kernel kills a PostgreSQL backend process holding shared memory locks, PostgreSQL detects that shared memory might be corrupted and immediately terminates all other backends and restarts to execute crash recovery.\n- If the kernel kills the main postmaster daemon directly, the entire service dies instantly.\n\n**2. Memory Multiplication Trap (`work_mem`):**\n- `shared_buffers` is allocated once at startup (e.g. 16GB).\n- `work_mem` (e.g. set to 256MB) is allocated **per sort/hash operation per query**.\n- A complex query with 4 joins and 2 sorts can allocate $6 \\times 256\\text{MB} = 1.5\\text{GB}$ for a single backend!\n- If 100 concurrent connections run complex queries, RAM consumption surges to $100 \\times 1.5\\text{GB} = 150\\text{GB}$, easily crushing a 64GB server.\n\n**3. Linux Kernel Configuration Safeguards:**\n- Set `vm.overcommit_memory = 2` (never overcommit) and `vm.overcommit_ratio = 80` in `/etc/sysctl.conf`. This prevents Linux from promising more RAM than physically exists plus swap.\n- **Protect Postmaster from OOM Killer**:\n  In systemd service definition for PostgreSQL, set:\n  `OOMScoreAdjust=-1000`\n  This tells the Linux kernel to never kill the postmaster process, forcing it to sacrifice individual runaway client processes instead.',
    expectedConcepts: [
      'Linux OOM killer killing processes with SIGKILL (signal 9)',
      'Shared memory corruption risk forcing database restart',
      'work_mem allocated per operation per connection (multiplication factor)',
      'vm.overcommit_memory = 2 (strict no-overcommit)',
      'OOMScoreAdjust=-1000 protecting postmaster in systemd'
    ],
    hints: [
      'Is work_mem allocated once per connection, or once per sort/hash operation in a query?',
      'What happens when Linux kills a backend process holding shared buffers?',
      'Check OOMScoreAdjust in systemd.'
    ],
    followUp: {
      question:
        'How should `work_mem` be configured safely on a database that serves both fast OLTP queries and occasional heavy reporting queries?',
      expectedAnswer:
        'Keep global `work_mem` low (e.g., 8MB to 16MB) in `postgresql.conf` to protect against OLTP concurrency spikes. For specific batch jobs or reporting queries that genuinely need large in-memory sorts, set it dynamically for that specific transaction or session only: `SET LOCAL work_mem = \'512MB\';`.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 20,
      performanceWeight: 30,
      edgeCaseWeight: 15,
      criteria: [
        'Explains why signal 9 triggers complete database cluster restart',
        'Details work_mem allocation per sort/hash operator',
        'Configures Linux overcommit_memory and overcommit_ratio',
        'Sets OOMScoreAdjust=-1000 for postmaster daemon'
      ]
    }
  },
  {
    id: 'sql-tier4-014',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 14,
    title: 'Query Plan Regressions: Parameter Sniffing & Generic vs Custom Plans',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A prepared statement `SELECT * FROM orders WHERE status = $1` runs in 0.8ms for the first 4 executions. On the 5th execution, latency explodes to 1,400ms and remains permanently slow for all subsequent queries.',
    questionStatement:
      'Explain PostgreSQL prepared statement execution planning. What is the difference between a Custom Plan and a Generic Plan? How does the 5-execution threshold trigger plan caching, why does parameter sniffing cause plan regressions on skewed data, and how do you fix it?',
    referenceAnswer:
      '**1. Custom Plans vs Generic Plans:**\n- **Custom Plan**: Generated by replacing parameter placeholders (`$1`) with the actual literal value passed by the client. The planner uses exact histogram statistics for that specific value to choose an optimal plan (e.g. Index Scan for rare value `FAILED`).\n- **Generic Plan**: Generated without knowing parameter values (`$1` is unknown). The planner must assume an average distribution across all distinct values (e.g. Seq Scan if the most common value is `DELIVERED`).\n\n**2. The 5-Execution Threshold:**\n- For the first 5 executions of a prepared statement, PostgreSQL generates custom plans.\n- On the 6th execution, PostgreSQL evaluates the average cost of the custom plans against the cost of a single generic plan.\n- If the generic plan\'s estimated cost is not significantly worse than the custom plans, PostgreSQL **permanently switches to the Generic Plan** to avoid repeated query planning CPU overhead.\n\n**3. Skewed Data Catastrophe:**\n- Suppose `status = \'DELIVERED\'` represents 98% of rows, while `status = \'PENDING\'` represents 0.1%.\n- For `PENDING`, an Index Scan takes 1ms.\n- For `DELIVERED`, a Seq Scan takes 500ms.\n- If the generic plan chooses a Seq Scan because `DELIVERED` dominates, subsequent calls for `status = \'PENDING\'` are forced to execute the slow Seq Scan, causing a 500x latency regression!\n\n**4. Remediation:**\n- Force custom plans for the prepared statement / session:\n  `SET plan_cache_mode = force_custom_plan;`\n- Or in application code, use parameterized raw queries without prepared statement caching for columns with severe data skew.',
    expectedConcepts: [
      'Custom Plan (parameter substitution) vs Generic Plan ($1 placeholder)',
      '5-execution comparison threshold in PostgreSQL driver protocol',
      'Data distribution skew (e.g. 98% vs 0.1%) breaking generic plans',
      'plan_cache_mode = force_custom_plan setting',
      'Disabling prepared statement caching for skewed filter columns'
    ],
    hints: [
      'Why does PostgreSQL test the query 5 times before making a permanent plan decision?',
      'What happens when 98% of rows have status "DELIVERED" and 0.1% have "PENDING"?',
      'Check plan_cache_mode setting.'
    ],
    followUp: {
      question:
        'What parameter allows developers to force PostgreSQL to always use generic plans or always use custom plans?',
      expectedAnswer:
        '`plan_cache_mode`. It accepts three values: `auto` (the default 5-run heuristic), `force_custom_plan` (always re-plans using the actual parameter values, eliminating skewed regressions at the cost of slight planning CPU), and `force_generic_plan` (never generates custom plans).'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Differentiates Custom vs Generic query plans',
        'Explains 5-execution heuristic evaluation mechanism',
        'Details how data distribution skew causes generic plan degradation',
        'Provides plan_cache_mode = force_custom_plan solution'
      ]
    }
  },
  {
    id: 'sql-tier4-015',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 15,
    title: 'High-Throughput TimescaleDB / Hypertable Architecture vs Native Partitioning',
    category: 'Partitioning and Large Tables',
    questionType: 'design',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'Your analytics ingestion pipeline processes 250,000 metrics per second into PostgreSQL. Native declarative partitioning by day creates 365 tables per year, but query planning overhead degrades, and compression is non-existent. The team evaluates TimescaleDB hypertables.',
    questionStatement:
      'Compare PostgreSQL native declarative partitioning with TimescaleDB hypertables for high-throughput time-series data. Evaluate automatic chunk creation, native columnar compression (hybrid row/column storage), continuous aggregates, and data retention policies.',
    referenceAnswer:
      '**1. Chunk Management & Write Throughput:**\n- **Native Partitioning**: Requires pre-creating child tables or using an external script/trigger. Planner overhead increases linearly with partition count, degrading query performance when hundreds of partitions exist.\n- **TimescaleDB Hypertables**: Automatically creates physical 2D chunks (time intervals + space/hash partitions) dynamically on-the-fly as data arrives. Keeps current chunk indexes small enough to fit 100% inside `shared_buffers`, maintaining flat write ingestion (>100k writes/sec) without performance drop-off.\n\n**2. Hybrid Columnar Compression:**\n- Native PostgreSQL only supports row-oriented storage with basic TOAST compression.\n- TimescaleDB converts historical closed chunks into a compressed **columnar format** on disk:\n  - Groups rows by segment key (e.g. `tenant_id`) and stores each column as an array compressed with specialized algorithms (Delta-of-delta for timestamps, Gorilla/XOR for floats, Run-Length Encoding for enums).\n  - Delivers **90-95% disk space reduction** and 10x-50x faster analytical scans because queries read only required columns.\n\n**3. Continuous Aggregates:**\n- Native PostgreSQL Materialized Views must be refreshed in full or require complex trigger rollups.\n- TimescaleDB Continuous Aggregates update automatically and incrementally in the background as new data arrives. When queried, TimescaleDB seamlessly combines historical aggregated chunks with unaggregated live raw data from the current chunk.\n\n**4. Data Retention:**\n- Dropping old chunks via `SELECT drop_chunks(\'1 year\'::interval);` is instantaneous metadata-only deletion with zero WAL write amplification.',
    expectedConcepts: [
      'Automatic chunk creation fitting working set in shared_buffers',
      'TimescaleDB columnar compression algorithms (Gorilla, Delta-of-delta)',
      '90%+ storage savings via chunk compression',
      'Incremental Continuous Aggregates combining raw and rolled-up data',
      'drop_chunks() zero-bloat automated retention policies'
    ],
    hints: [
      'What happens to native partition planning when you have 1,000 partitions?',
      'How does columnar compression reduce disk space for time-series floats and timestamps?',
      'Continuous aggregates do not require full refreshes.'
    ],
    followUp: {
      question:
        'Can compressed TimescaleDB chunks be updated or deleted using standard SQL `UPDATE` / `DELETE` statements?',
      expectedAnswer:
        'Historically, compressed chunks were strictly read-only. In modern TimescaleDB (v2.1+), PostgreSQL automatically decompresses the affected rows behind the scenes, executes the UPDATE or DELETE, and re-compresses them, though frequent updates to compressed chunks should still be avoided due to CPU overhead.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Contrasts automated chunking with manual native partitioning',
        'Explains columnar chunk compression and specialized algorithms',
        'Details continuous aggregates and real-time query aggregation',
        'Evaluates retention policy automation (drop_chunks)'
      ]
    }
  },
  {
    id: 'sql-tier4-016',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 16,
    title: 'Zero-Downtime Deduplication of 50 Million Records Under Live Write Load',
    category: 'Query Optimization',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Due to an idempotent webhook failure, duplicate payment records were inserted into `payments` for the same `order_id` and `transaction_ref`. You must delete all duplicate rows, keeping only the earliest record (`MIN(id)`), while thousands of concurrent orders continue inserting into the table.',
    questionStatement:
      'Write a chunked batch deduplication script using keyset ranges that identifies duplicate rows in `payments` by `(order_id, transaction_ref)` and deletes duplicates in small transactions (e.g. 5,000 IDs per iteration) to prevent locking the table or generating unmanageable WAL volume.',
    starterCode:
      '-- Chunked batch deduplication\nWITH duplicates_in_chunk AS (\n    SELECT id\n    FROM (\n        SELECT \n            id,\n            ROW_NUMBER() OVER (\n                PARTITION BY order_id, transaction_ref \n                ORDER BY id ASC\n            ) AS rn\n        FROM payments\n        WHERE id BETWEEN 1 AND 5000\n    ) ranked\n    WHERE rn > 1\n)\nDELETE FROM payments\nWHERE id IN (SELECT id FROM duplicates_in_chunk)\nRETURNING id;',
    sqlSolution:
      'WITH duplicates_in_chunk AS (\n    SELECT id\n    FROM (\n        SELECT \n            id,\n            ROW_NUMBER() OVER (\n                PARTITION BY order_id, transaction_ref \n                ORDER BY id ASC\n            ) AS rn\n        FROM payments\n        WHERE id BETWEEN 1 AND 5000\n    ) ranked\n    WHERE rn > 1\n)\nDELETE FROM payments\nWHERE id IN (SELECT id FROM duplicates_in_chunk)\nRETURNING id;',
    referenceAnswer:
      '**1. Why a Single `DELETE ... WHERE id NOT IN (SELECT MIN(id)...)` Fails in Production:**\n- Running a single DELETE query across millions of duplicate rows locks all affected table rows, holds an exclusive write lock for minutes, blocks incoming payments, causes autovacuum freeze delays, and generates tens of gigabytes of WAL in a single transaction, risking replication lag and out-of-disk crashes.\n\n**2. Production Chunked Keyset Deduplication Pattern:**\n```sql\n-- Executed in a loop by an external migration script with SLEEP(0.05) between batches\nWITH batch_duplicates AS (\n    SELECT id\n    FROM (\n        SELECT \n            id,\n            ROW_NUMBER() OVER (\n                PARTITION BY order_id, transaction_ref \n                ORDER BY id ASC\n            ) AS row_num\n        FROM payments\n        WHERE id >= :batch_start_id AND id < :batch_end_id\n    ) sub\n    WHERE row_num > 1\n)\nDELETE FROM payments\nWHERE id IN (SELECT id FROM batch_duplicates)\nRETURNING id;\n```\n\n**3. Locking Invariant Safeguard:**\nOnce all duplicates are purged, immediately enforce the invariant using a unique index built concurrently:\n```sql\nCREATE UNIQUE INDEX CONCURRENTLY idx_payments_order_txn_uniq \nON payments (order_id, transaction_ref);\n```',
    expectedConcepts: [
      'Why monolithic DELETE fails in production (locks, WAL explosion, replication lag)',
      'Chunked keyset pagination (id BETWEEN x AND y)',
      'ROW_NUMBER() window partitioning for duplicate identification',
      'Small batch transactions with sleep throttle',
      'CREATE UNIQUE INDEX CONCURRENTLY to prevent recurrence'
    ],
    hints: [
      'ROW_NUMBER() OVER (PARTITION BY order_id, transaction_ref ORDER BY id) identifies duplicates when row_num > 1.',
      'Why must the query be restricted to an ID range like WHERE id BETWEEN 1 AND 5000?',
      'Concurrently create a UNIQUE index after cleanup.'
    ],
    followUp: {
      question:
        'What risk exists if a duplicate pair spans across two different ID chunk boundaries (e.g. row 1 is ID 4,999 and row 2 is ID 5,001)?',
      expectedAnswer:
        'If partitioning by ID ranges, duplicates that span across chunk boundaries will not see each other and will not be deleted. To avoid this, either batch by hash of the natural key (`WHERE hashtext(order_id::text) % 100 = :batch_num`), or perform the batching by paging through distinct `order_id` values rather than surrogate `id` values.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Implements ROW_NUMBER() window ranking for duplicate detection',
        'Limits scope to chunked batches to prevent lock holding',
        'Explains WAL and replication lag risks of monolithic deletes',
        'Identifies cross-boundary duplicate edge case and proposes unique constraint'
      ]
    },
    testCases: [
      {
        id: 'tc-tier4-016-1',
        description: 'Verify chunked duplicate deletion keeping lowest ID',
        setupSql:
          'CREATE TABLE payments (id INT PRIMARY KEY, order_id INT, transaction_ref VARCHAR(20), amount NUMERIC);\nINSERT INTO payments VALUES (1, 101, \'TXN_A\', 100), (2, 101, \'TXN_A\', 100), (3, 102, \'TXN_B\', 200);',
        expectedRows: [
          { id: 2 }
        ],
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier4-017',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 17,
    title: 'Correlated Columns and Multi-Column Extended Statistics (CREATE STATISTICS)',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A query filtering `WHERE make = \'Audi\' AND model = \'R8\'` estimates that 1 row will match, but in reality 85,000 rows match. Because of this massive misestimation, PostgreSQL chooses a disastrous Nested Loop instead of a Hash Join, taking 45 seconds.',
    questionStatement:
      'Explain how PostgreSQL computes selectivity for multi-column WHERE clauses by default. Why does the conditional independence assumption fail for correlated data? How does `CREATE STATISTICS` (dependencies, ndistinct, mcv) resolve multi-column cardinality estimation errors?',
    referenceAnswer:
      '**1. Default Conditional Independence Assumption:**\n- PostgreSQL gathers single-column statistics in `pg_statistic` (accessible via `pg_stats`).\n- When a query filters by multiple columns (`WHERE colA = \'x\' AND colB = \'y\'`), PostgreSQL assumes the two columns are **statistically independent**.\n- It multiplies their independent selectivities:\n  $$P(A \\land B) = P(A) \\times P(B)$$\n- Example: If `make = \'Audi\'` is 1% ($0.01$) and `model = \'R8\'` is 0.01% ($0.0001$), PostgreSQL estimates selectivity as $0.01 \\times 0.0001 = 0.000001$ (1 row in a million).\n- In reality, all R8s are Audis! The true probability is correlated ($P(B|A) \\approx 1$), so the actual row count is 85,000 rows. A 85,000x error!\n\n**2. Resolution via Extended Statistics (`CREATE STATISTICS`):**\nPostgreSQL allows defining multi-column statistics objects:\n```sql\nCREATE STATISTICS stat_cars_make_model (dependencies, mcv)\nON make, model FROM cars;\n\nANALYZE cars;\n```\n\n**3. Types of Extended Statistics:**\n- **Functional Dependencies (`dependencies`)**: Measures how strongly one column determines another (degree of dependency from 0.0 to 1.0). Corrects selectivity when one column implies another.\n- **Most Common Values (`mcv`)**: Builds an N-dimensional multi-column frequency list of the most common combinations of values.\n- **Distinct Counts (`ndistinct`)**: Tracks true combined distinct count for `GROUP BY colA, colB` to eliminate memory spills in hash aggregations.',
    expectedConcepts: [
      'Conditional independence assumption: P(A and B) = P(A) * P(B)',
      'Severe underestimation on correlated attributes',
      'Planner picking nested loop due to 1-row estimation',
      'CREATE STATISTICS syntax with dependencies, mcv, and ndistinct',
      'Mandatory ANALYZE step to populate the statistics object'
    ],
    hints: [
      'Why does multiplying two probabilities underestimate matching rows when columns are correlated?',
      'What happens to join selection when the planner expects 1 row instead of 85,000?',
      'Check CREATE STATISTICS in PostgreSQL 10+.'
    ],
    followUp: {
      question:
        'Does `CREATE STATISTICS` automatically gather statistics immediately upon execution?',
      expectedAnswer:
        'No. `CREATE STATISTICS` merely registers the metadata intent in `pg_statistic_ext`. No data is sampled or analyzed until you explicitly run `ANALYZE <tablename>;`. Until `ANALYZE` is executed, the query planner will continue using the default independent probability model.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains mathematical multiplication of independent probabilities',
        'Details catastrophic consequences of cardinality misestimation on join choice',
        'Explains functional dependencies, MCV, and ndistinct extended stats',
        'Provides CREATE STATISTICS DDL and emphasizes mandatory ANALYZE'
      ]
    }
  },
  {
    id: 'sql-tier4-018',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 18,
    title: 'PostgreSQL Logical Decoding and Change Data Capture (CDC) Architecture',
    category: 'Backup, Recovery, and Replication',
    questionType: 'design',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Your architecture team must stream all real-time changes from `orders`, `payments`, and `customers` to Elasticsearch and Apache Kafka with sub-second latency. A developer proposes using polling queries (`WHERE updated_at > last_poll`).',
    questionStatement:
      'Critique the polling query anti-pattern for Change Data Capture (CDC). Detail how PostgreSQL Logical Decoding works using Write-Ahead Logs, logical replication slots, and `pgoutput` / Debezium. Explain `REPLICA IDENTITY` (DEFAULT vs FULL) and how hard DELETE events are captured.',
    referenceAnswer:
      '**1. Critique of Polling Queries (`WHERE updated_at > ?`):**\n- **Misses Deletes**: Hard `DELETE` operations leave no row behind to query.\n- **Database Load**: Frequent polling queries (e.g. every 500ms) thrash indexes and buffer pool caches.\n- **Clock Skew & In-Flight Transactions**: A transaction that began at 12:00:00 but committed at 12:00:05 might be skipped if the polling script queried at 12:00:01.\n\n**2. PostgreSQL Logical Decoding Architecture:**\n- PostgreSQL reads committed mutations directly from the Write-Ahead Log (**WAL**), bypassing SQL querying entirely.\n- A **logical replication slot** tracks the exact LSN progress of the consumer.\n- The output plugin (e.g. `pgoutput` or `test_decoding`) decodes internal WAL binary into structured row change events (Insert, Update, Delete) with old/new column values.\n- Tools like **Debezium** stream these events directly to Kafka topics with sub-millisecond latency and zero query overhead on PostgreSQL.\n\n**3. REPLICA IDENTITY Configuration:**\n- When a row is updated or deleted, CDC consumers need to identify the exact row that changed.\n- **`REPLICA IDENTITY DEFAULT`**: WAL records only the old PRIMARY KEY for UPDATE and DELETE operations. Highly efficient.\n- **`REPLICA IDENTITY FULL`**: WAL records the **entire old row image** prior to update/delete. Mandatory if a table lacks a primary key, but significantly increases WAL volume.',
    expectedConcepts: [
      'Shortcomings of polling queries (missed deletes, transaction race conditions, I/O load)',
      'WAL-based logical decoding streaming committed transactions',
      'Logical replication slots and LSN offset tracking',
      'Debezium + Kafka event streaming integration',
      'REPLICA IDENTITY DEFAULT (PK only) vs FULL (complete old row)'
    ],
    hints: [
      'Can a polling query detect hard DELETE statements without soft-delete flags?',
      'Where does PostgreSQL write all committed transactions before modifying disk pages?',
      'What does REPLICA IDENTITY FULL record in WAL during an UPDATE?'
    ],
    followUp: {
      question:
        'What disaster occurs if the downstream Debezium connector disconnects for 48 hours while the logical replication slot remains active?',
      expectedAnswer:
        'Because the logical replication slot is active, PostgreSQL guarantees not to remove any WAL files generated after the slot’s restart LSN. If writes continue on the primary, hundreds of gigabytes of WAL will accumulate in `pg_wal`, threatening disk exhaustion unless `max_slot_wal_keep_size` is configured.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Itemizes reasons why polling updated_at fails for reliable CDC',
        'Details WAL reading, logical decoding plugins, and replication slots',
        'Explains Debezium and Kafka streaming integration',
        'Differentiates REPLICA IDENTITY DEFAULT from FULL'
      ]
    }
  },
  {
    id: 'sql-tier4-019',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 19,
    title: 'High-Performance Unlogged Tables vs Temp Tables for Ephemeral Staging',
    category: 'PostgreSQL Data Types',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A nightly ETL pipeline loads 20 million raw records from S3, parses and transforms them, and aggregates summary statistics. Using standard tables takes 25 minutes due to massive WAL disk I/O. Using `CREATE TEMP TABLE` causes connection bloat.',
    questionStatement:
      'Compare PostgreSQL `UNLOGGED` tables with Temporary tables (`TEMP TABLE`) and Standard logged tables. How do unlogged tables bypass the Write-Ahead Log (WAL)? What happens to unlogged tables during a server crash or on a streaming read-replica?',
    referenceAnswer:
      '**1. What Unlogged Tables Do:**\n- Created via `CREATE UNLOGGED TABLE staging_orders (...);`.\n- **Bypasses WAL Completely**: Writes to unlogged tables never write WAL records. This eliminates disk write amplification, WAL flushing sync bottlenecks, and checkpoint pressure, speeding up bulk inserts by **3x to 10x**.\n\n**2. Crash Recovery & Durability Semantics:**\n- Because there is no WAL to replay after an unclean shutdown, PostgreSQL cannot guarantee data consistency for unlogged tables.\n- Upon crash recovery restart, PostgreSQL **automatically truncates all UNLOGGED tables to 0 rows** (recreating an empty table file using the init fork `_init`).\n- Data is durable across clean server restarts, but wiped on power failure or crash.\n\n**3. Streaming Replication Behavior:**\n- Because read-replicas are synchronized exclusively by replaying WAL streams, **UNLOGGED tables do not replicate to standby nodes**.\n- On replicas, unlogged tables appear permanently empty or inaccessible.\n\n**4. Comparison with TEMP Tables:**\n- `TEMP TABLE`: Session-scoped, visible only to the creating connection, dropped when session closes. Stored in special `pg_temp` schemas. Causes catalog churn if created repeatedly in connection pools.\n- `UNLOGGED TABLE`: Cluster-wide, visible to all concurrent connections and processes, permanent schema definition, but ephemeral data.',
    expectedConcepts: [
      'Bypassing Write-Ahead Logging for maximum write speed',
      'Automatic truncation to empty table upon crash recovery restart',
      'Initialization fork (_init) mechanism',
      'Non-replication to streaming read standbys',
      'Cluster-wide visibility vs session-scoped TEMP tables'
    ],
    hints: [
      'Why are unlogged tables 5x faster on bulk inserts?',
      'What happens to data in an unlogged table if someone pulls the server power plug?',
      'Do unlogged tables exist on read replicas?'
    ],
    followUp: {
      question:
        'Can an UNLOGGED table be altered to a regular logged table once the bulk load finishes, and what lock does that require?',
      expectedAnswer:
        'Yes, using `ALTER TABLE staging_orders SET LOGGED;`. This command forces PostgreSQL to write all existing table pages into the WAL so that the table becomes durable and replicates to standbys. It acquires an `ACCESS EXCLUSIVE` lock on the table for the duration of the WAL write.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains WAL bypass and write acceleration',
        'Details crash recovery truncation behavior and init fork',
        'Identifies replication absence on streaming standbys',
        'Contrasts multi-connection visibility against session temp tables'
      ]
    }
  },
  {
    id: 'sql-tier4-020',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 20,
    title: 'Database Security Hardening: SCRAM-SHA-256, Connection Quotas, and pgaudit',
    category: 'Database Security and Permissions',
    questionType: 'design',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'Your fintech application must pass a SOC2 Type II security audit and PCI-DSS compliance. The security auditor identifies legacy MD5 password hashing, unrestricted connection counts per user, and lack of fine-grained DDL audit logging.',
    questionStatement:
      'Design a production-grade database security hardening blueprint for PostgreSQL. Explain the migration from `md5` to `scram-sha-256`, connection limits per role (`CONNECTION LIMIT`), schema isolation, and the implementation of the `pgaudit` extension for compliance logging.',
    referenceAnswer:
      '**1. SCRAM-SHA-256 vs Legacy MD5:**\n- `md5` authentication in PostgreSQL is vulnerable to dictionary attacks and rainbow tables because the stored hash is merely `md5(password + username)`.\n- `scram-sha-256` (RFC 7677) uses cryptographic salt, PBKDF2 key stretching (4096 iterations), and mutual client-server authentication without sending passwords over the wire.\n- **Migration Steps**:\n  1. Set `password_encryption = \'scram-sha-256\'` in `postgresql.conf`.\n  2. Reset all database user passwords: `ALTER USER app_user WITH PASSWORD \'new_secret\';` to generate SCRAM verifier strings.\n  3. Update `pg_hba.conf` authentication method to `scram-sha-256`.\n\n**2. Connection Limits & DoS Prevention:**\nPrevent a misconfigured service pod from exhausting the database connection pool:\n```sql\nALTER ROLE app_user CONNECTION LIMIT 50;\nALTER ROLE analytics_worker CONNECTION LIMIT 5;\n```\n\n**3. Schema Isolation Principle of Least Privilege:**\n```sql\nREVOKE CREATE ON SCHEMA public FROM PUBLIC;\nCREATE SCHEMA app AUTHORIZATION app_owner;\nGRANT USAGE ON SCHEMA app TO app_user;\nGRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_user;\nALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;\n```\n\n**4. Compliance Auditing with `pgaudit`:**\n- Add `pgaudit` to `shared_preload_libraries`.\n- Configure audit categories in `postgresql.conf`:\n  `pgaudit.log = \'ROLE, DDL, MISC\'`\n  `pgaudit.log_catalog = off`\n  `pgaudit.log_parameter = on` (records parameterized values for forensic analysis).\n- Writes structured audit records to PostgreSQL syslog/journald for SIEM ingestion.',
    expectedConcepts: [
      'SCRAM-SHA-256 PBKDF2 salting vs MD5 rainbow table vulnerability',
      'password_encryption setting and pg_hba.conf enforcement',
      'ALTER ROLE ... CONNECTION LIMIT for connection starvation defense',
      'Least privilege schema permissions and ALTER DEFAULT PRIVILEGES',
      'pgaudit extension configuration for DDL, ROLE, and parameter logging'
    ],
    hints: [
      'Why is MD5 vulnerable even if TLS is used on the wire?',
      'How does ALTER DEFAULT PRIVILEGES protect future tables created in the schema?',
      'Check pgaudit.log configuration options.'
    ],
    followUp: {
      question:
        'Why should `pgaudit.log = \'READ\'` be used with extreme caution on production databases?',
      expectedAnswer:
        '`pgaudit.log = \'READ\'` logs every single `SELECT` statement and rows scanned across the entire database. On high-throughput production systems, this generates gigabytes of logs per minute, saturating disk I/O, filling log volumes, and drastically increasing query latency.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Outlines end-to-end SCRAM-SHA-256 migration procedure',
        'Configures CONNECTION LIMIT per role to prevent pool starvation',
        'Implements least privilege schema security and default privileges',
        'Details pgaudit extension parameters and logging categories'
      ]
    }
  },
  {
    id: 'sql-tier4-021',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 21,
    title: 'Production Incident: Statement Timeout vs Lock Timeout Cascading Outage',
    category: 'Locks and Deadlocks',
    questionType: 'incident',
    datasetId: 'ecommerce',
    realWorldScenario:
      'To prevent slow queries from hanging the database, an engineer set `statement_timeout = \'5s\'` globally. Later, a background migration ran `ALTER TABLE orders ADD COLUMN flags INT;`. The DDL failed after 5 seconds, but during those 5 seconds, the entire payment API experienced an outage.',
    questionStatement:
      'Explain how PostgreSQL lock queues work and why a waiting DDL statement holding an `ACCESS EXCLUSIVE` lock request blocks all subsequent read and write queries. Why did `statement_timeout` fail to prevent the outage, and how does `lock_timeout` eliminate cascading lock pileups?',
    incidentDetails: {
      symptoms: [
        '5-second complete payment API freeze',
        'Hundreds of client HTTP requests timed out',
        'DDL command aborted with statement timeout',
        'Normal fast 2ms SELECT queries queued up and failed'
      ],
      systemTelemetry: {
        activeConnections: 350,
        lockWaitsCount: 280,
        cpuUtilizationPercent: 35,
        bufferCacheHitRatio: 99.5,
        logSnippet:
          '2026-11-01 16:00:05 UTC [8902]: [1-1] ERROR:  canceling statement due to statement timeout\n' +
          '2026-11-01 16:00:05 UTC [8902]: [2-1] STATEMENT:  ALTER TABLE orders ADD COLUMN flags INT;\n' +
          '2026-11-01 16:00:05 UTC [8915]: [1-1] LOG:  process 8915 still waiting for AccessShareLock on relation "orders" after 4890 ms'
      },
      candidateTasks: [
        'Explain why lock requests form a FIFO queue where exclusive locks block subsequent reads',
        'Contrast statement_timeout with lock_timeout',
        'Demonstrate the safe DDL execution pattern using lock_timeout and retry loops',
        'Configure idle_in_transaction_session_timeout'
      ]
    },
    referenceAnswer:
      '**1. The Lock Queue Pileup Phenomenon (FIFO Queuing):**\n- When `ALTER TABLE` runs, it requests an `ACCESS EXCLUSIVE` lock on `orders`.\n- If any concurrent read (`SELECT`) query is currently active, the DDL cannot acquire the lock immediately and sits in the lock queue waiting.\n- **The Critical Trap**: While the DDL is waiting in the queue, **all subsequent incoming queries (`SELECT`, `INSERT`, `UPDATE`) queue behind the waiting DDL**, even though they only need `AccessShareLock`!\n- PostgreSQL does this intentionally to prevent exclusive locks from being starved indefinitely by a constant stream of reads. However, it means a waiting DDL halts all traffic to the table.\n\n**2. Why `statement_timeout` Failed:**\n- With `statement_timeout = 5s`, the DDL queued for 5 full seconds before timing out.\n- During those 5 seconds, every incoming checkout and payment query queued behind it, piling up until connection pools were exhausted and clients timed out.\n\n**3. The Solution: `lock_timeout`:**\n- `lock_timeout` controls how long a statement will wait to **acquire a lock** before aborting, independent of execution time.\n- **Safe Zero-Downtime DDL Pattern**:\n```sql\n-- Set a tiny lock timeout (e.g. 500ms)\nSET lock_timeout = \'500ms\';\n\n-- Attempt DDL; if lock cannot be acquired within 500ms, abort immediately rather than blocking traffic\nALTER TABLE orders ADD COLUMN flags INT;\n```\nIf it fails due to lock contention, the application script sleeps with random jitter and retries, ensuring production reads and writes are never blocked for more than 500 milliseconds.',
    expectedConcepts: [
      'FIFO lock queue mechanics and exclusive lock blocking subsequent reads',
      'Difference between statement_timeout (execution + lock) and lock_timeout (lock wait only)',
      'Why waiting DDL starves all incoming traffic',
      'Safe DDL pattern setting lock_timeout = 500ms with retry loops',
      'Preventing API connection exhaustion during schema maintenance'
    ],
    hints: [
      'Why do new SELECT queries wait behind a waiting ALTER TABLE in PostgreSQL?',
      'statement_timeout includes time spent waiting for locks.',
      'What happens if lock_timeout is set to 200 milliseconds?'
    ],
    followUp: {
      question:
        'What is the difference between `lock_timeout`, `statement_timeout`, and `idle_in_transaction_session_timeout`?',
      expectedAnswer:
        '`lock_timeout` limits how long a query waits to acquire any lock. `statement_timeout` limits total wall-clock query duration (lock wait time + actual execution time). `idle_in_transaction_session_timeout` limits how long a connection can sit idle after opening a transaction (`BEGIN`) without issuing another query, preventing abandoned transactions from pinning locks and the xmin horizon.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains FIFO lock queueing and why waiting exclusive lock blocks reads',
        'Differentiates statement_timeout from lock_timeout',
        'Provides safe DDL script with SET lock_timeout = \'500ms\'',
        'Itemizes the three timeouts and their specific scopes'
      ]
    }
  },
  {
    id: 'sql-tier4-022',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 22,
    title: 'High-Availability Failover Architectures: Patroni, Raft Quorum, and Split-Brain Defense',
    category: 'Backup, Recovery, and Replication',
    questionType: 'design',
    datasetId: 'ecommerce',
    realWorldScenario:
      'During a network partition between AWS Availability Zones, an automated failover script promoted the read-replica to primary. However, the original primary was still alive and accepting writes from half the Kubernetes pods, resulting in catastrophic split-brain data corruption.',
    questionStatement:
      'Design a resilient High-Availability (HA) architecture for PostgreSQL using Patroni and a Distributed Consensus Store (DCS) such as etcd or Consul. Explain Raft consensus quorum, leader leases, fencing mechanisms (STONITH / Watchdog), and how synchronous replication with quorum commit prevents data divergence.',
    referenceAnswer:
      '**1. Split-Brain Disaster Anatomy:**\n- Split-brain occurs when two nodes simultaneously believe they are the write primary.\n- Clients write Order #101 to Node A, and Order #102 to Node B. Because both nodes assign conflicting sequence IDs and transaction logs diverge, merging the two databases without loss is mathematically and physically impossible.\n\n**2. Patroni + DCS (etcd) Architecture:**\n- **Consensus Quorum**: A 3-node or 5-node `etcd` cluster requires a strict majority ($N/2 + 1$) to elect a leader and maintain state. In a network partition, only the partition with a majority can elect or maintain a leader.\n- **Leader Lease Key**: The primary Patroni node acquires a temporary lease key in etcd (e.g. TTL 10 seconds) with continuous heartbeats. If the primary loses contact with etcd for 10 seconds, its lease expires automatically.\n- **Safe Failover**: The standby node in the majority partition sees the expired lease, checks WAL replay LSN to ensure it has the latest data, and promotes itself to the new primary.\n\n**3. Fencing Mechanisms (Preventing Zombie Primaries):**\n- **Linux Software Watchdog**: Patroni arms the kernel watchdog device (`/dev/watchdog`) every 5 seconds. If Patroni loses contact with DCS or hangs, the watchdog times out and the hardware/kernel immediately forces a hard reset (reboot) of the old primary, guaranteeing it cannot accept rogue writes.\n- **STONITH** ("Shoot The Other Node In The Head"): Power-switch fencing via IPMI/cloud API.\n\n**4. Synchronous Replication (`synchronous_commit = \'on\'`):**\n- Configured via `synchronous_standby_names = \'FIRST 1 (node2, node3)\'`.\n- Transactions on the primary do not commit until at least one synchronous standby has written the WAL to disk, guaranteeing Zero Data Loss (RPO = 0).',
    expectedConcepts: [
      'Split-brain diverging transaction logs and data corruption',
      'etcd/Consul Raft consensus majority quorum (N/2 + 1)',
      'Patroni leader lease TTL and automated promotion',
      'Linux Watchdog / STONITH fencing killing zombie primary',
      'Synchronous replication (synchronous_commit, synchronous_standby_names)'
    ],
    hints: [
      'Why is merging two divergent PostgreSQL primaries impossible after split-brain?',
      'What does a Linux watchdog do if Patroni fails to refresh its DCS lease?',
      'How does Raft majority quorum prevent two nodes from both acquiring the leader lease?'
    ],
    followUp: {
      question:
        'What is `pg_rewind`, and how does Patroni use it when an old fenced primary is powered back on after failover?',
      expectedAnswer:
        '`pg_rewind` is a tool that identifies the exact point where an old primary\'s WAL diverged from the newly promoted primary, rewinds the old primary\'s data directory back to that common ancestor checkpoint, and copies only the changed blocks from the new primary, allowing the old primary to rejoin the cluster as a standby replica without re-cloning hundreds of gigabytes from scratch.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains split-brain root cause and impossibility of reconciliation',
        'Details etcd Raft consensus majority and leader lease TTL',
        'Explains Linux watchdog / STONITH fencing mechanics',
        'Explains pg_rewind for safe cluster rejoining without full re-cloning'
      ]
    }
  },
  {
    id: 'sql-tier4-023',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 23,
    title: 'Heap-Only Tuple (HOT) Optimization Failures and Write Amplification',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'An application updates a `last_seen_at` timestamp on `users` on every API request. Although the table only has 1 million rows, disk write I/O is 80 MB/sec and index size is growing by 5 GB per day. Telemetry shows HOT update ratio is 0%.',
    questionStatement:
      'Explain PostgreSQL Heap-Only Tuple (HOT) optimization. What are the two mandatory conditions required for an UPDATE to qualify as a HOT update? Why does indexing `last_seen_at` completely disable HOT updates, causing massive write amplification and index bloat?',
    referenceAnswer:
      '**1. How Heap-Only Tuple (HOT) Works:**\n- Normally, every `UPDATE` creates a new tuple version in the heap table AND inserts a new `(key, ctid)` entry into **every single index on the table**, even if the indexed columns were not modified!\n- **HOT Optimization**: If an UPDATE satisfies two conditions, PostgreSQL avoids touching any index files:\n  1. The new tuple version is placed in the **exact same 8KB heap page** as the old tuple.\n  2. **None of the columns modified by the UPDATE are covered by any index** on the table.\n- Under HOT, the old tuple’s pointer is updated to point directly to the new tuple version within the same 8KB page. Root index pointers continue pointing to the old tuple, and index scans follow the intra-page tuple chain transparently.\n\n**2. Why Indexing `last_seen_at` Disabled HOT:**\n- Because `last_seen_at` was indexed, every update to that column **violates condition 2**.\n- Every update forces PostgreSQL to insert a new entry into the `last_seen_at` index, plus new entries into all other B-tree indexes if intra-page chaining cannot be used.\n- This causes 10x-50x write amplification: a single 50-byte column change writes to 4 different 8KB index pages and generates heavy WAL.\n\n**3. Diagnostic Query:**\n```sql\nSELECT \n    relname,\n    n_tup_upd,\n    n_tup_hot_upd,\n    round((100.0 * n_tup_hot_upd / nullif(n_tup_upd, 0))::numeric, 2) AS hot_update_pct\nFROM pg_stat_user_tables\nWHERE relname = \'users\';\n```\n\n**4. Remediation:**\n- Drop the index on `last_seen_at` if not strictly required for queries, or use Redis/memcached to buffer timestamp updates and flush to Postgres in 15-minute batches.\n- Set `WITH (fillfactor = 70)` on the table so pages retain free space for HOT updates.',
    expectedConcepts: [
      'Heap-Only Tuple (HOT) intra-page tuple forwarding',
      'Condition 1: Free space in same 8KB page (fillfactor)',
      'Condition 2: No modified column belongs to any index',
      'Write amplification across all table indexes when HOT fails',
      'pg_stat_user_tables hot_update_pct metric'
    ],
    hints: [
      'What must be true about the columns being updated for HOT to work?',
      'Where must the new row version fit for HOT optimization?',
      'Check pg_stat_user_tables n_tup_hot_upd.'
    ],
    followUp: {
      question:
        'If an UPDATE modifies a column that is part of a Partial Index, but the old and new row values do NOT satisfy the partial index predicate, can the update still be HOT-eligible?',
      expectedAnswer:
        'Yes! Starting in PostgreSQL 11, if an index is partial and the updated column is only in that partial index, PostgreSQL allows a HOT update as long as neither the old nor new row version satisfies the partial index predicate (because the index does not need to be updated).'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains the two strict requirements for HOT updates',
        'Details how indexing an updated column destroys HOT eligibility',
        'Explains write amplification across untouched indexes',
        'Provides pg_stat_user_tables diagnostic query and fillfactor remediation'
      ]
    }
  },
  {
    id: 'sql-tier4-024',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 24,
    title: 'PostgreSQL Memory Hierarchy: Shared Buffers, OS Page Cache, and Double Buffering',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A sysadmin allocates 60 GB of a 64 GB RAM server to PostgreSQL `shared_buffers`. Performance immediately degrades by 40%, and disk read latency spikes.',
    questionStatement:
      'Explain the relationship between PostgreSQL `shared_buffers` and the Linux OS Kernel Page Cache. What is the "Double Buffering" architecture? Why is setting `shared_buffers` to 25% of RAM (16 GB on 64 GB) recommended, and how does `effective_cache_size` guide the query planner?',
    referenceAnswer:
      '**1. Double Buffering Architecture:**\n- PostgreSQL uses standard POSIX `read()` and `write()` system calls (buffered I/O), not `O_DIRECT`.\n- When Postgres reads an 8KB page from disk, the Linux kernel first reads it into the **OS Page Cache**.\n- PostgreSQL then copies the page into its own internal memory pool: **`shared_buffers`**.\n- Thus, active pages often reside in both memory locations simultaneously ("Double Buffering").\n\n**2. Why 60 GB `shared_buffers` Degraded Performance:**\n- Setting `shared_buffers` to 60 GB leaves only 4 GB for the OS kernel, backend process memory (`work_mem`, `maintenance_work_mem`), and connection stack overhead.\n- PostgreSQL’s clock-sweep buffer eviction algorithm is simpler than the Linux kernel’s sophisticated multi-generational LRU page cache.\n- Writing dirty pages from `shared_buffers` requires syncing through kernel memory. With no kernel RAM left, disk write queuing stalls.\n- When backend processes allocate `work_mem` for queries, the OS runs out of memory and starts swapping to disk or invokes the OOM killer.\n\n**3. The 25% Rule & `effective_cache_size`:**\n- **`shared_buffers`**: Recommended at **25% of total system RAM** (e.g. 16 GB). This provides ample dedicated memory for frequently accessed hot pages while leaving 75% for the OS page cache and query execution.\n- **`effective_cache_size`**: Set to **70-75% of total RAM** (e.g. 48 GB). **It does not allocate any memory!** It is purely an informational advisory hint to the query planner, estimating the total memory available for caching data (shared_buffers + OS page cache). A higher value encourages the planner to choose Index Scans over Seq Scans because it assumes index pages are already cached in RAM.',
    expectedConcepts: [
      'Buffered I/O via POSIX read/write and Linux Page Cache',
      'Double buffering: page residing in both shared_buffers and kernel cache',
      'Why 60GB shared_buffers starves OS page cache and causes swapping',
      '25% rule for shared_buffers',
      'effective_cache_size as an informational planner cost hint (not memory allocation)'
    ],
    hints: [
      'Does PostgreSQL use direct I/O (O_DIRECT) or buffered I/O by default?',
      'Does setting effective_cache_size allocate physical RAM?',
      'Why does PostgreSQL rely heavily on the Linux OS page cache?'
    ],
    followUp: {
      question:
        'What official PostgreSQL extension allows inspection of the exact contents currently cached inside `shared_buffers` in real-time?',
      expectedAnswer:
        'The `pg_buffercache` extension. It provides the view `pg_buffercache` which details every 8KB buffer block, showing which database, relation, and block number is cached, and whether the page is dirty or pinned.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 20,
      performanceWeight: 30,
      edgeCaseWeight: 15,
      criteria: [
        'Explains double buffering between shared_buffers and OS page cache',
        'Details negative consequences of oversized shared_buffers (swapping, OOM)',
        'Justifies the 25% RAM rule for shared_buffers',
        'Clarifies that effective_cache_size is a planner estimation hint, not allocation'
      ]
    }
  },
  {
    id: 'sql-tier4-025',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 25,
    title: 'PostgreSQL Advisory Locks for Queue Worker Deadlock Prevention',
    category: 'Locks and Deadlocks',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A multi-node payment capture service processes refunds. When a refund arrives, it must lock the customer record to update their ledger balance. Two concurrent refund requests for the same customer deadlock against each other because each transaction locks `payments` first, then attempts to lock `customers`.',
    questionStatement:
      'Implement a distributed mutual-exclusion lock using PostgreSQL 64-bit transaction advisory locks (`pg_advisory_xact_lock`) against the customer ID before acquiring row locks. Explain why this completely eliminates deadlocks, and write the query acquiring the lock and executing the ledger deduction.',
    starterCode:
      '-- Concurrency-safe payment capture with transaction advisory lock\n-- Parameters: customer_id = 42, refund_amount = 50.00\nBEGIN;\n\n-- 1. Acquire transaction-level advisory lock on customer ID to serialize customer operations\nSELECT pg_advisory_xact_lock(42);\n\n-- 2. Safely deduct balance without risk of deadlocks with other transactions\nUPDATE customers\nSET balance = balance - 50.00\nWHERE id = 42\nRETURNING id, balance;\n\nCOMMIT;',
    sqlSolution:
      'SELECT pg_advisory_xact_lock(42);\nUPDATE customers\nSET balance = balance - 50.00\nWHERE id = 42\nRETURNING id, balance;',
    referenceAnswer:
      '**1. Why Deadlocks Occurred:**\n- Transaction A updates `payments` for Order 1, then attempts to lock `customers` for Customer 42.\n- Transaction B updates `payments` for Order 2, then attempts to lock `customers` for Customer 42.\n- If both transactions acquire locks on different payment rows simultaneously and then both request exclusive locks on the same customer row, or if reverse ordering occurs, a deadlock occurs.\n\n**2. Resolution via Transaction Advisory Locks:**\n```sql\nBEGIN;\n-- Acquire advisory lock on the Customer entity ID at the start of the transaction\nSELECT pg_advisory_xact_lock(p_customer_id);\n\n-- All operations for Customer 42 across all endpoints are now serialized\nUPDATE customers\nSET balance = balance - p_refund_amount\nWHERE id = p_customer_id;\n\nUPDATE payments\nSET status = \'REFUNDED\'\nWHERE id = p_payment_id;\n\nCOMMIT; -- Advisory lock automatically released\n```\nBecause any transaction touching Customer 42 acquires the advisory lock before touching any table rows, multiple transactions for the same customer queue orderly in memory, eliminating all circular wait conditions.',
    expectedConcepts: [
      'Deadlock root cause: non-deterministic lock acquisition order across tables',
      'pg_advisory_xact_lock establishing mutual exclusion before table access',
      'Serialization of concurrent customer operations in shared memory',
      'Automatic lock release at COMMIT/ROLLBACK boundary'
    ],
    hints: [
      'By acquiring the advisory lock first, any concurrent transaction for the same customer waits before touching tables.',
      'Transaction-level locks release on COMMIT or ROLLBACK automatically.'
    ],
    followUp: {
      question:
        'What is the performance advantage of using `pg_advisory_xact_lock(customer_id)` over `SELECT id FROM customers WHERE id = 42 FOR UPDATE`?',
      expectedAnswer:
        '`SELECT FOR UPDATE` requires reading the heap page, writing the transaction ID into the row\'s `xmax` header, generating WAL, and dirtying the 8KB page in `shared_buffers`. In contrast, `pg_advisory_xact_lock` executes 100% in server RAM in the shared memory lock table with zero disk reads, zero disk writes, zero WAL, and zero tuple bloat.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Explains deadlock elimination via serialized entity locking',
        'Uses pg_advisory_xact_lock with integer ID',
        'Contrasts advisory lock memory efficiency with row-level locks',
        'Demonstrates clean transaction lifecycle'
      ]
    },
    testCases: [
      {
        id: 'tc-tier4-025-1',
        description: 'Verify balance deduction under transaction lock simulation',
        setupSql:
          'CREATE TABLE customers (id INT PRIMARY KEY, balance NUMERIC);\nINSERT INTO customers VALUES (42, 500.00);',
        expectedRows: [
          { id: 42, balance: 450.00 }
        ],
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier4-026',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 26,
    title: 'Production Incident: Replica WAL Replay Lag Induced by Long Standby Queries',
    category: 'Backup, Recovery, and Replication',
    questionType: 'incident',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A data science team connects to the production read-replica and runs a heavy analytics query that scans historical data for 45 minutes. Minutes later, the replica lag increases by 35 GB, and other operational read queries on the replica return stale data.',
    questionStatement:
      'Explain how queries on a physical streaming read-replica can pause WAL replay. Analyze the interaction between `hot_standby_feedback`, `max_standby_streaming_delay`, and `max_standby_archive_delay`. How do you protect replicas from analytical query disruption?',
    incidentDetails: {
      symptoms: [
        'Streaming replication replay lag grows to 35 GB',
        'Replica serves increasingly stale data to customer-facing queries',
        'Data science query running on standby for 45 minutes',
        'Primary database forced to hold back WAL deletions'
      ],
      systemTelemetry: {
        activeConnections: 55,
        replicationLagBytes: 37580963840, // ~35 GB
        cpuUtilizationPercent: 78,
        bufferCacheHitRatio: 98.6,
        logSnippet:
          '2026-11-01 17:15:00 UTC [108]: [1-1] LOG:  recovery process is waiting for ExclusiveLock on relation 16402\n' +
          '2026-11-01 17:15:00 UTC [108]: [2-1] DETAIL:  Process 4891 is running query: SELECT date_trunc(\'month\', created_at), sum(total_amount) FROM orders GROUP BY 1 ...'
      },
      candidateTasks: [
        'Explain why WAL replay requires ExclusiveLock to clean dead tuples',
        'Analyze max_standby_streaming_delay behavior',
        'Evaluate hot_standby_feedback pros and cons',
        'Recommend architectural isolation: dedicated analytical replica or logical replication ETL'
      ]
    },
    referenceAnswer:
      '**1. Why Standby WAL Replay Pauses:**\n- On the primary, VACUUM removes dead tuples and logs these cleanup actions into WAL.\n- When the streaming replica replays this WAL, it must remove those exact same physical tuples from its local disk pages. To do so, the recovery process requires exclusive access to those pages.\n- If a long-running read query on the standby is reading those pages, a **recovery conflict** occurs.\n- PostgreSQL halts WAL replay on the standby for up to `max_standby_streaming_delay` (default 30 seconds) to allow the read query to finish.\n- If `max_standby_streaming_delay = -1` or is set to hours, **WAL replay stops completely**, causing replication lag to accumulate indefinitely!\n\n**2. Resolution & Configuration Tuning:**\n- **Strict Delay Timeout**: Keep `max_standby_streaming_delay = 30s` (or `60s`). If a query conflicts for longer than 30 seconds, PostgreSQL cancels the query with `canceling statement due to conflict with recovery`, protecting the replica from falling behind.\n- **`hot_standby_feedback = on`**: The standby sends its oldest transaction snapshot back to the primary. The primary\'s VACUUM will delay removing dead tuples that the standby is reading. *Warning*: This prevents recovery conflicts on the standby, but can cause severe table bloat on the **primary** if standby queries run for hours!\n\n**3. Production Architecture Best Practice:**\n- Never mix short-lived OLTP read queries and long-running OLAP queries on the same standby.\n- Provision a **dedicated analytical replica** configured with `hot_standby_feedback = on` and `max_standby_streaming_delay = 1h`, isolated from the customer-facing OLTP read replica pool.',
    expectedConcepts: [
      'Recovery conflict caused by WAL replay needing to remove tuples read by standby queries',
      'max_standby_streaming_delay timeout behavior',
      'hot_standby_feedback propagating snapshot to primary to delay vacuum',
      'Risk of primary table bloat when hot_standby_feedback is enabled',
      'Architectural segregation: separate OLTP and OLAP read replicas'
    ],
    hints: [
      'What happens when WAL replay wants to delete a page version that an analytics query is reading?',
      'If max_standby_streaming_delay expires, what happens to the analytics query?',
      'Why can hot_standby_feedback cause bloat on the primary database?'
    ],
    followUp: {
      question:
        'What query can an SRE run on the replica to check how much time is remaining before a conflicting statement is terminated by `max_standby_streaming_delay`?',
      expectedAnswer:
        'In PostgreSQL 14+, the view `pg_stat_database_conflicts` tracks the number of conflicts per database (`confl_tablespace`, `confl_lock`, `confl_snapshot`, `confl_bufferpin`, `confl_deadlock`). Inspecting `pg_stat_activity` on the replica shows the query start time, allowing the operator to calculate remaining time against `max_standby_streaming_delay`.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains why WAL replay conflicts with long-running standby reads',
        'Details max_standby_streaming_delay query cancellation',
        'Explains hot_standby_feedback and trade-off with primary bloat',
        'Recommends dedicated analytical replica tiering'
      ]
    }
  },
  {
    id: 'sql-tier4-027',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 27,
    title: 'Keyset Pagination vs Deep OFFSET: Eliminating O(N) Query Degradation',
    category: 'Query Optimization',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A public product listing API allows customers to paginate through 1,000,000 products. Page 1 (`OFFSET 0 LIMIT 20`) loads in 1ms. Page 20,000 (`OFFSET 400000 LIMIT 20`) takes 8.5 seconds and causes severe database disk reads.',
    questionStatement:
      'Explain why SQL `OFFSET` scales with $O(N)$ time complexity. Write an optimized keyset pagination query (seek method) using a composite cursor `(created_at, id)` that executes in $O(1)$ constant time regardless of page depth, and demonstrate the required composite B-tree index.',
    starterCode:
      '-- Optimized keyset pagination query (Page 2+ using composite cursor)\n-- Cursor from previous page: last_created_at = \'2026-01-03\', last_id = 3\nSELECT \n    id,\n    name,\n    price,\n    created_at\nFROM products\nWHERE (created_at, id) < (\'2026-01-03\', 3)\nORDER BY created_at DESC, id DESC\nLIMIT 20;',
    sqlSolution:
      'SELECT \n    id,\n    name,\n    price,\n    created_at\nFROM products\nWHERE (created_at, id) < (\'2026-01-03\', 3)\nORDER BY created_at DESC, id DESC\nLIMIT 20;',
    referenceAnswer:
      '**1. Why OFFSET Scales at $O(N)$:**\n- When you run `SELECT * FROM products ORDER BY created_at DESC LIMIT 20 OFFSET 400000;`, PostgreSQL cannot magically jump to row 400,001.\n- The database must scan through all 400,000 rows, sort them in memory or disk, count 400,000 discarded tuples, and only then return the next 20 rows.\n- As page depth increases, latency and CPU consumption grow linearly.\n\n**2. Keyset Pagination (The Seek Method):**\n- Instead of telling the database how many rows to skip, you tell the database the **exact value of the last item seen on the previous page** using a composite row comparison: `WHERE (created_at, id) < (:last_created_at, :last_id)`.\n- With a matching composite index:\n```sql\nCREATE INDEX idx_products_keyset ON products (created_at DESC, id DESC);\n```\n- The B-tree index performs a direct root-to-leaf binary search in $O(\\log N)$ time to locate the exact starting leaf page and immediately reads the next 20 tuples. Execution time is **identical (1ms) for Page 1, Page 10, or Page 100,000**.\n\n**3. Additional Benefits:**\n- Completely immune to "missing item" or "duplicate item" pagination bugs caused by concurrent inserts or deletes while the user is browsing.',
    expectedConcepts: [
      'OFFSET scanning and discarding N rows in memory/disk',
      'Linear O(N) degradation of deep OFFSET queries',
      'Composite row-value comparison: (created_at, id) < (:last_date, :last_id)',
      'O(log N) B-tree seek followed by O(LIMIT) scan',
      'Composite index matching sort order: (created_at DESC, id DESC)'
    ],
    hints: [
      'Why does OFFSET 400000 force Postgres to read 400,020 rows?',
      'Tuple comparisons like (col1, col2) < (val1, val2) are directly supported by B-tree indexes.',
      'Why include the primary key id in the tie-breaker?'
    ],
    followUp: {
      question:
        'Why must the composite cursor include a unique tie-breaker column like `id` in addition to `created_at`?',
      expectedAnswer:
        'If multiple rows share the exact same `created_at` timestamp (very common in high-volume systems), filtering purely by `created_at < :last_date` would skip all other rows sharing that same timestamp, resulting in missing records. Adding unique `id` to the cursor guarantees a strictly unique total ordering across all tuples.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Explains why OFFSET requires scanning and discarding prior tuples',
        'Implements composite row comparison (created_at, id) < (...) syntax',
        'Specifies matching composite index (created_at DESC, id DESC)',
        'Explains tie-breaker requirement for non-unique timestamp columns'
      ]
    },
    testCases: [
      {
        id: 'tc-tier4-027-1',
        description: 'Verify keyset pagination returns next batch after cursor',
        setupSql:
          'CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(50), price NUMERIC, created_at VARCHAR(20));\nINSERT INTO products VALUES (1, \'Laptop\', 1000, \'2026-01-01\'), (2, \'Phone\', 800, \'2026-01-02\'), (3, \'Tablet\', 500, \'2026-01-03\');',
        expectedOutputSql:
          'SELECT id, name, price, created_at FROM products WHERE (created_at, id) < (\'2026-01-03\', 3) ORDER BY created_at DESC, id DESC LIMIT 20;',
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier4-028',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 28,
    title: 'PostgreSQL Foreign Keys with ON DELETE CASCADE: Lock Cascade Hazards',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A social commerce app uses `ON DELETE CASCADE` across 6 levels of relational hierarchy (`users` -> `posts` -> `comments` -> `reactions` -> `audit_events`). A user deletes their account, and the resulting cascading delete locks 250,000 rows across 8 tables, causing a database-wide deadlock storm.',
    questionStatement:
      'Analyze the locking behavior and transaction risks of deep `ON DELETE CASCADE` chains in PostgreSQL. Why do cascading deletes cause long-running lock retention and deadlocks? What architectural alternatives (soft deletes, asynchronous background deletion workers) eliminate cascade locking hazards?',
    referenceAnswer:
      '**1. How ON DELETE CASCADE Locks Data:**\n- When `DELETE FROM users WHERE id = 101` executes, PostgreSQL fires internal foreign key triggers to delete all referencing child rows across all dependent tables.\n- In a 6-level hierarchy, PostgreSQL must acquire row-level exclusive locks on every descendant row across all 8 tables within a **single transaction**.\n- All these locks are held simultaneously from the beginning of the cascade until the transaction **commits**.\n- As the cascade traverses hundreds of thousands of rows, concurrent user transactions attempting to like a post, add a comment, or update a profile intersect with the lock footprint, resulting in massive blocking queues and deadlocks.\n\n**2. The Danger of Lack of Pagination:**\n- A database cascade cannot be paginated or throttled. It must complete all 250,000 row deletions atomically. This creates massive WAL bursts, replication lag, and high latency.\n\n**3. Production Alternatives:**\n- **Pattern A: Soft Deletes with Immediate User Invalidation**:\n  - Set `UPDATE users SET deleted_at = NOW(), status = \'DELETED\' WHERE id = 101;`.\n  - The transaction finishes in 1ms. The user is logged out immediately and hidden from search.\n- **Pattern B: Asynchronous Background Deletion Queue**:\n  - A background worker reads deleted user IDs and deletes dependent rows from the bottom of the hierarchy up (reactions $\\to$ comments $\\to$ posts $\\to$ user) in **small batches of 500 rows** with explicit sleep throttles between transactions.\n  - This spreads disk I/O over minutes without holding long locks or causing deadlocks.',
    expectedConcepts: [
      'Single-transaction lock accumulation across entire relation hierarchy',
      'All row locks held until COMMIT',
      'Deadlocks with concurrent writes to descendant tables',
      'Lack of throttling/batching in native database cascades',
      'Soft delete + asynchronous chunked background deletion worker'
    ],
    hints: [
      'How long are locks held during an ON DELETE CASCADE transaction?',
      'Can you pause or batch an ON DELETE CASCADE halfway through?',
      'How do soft deletes decouple user experience from data cleanup?'
    ],
    followUp: {
      question:
        'Why does a foreign key defined with `ON DELETE SET NULL` carry similar locking risks to `ON DELETE CASCADE`?',
      expectedAnswer:
        '`ON DELETE SET NULL` must execute an `UPDATE` on every child row to set the foreign key column to NULL. Just like `CASCADE`, this requires acquiring exclusive row locks on all child rows and updating any indexes on that column within the same transaction, creating identical lock contention and bloat risks.',
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains single-transaction lock accumulation across child relations',
        'Details deadlock vulnerability with concurrent user operations',
        'Highlights lack of throttling in native SQL cascades',
        'Proposes soft deletes paired with chunked background deletion workers'
      ]
    }
  },
  {
    id: 'sql-tier4-029',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 29,
    title: 'Zero-Downtime NOT NULL Constraint Addition on 100-Million Row Tables',
    category: 'Migrations and Schema Evolution',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'You need to enforce `NOT NULL` on `orders(customer_id)`. Running `ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;` on a 100-million row table takes an `ACCESS EXCLUSIVE` lock and scans all 100 million rows to verify no NULLs exist, locking out the entire business for 4 minutes.',
    questionStatement:
      'Explain why traditional `SET NOT NULL` causes database downtime on large tables in PostgreSQL. Detail the 2-step zero-downtime technique using `CHECK ... NOT VALID` followed by `VALIDATE CONSTRAINT`. Explain how PostgreSQL 12+ optimizes this pattern.',
    referenceAnswer:
      '**1. Why Standard `SET NOT NULL` Causes Downtime:**\n- `ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;` requires an **`ACCESS EXCLUSIVE` lock** on the table.\n- Under this exclusive lock, PostgreSQL performs a full sequential scan of all 100 million rows in the heap table to prove that zero NULL values exist.\n- While the table is being scanned (3 to 5 minutes), **no other query can read or write to the table**, resulting in a complete application outage.\n\n**2. The Zero-Downtime 2-Step Recipe:**\n\n```sql\n-- Step 1: Add check constraint marked NOT VALID\n-- Acquires an ACCESS EXCLUSIVE lock for only a fraction of a millisecond to update metadata catalog.\n-- New inserts and updates will immediately enforce NOT NULL.\nALTER TABLE orders \nADD CONSTRAINT chk_orders_customer_id_not_null \nCHECK (customer_id IS NOT NULL) NOT VALID;\n\n-- Step 2: Validate constraint in a separate statement\n-- Acquires only a SHARE UPDATE EXCLUSIVE lock.\n-- Concurrent SELECT, INSERT, UPDATE, and DELETE operations continue running normally!\nALTER TABLE orders \nVALIDATE CONSTRAINT chk_orders_customer_id_not_null;\n```\n\n**3. PostgreSQL 12+ True `SET NOT NULL` Optimization:**\n- In PostgreSQL 12+, once a valid `CHECK (col IS NOT NULL)` constraint exists on the table, running:\n```sql\nALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;\n```\nwill recognize the existing check constraint and set the column\'s `attnotnull` catalog flag **instantly without re-scanning the table**! You can then safely drop the redundant check constraint.',
    expectedConcepts: [
      'ACCESS EXCLUSIVE lock held during full table scan in standard SET NOT NULL',
      'CHECK (col IS NOT NULL) NOT VALID instant metadata lock',
      'VALIDATE CONSTRAINT running under SHARE UPDATE EXCLUSIVE (concurrent DML allowed)',
      'PostgreSQL 12+ instant promotion from validated check constraint to attnotnull',
      'Dropping redundant check constraint after attnotnull is set'
    ],
    hints: [
      'What lock does VALIDATE CONSTRAINT acquire compared to ADD CONSTRAINT?',
      'Does NOT VALID scan existing rows when the constraint is created?',
      'Check how PostgreSQL 12 promotes a validated check constraint to SET NOT NULL.'
    ],
    followUp: {
      question:
        'Why is converting the check constraint to a native `SET NOT NULL` desirable in PostgreSQL 12+ rather than leaving the check constraint permanently?',
      expectedAnswer:
        'A native `attnotnull` flag in PostgreSQL\'s catalog is directly understood by the query planner for optimizations (e.g. proof of non-nullability in outer joins and anti-joins) and avoids the minor overhead of evaluating check constraints during execution.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains ACCESS EXCLUSIVE full table scan bottleneck',
        'Implements CHECK ... NOT VALID instant step',
        'Implements VALIDATE CONSTRAINT non-blocking validation',
        'Explains PG 12+ instant promotion to native attnotnull'
      ]
    }
  },
  {
    id: 'sql-tier4-030',
    tier: 'tier-4',
    difficultyLabel: 'Senior/Staff',
    order: 30,
    title: 'PostgreSQL Disaster Post-Mortem: Dropped Table Recovery Without Backup Restore',
    category: 'Backup, Recovery, and Replication',
    questionType: 'incident',
    datasetId: 'ecommerce',
    realWorldScenario:
      'At 15:00 UTC, an engineer intending to drop a staging table accidentally executes `DROP TABLE payments;` on the production database. The database is 4 Terabytes. Restoring from yesterday\'s full backup would take 8 hours and lose 15 hours of business transactions.',
    questionStatement:
      'Architect an emergency disaster recovery plan to recover the dropped `payments` table with zero lost data and minimum downtime. Detail Point-In-Time Recovery (PITR) to a temporary clone instance, `pg_dump` extraction of the single table, and selective re-import into production.',
    incidentDetails: {
      symptoms: [
        'Production table payments dropped accidentally',
        '4 TB database; full restore would take 8+ hours',
        'Ongoing writes occurring on remaining tables (orders, customers)',
        'Immediate recovery needed without rolling back other tables'
      ],
      systemTelemetry: {
        activeConnections: 120,
        cpuUtilizationPercent: 40,
        bufferCacheHitRatio: 99.2,
        logSnippet:
          '2026-11-01 15:00:02 UTC [4901]: [1-1] LOG:  statement: DROP TABLE payments;\n' +
          '2026-11-01 15:00:03 UTC [4901]: [2-1] LOG:  duration: 120.452 ms'
      },
      candidateTasks: [
        'Do NOT restore full database over live production (would wipe 15 hours of other tables)',
        'Spin up an isolated recovery instance from latest base backup and WAL archive',
        'Set recovery_target_time to 14:59:59 UTC (1 second before DROP TABLE)',
        'Extract single table using pg_dump -t payments and restore to live production'
      ]
    },
    referenceAnswer:
      '**1. The Fatal Mistake to Avoid:**\n- **Never restore the entire 4TB database over the live production cluster!**\n- If you restore the entire database back to 14:59 UTC, you will wipe out all legitimate orders, customer signups, and inventory updates that occurred on other tables before and after 15:00 UTC.\n\n**2. The Selective Table Recovery Architecture:**\n\n- **Step 1: Provision Recovery Clone**\n  Provision a separate, isolated cloud VM or database instance with fast NVMe storage.\n\n- **Step 2: Restore Base Backup & Configure Target Time**\n  Extract the latest physical base backup (e.g. from 00:00 UTC) onto the clone instance. Configure `postgresql.conf` / `recovery.signal`:\n```ini\nrestore_command = \'wal-g wal-fetch "%f" "%p"\'\nrecovery_target_time = \'2026-11-01 14:59:59 UTC\' -- Exactly 3 seconds before DROP TABLE\nrecovery_target_action = \'promote\'\n```\n\n- **Step 3: Fast Forward Replay**\n  Start the recovery instance. PostgreSQL replays WAL files from 00:00 UTC up to 14:59:59 UTC and automatically promotes to read-write mode. The `payments` table exists in this clone with all data up to the moment before the drop!\n\n- **Step 4: Extract Single Table Dump**\n```bash\npg_dump -h clone-db -U postgres -d ecommerce -t payments --data-only --format=custom -f payments_restored.dump\n```\n\n- **Step 5: Re-create Schema & Import into Production**\n  1. Recreate the table DDL (schema, constraints, indexes) on production.\n  2. Restore data using `pg_restore`:\n```bash\npg_restore -h prod-db -U postgres -d ecommerce --data-only --disable-triggers payments_restored.dump\n```\n  3. Re-enable foreign key constraints and validate data.\n\nTotal downtime: isolated to payments table during import; zero data lost on any other table.',
    expectedConcepts: [
      'Never rolling back production cluster over live unrelated tables',
      'Spinning up isolated temporary instance from base backup',
      'Configuring recovery_target_time to exact second before DROP TABLE',
      'pg_dump -t payments single-table extraction in custom format',
      'pg_restore --disable-triggers into live production cluster'
    ],
    hints: [
      'Why would restoring the full database to 14:59 lose all other data generated since then?',
      'How does setting recovery_target_time stop replay right before the DROP command in WAL?',
      'Use pg_dump -t to extract only the single missing table.'
    ],
    followUp: {
      question:
        'What transaction ID recovery setting can be used instead of `recovery_target_time` if you know the exact XID of the `DROP TABLE` command from the PostgreSQL log?',
      expectedAnswer:
        '`recovery_target_xid = \'XID\'` combined with `recovery_target_inclusive = false`. Setting inclusive to false instructs PostgreSQL to replay all transactions up to but **excluding** the transaction that issued the DROP TABLE, ensuring exact recovery to the transaction boundary.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Warns against destructive whole-cluster restoration',
        'Details isolated clone instance setup with base backup and WAL replay',
        'Configures recovery_target_time or recovery_target_xid with inclusive=false',
        'Extracts and restores single table via pg_dump/pg_restore with --disable-triggers'
      ]
    }
  }
];
