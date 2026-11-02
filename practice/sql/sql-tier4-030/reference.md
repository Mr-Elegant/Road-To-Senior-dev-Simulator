# Reference: PostgreSQL Disaster Post-Mortem: Dropped Table Recovery Without Backup Restore

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. The Fatal Mistake to Avoid:**\n- **Never restore the entire 4TB database over the live production cluster!**\n- If you restore the entire database back to 14:59 UTC, you will wipe out all legitimate orders, customer signups, and inventory updates that occurred on other tables before and after 15:00 UTC.\n\n**2. The Selective Table Recovery Architecture:**\n\n- **Step 1: Provision Recovery Clone**\n  Provision a separate, isolated cloud VM or database instance with fast NVMe storage.\n\n- **Step 2: Restore Base Backup & Configure Target Time**\n  Extract the latest physical base backup (e.g. from 00:00 UTC) onto the clone instance. Configure `postgresql.conf` / `recovery.signal`:\n```ini\nrestore_command = 'wal-g wal-fetch \"%f\" \"%p\"'\nrecovery_target_time = '2026-11-01 14:59:59 UTC' -- Exactly 3 seconds before DROP TABLE\nrecovery_target_action = 'promote'\n```\n\n- **Step 3: Fast Forward Replay**\n  Start the recovery instance. PostgreSQL replays WAL files from 00:00 UTC up to 14:59:59 UTC and automatically promotes to read-write mode. The `payments` table exists in this clone with all data up to the moment before the drop!\n\n- **Step 4: Extract Single Table Dump**\n```bash\npg_dump -h clone-db -U postgres -d ecommerce -t payments --data-only --format=custom -f payments_restored.dump\n```\n\n- **Step 5: Re-create Schema & Import into Production**\n  1. Recreate the table DDL (schema, constraints, indexes) on production.\n  2. Restore data using `pg_restore`:\n```bash\npg_restore -h prod-db -U postgres -d ecommerce --data-only --disable-triggers payments_restored.dump\n```\n  3. Re-enable foreign key constraints and validate data.\n\nTotal downtime: isolated to payments table during import; zero data lost on any other table.",
    "followUp": {
      "question": "What transaction ID recovery setting can be used instead of `recovery_target_time` if you know the exact XID of the `DROP TABLE` command from the PostgreSQL log?",
      "expectedAnswer": "`recovery_target_xid = 'XID'` combined with `recovery_target_inclusive = false`. Setting inclusive to false instructs PostgreSQL to replay all transactions up to but **excluding** the transaction that issued the DROP TABLE, ensuring exact recovery to the transaction boundary."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Warns against destructive whole-cluster restoration",
      "Details isolated clone instance setup with base backup and WAL replay",
      "Configures recovery_target_time or recovery_target_xid with inclusive=false",
      "Extracts and restores single table via pg_dump/pg_restore with --disable-triggers"
    ]
  },
  "expectedConcepts": [
    "Never rolling back production cluster over live unrelated tables",
    "Spinning up isolated temporary instance from base backup",
    "Configuring recovery_target_time to exact second before DROP TABLE",
    "pg_dump -t payments single-table extraction in custom format",
    "pg_restore --disable-triggers into live production cluster"
  ]
}
```
