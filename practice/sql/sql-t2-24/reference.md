# Reference: PostgreSQL Autovacuum and Table Bloat

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Because of MVCC, UPDATE statements do not modify rows in-place; they mark the old tuple dead (`xmax` set) and append a new tuple. If dead tuples accumulate faster than autovacuum cleans them, disk pages become bloated with dead rows.\n`VACUUM` (standard) scans pages, marks dead space as reusable for future inserts in the Free Space Map, and does NOT lock the table against reads/writes. It does not return disk space to the OS.\n`VACUUM FULL` rewrites the entire table into a brand-new file on disk, compacting all pages. CAUTION: It acquires an `ACCESS EXCLUSIVE` lock, completely blocking all reads and writes for the duration, which can take hours and cause total application downtime.",
    "followUp": {
      "question": "What open-source tool allows rebuilding a bloated PostgreSQL table online without taking an exclusive lock?",
      "expectedAnswer": "pg_repack. It creates an auxiliary table, copies data, tracks concurrent changes via triggers, and swaps the tables with a momentary lock, returning space to the OS with zero downtime."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains dead tuples and bloat cause",
      "Differentiates VACUUM from VACUUM FULL",
      "Identifies ACCESS EXCLUSIVE lock downtime risk"
    ]
  },
  "expectedConcepts": [
    "Dead tuple accumulation from UPDATE/DELETE",
    "Standard VACUUM reclaims space internally without blocking",
    "VACUUM FULL acquires ACCESS EXCLUSIVE lock and rewrites file",
    "Table bloat impact on memory cache and sequential scans"
  ]
}
```
