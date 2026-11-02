# Reference: 50M-Row User Schema Column Rename Zero-Downtime Migration

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Running 'UPDATE users SET first_name = split_part(full_name, ' ', 1)' across 50 million rows writes 50 million new row versions (MVCC), generates gigabytes of WAL logs, and saturates disk I/O, while an ALTER TABLE locks the table against reads and writes.\n      \nZero-Downtime Expand-and-Contract Architecture:\nPhase 1: Expand Schema\n- Run 'ALTER TABLE users ADD COLUMN first_name VARCHAR(100), ADD COLUMN last_name VARCHAR(100);' (Postgres adds nullable columns instantaneously without table rewrites).\nPhase 2: Dual Write in Application\n- Deploy Application v2: When new users register or update profiles, write to BOTH 'full_name' AND ('first_name', 'last_name').\n- Reads still query 'full_name'.\nPhase 3: Backfill Historical Data\n- Run an asynchronous worker script in off-peak hours.\n- Updates records in chunks of 1,000 by primary key with 50ms pauses:\n  'UPDATE users SET first_name = ..., last_name = ... WHERE id BETWEEN $start AND $end AND first_name IS NULL;'\n- Monitor Postgres replication lag and autovacuum.\nPhase 4: Switch Reads\n- Deploy Application v3: Reads now query 'first_name' and 'last_name'. Stop writing to 'full_name'.\nPhase 5: Contract\n- Deploy Application v4: Remove all code references to 'full_name'.\n- Drop the old column: 'ALTER TABLE users DROP COLUMN full_name;'",
    "codeOrArtifact": "/**\n * Safe Throttled Backfill Worker Script\n */\nasync function backfillUserData(db) {\n  const BATCH_SIZE = 1000;\n  let cursorId = 0;\n  let hasMore = true;\n\n  while (hasMore) {\n    const res = await db.query(\n      `SELECT id, full_name \n       FROM users \n       WHERE id > $1 AND first_name IS NULL \n       ORDER BY id ASC \n       LIMIT $2`,\n      [cursorId, BATCH_SIZE]\n    );\n\n    if (res.rows.length === 0) {\n      hasMore = false;\n      break;\n    }\n\n    for (const row of res.rows) {\n      const parts = (row.full_name || '').trim().split(' ');\n      const firstName = parts[0] || '';\n      const lastName = parts.slice(1).join(' ') || '';\n\n      await db.query(\n        'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3',\n        [firstName, lastName, row.id]\n      );\n      cursorId = row.id;\n    }\n\n    // Sleep 50ms to yield I/O and prevent replication lag\n    await new Promise((resolve) => setTimeout(resolve, 50));\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-migration-phases",
      "category": "tradeoffs",
      "label": "Expand/Contract Migration Execution",
      "description": "Details Expand and Contract pattern with backward and forward compatibility.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "All 5 phases meticulously planned: schema expand, dual-write, throttled backfill, read switch, contract."
        },
        {
          "score": 2,
          "description": "Mentions adding columns first, but suggests doing backfill in one big UPDATE."
        },
        {
          "score": 0,
          "description": "Suggests running ALTER TABLE and UPDATE during maintenance window."
        }
      ]
    }
  ],
  "alternatives": [
    "Using PostgreSQL database triggers for dual-writing during the transition instead of application code.",
    "Using tools like `pg-online-schema-change` or GitHub's `gh-ost` for MySQL."
  ],
  "commonMistakes": [
    "Adding a NOT NULL constraint without a default during Phase 1 (causes immediate deployment failure for existing rows and old app versions).",
    "Running backfills without sleeping or chunking, triggering replica lag alerts and disk fillups."
  ],
  "followUps": [
    {
      "id": "db-fq-5",
      "question": "Why should you always create indexes using `CREATE INDEX CONCURRENTLY` in PostgreSQL production?",
      "expectedConcepts": [
        "Standard CREATE INDEX locks table for writes (ShareLock)",
        "CONCURRENTLY builds index without write locks",
        "Requires 2 table scans"
      ],
      "sampleStrongAnswer": "Standard `CREATE INDEX` acquires a `SHARE` lock on the table, which permits reads but blocks all concurrent `INSERT`, `UPDATE`, and `DELETE` queries until the entire index build finishes. On a 50M-row table, this can lock out writes for 10-20 minutes. `CREATE INDEX CONCURRENTLY` builds the index using two separate table scans without blocking writes."
    }
  ]
}
```
