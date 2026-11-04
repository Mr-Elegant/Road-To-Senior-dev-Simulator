# Reference: Zero-Downtime Table Bloat Remediation: pg_repack vs VACUUM FULL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why Standard VACUUM Cannot Shrink Files:**\n- Standard `VACUUM` marks dead tuples as reusable space inside existing 8KB pages and updates the Free Space Map (FSM).\n- It can only truncate the physical file if dead pages happen to be at the very end of the file. If even a single live row sits on the last page of the file, standard `VACUUM` cannot shrink the file, leaving the OS file size unchanged.\n\n**2. VACUUM FULL vs pg_repack:**\n- **VACUUM FULL**: Creates a new compact copy of the table file and moves live rows into it. **Requires an `ACCESS EXCLUSIVE` lock** on the table for the entire duration, blocking ALL reads (`SELECT`) and writes (`INSERT/UPDATE/DELETE`).\n- **pg_repack**: An open-source extension that rebuilds tables and indexes **online with zero read/write downtime**, acquiring only a minimal brief lock at the start and end of the process.\n\n**3. Step-by-Step pg_repack Internal Mechanism:**\n- *Step A*: Creates an empty log table and attaches a trigger to the original table to record all live `INSERT`, `UPDATE`, and `DELETE` changes.\n- *Step B*: Creates a new destination table file with the same schema.\n- *Step C*: Copies all live rows from the old table to the new table in bulk.\n- *Step D*: Builds all indexes on the new table.\n- *Step E*: Replays changes accumulated in the log table onto the new table until lag is near zero.\n- *Step F*: Acquires a brief `ACCESS EXCLUSIVE` lock (for ~50ms), swaps the system catalog pointers (`pg_class` relfilenode) between old and new tables, and drops the old bloated table.",
    "followUp": {
      "question": "What disk space requirement must the database server satisfy before running `pg_repack` or `VACUUM FULL` on an 85GB table?",
      "expectedAnswer": "Both `pg_repack` and `VACUUM FULL` require at least double the table's current storage in free disk space (~90-100 GB free). Because they build a complete second copy of the table and all its indexes on disk simultaneously before swapping and dropping the original, running out of disk space during the operation aborts the process and can crash the database."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why standard VACUUM cannot release sparse pages to the OS",
      "Details the ACCESS EXCLUSIVE lock hazard of VACUUM FULL",
      "Provides step-by-step mechanics of pg_repack online table rebuilding",
      "Identifies 2x disk space requirement during table compaction"
    ]
  },
  "expectedConcepts": [
    "Why standard VACUUM only updates FSM and cannot return middle pages to OS",
    "VACUUM FULL ACCESS EXCLUSIVE lock blocking all reads and writes",
    "pg_repack shadow table, trigger logging, and online bulk copy",
    "Log replay catch-up phase",
    "Brief catalog pointer swap (relfilenode) for zero downtime"
  ]
}
```
