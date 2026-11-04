# Reference: PostgreSQL MVCC Internals: Heap Tuples, xmin, xmax, and Hints

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "In PostgreSQL, table rows (tuples) are immutable on disk. Rather than overwriting data in-place:\n\n1. **Tuple Header Fields**:\n   - `xmin`: The transaction ID (XID) that inserted/created this tuple version.\n   - `xmax`: The XID that updated or deleted this tuple version (0 if alive and uncommitted/unlocked).\n   - `t_ctid`: Pointer to physical location `(page_number, tuple_index)`. Points to itself if current, or to the newer tuple version if updated.\n   - `t_infomask / t_infomask2`: Bit flags storing commit status (e.g. `HEAP_XMIN_COMMITTED`, `HEAP_XMAX_INVALID`) known as \"hint bits\".\n\n2. **Physical Execution of UPDATE**:\n   - Step A: PostgreSQL reads the existing tuple.\n   - Step B: It writes its current transaction ID into the old tuple’s `xmax`.\n   - Step C: It appends a completely new tuple into a free heap page (or same page if HOT eligible) with `xmin = current_XID`, `xmax = 0`.\n   - Step D: It sets the old tuple’s `t_ctid` to point directly to the physical address of the new tuple.\n   - Result: Both the old (dead) and new (live) tuple versions consume disk space simultaneously until VACUUM reclaims the dead tuple space.",
    "followUp": {
      "question": "What are \"hint bits\" in the tuple header, and why does a pure read query (SELECT) sometimes dirty heap pages on disk?",
      "expectedAnswer": "When a transaction checks tuple visibility, it consults `pg_xact` (commit log). To avoid querying `pg_xact` on every subsequent read, the reading query writes \"hint bits\" (`HEAP_XMIN_COMMITTED` or `HEAP_XMIN_ABORTED`) directly into the tuple header. This mutates the 8KB page in memory, turning a read operation into a page-dirtying write that eventually flushes to disk."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 20,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Correctly describes xmin and xmax semantics",
      "Explains tuple immutability and t_ctid forwarding",
      "Details step-by-step UPDATE execution as insert of new version",
      "Explains hint bits and why SELECT dirties pages"
    ]
  },
  "expectedConcepts": [
    "Tuple immutability in PostgreSQL",
    "xmin (creator XID) and xmax (deleter/updater XID)",
    "t_ctid pointer chaining between tuple versions",
    "Hint bits (HEAP_XMIN_COMMITTED) preventing repeat pg_xact lookups",
    "Why UPDATE is physically an INSERT + soft-delete"
  ]
}
```
