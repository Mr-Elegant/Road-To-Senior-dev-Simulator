# Reference: CRM Million-Row Activity Log OFFSET Pagination Degradation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Why OFFSET degrades:\nSQL databases cannot jump directly to row 100,000 in an index without reading through the preceding 99,999 entries. 'OFFSET 100000 LIMIT 20' scans 100,020 tuples, discards 100,000 of them, and returns 20. The deeper the page, the worse the latency (O(N) complexity).\nAdditionally, if rows are inserted while a user navigates pages, OFFSET produces duplicate or skipped records.\n      \nFix: Keyset Pagination (Cursor-Based)\nUse the values of the last record on the current page as a cursor for the next page. The database uses the B-Tree index to seek directly to the exact point in the index in O(log N) time and reads only 20 rows.",
    "codeOrArtifact": "/* Composite Index */\n-- CREATE INDEX idx_audit_logs_keyset ON audit_logs (tenant_id, created_at DESC, id DESC);\n\nasync function getAuditLogsKeyset(db, tenantId, cursor, limit = 20) {\n  let query;\n  let params;\n\n  if (!cursor) {\n    // First page\n    query = `\n      SELECT id, event_name, created_at, actor \n      FROM audit_logs \n      WHERE tenant_id = $1 \n      ORDER BY created_at DESC, id DESC \n      LIMIT $2\n    `;\n    params = [tenantId, limit];\n  } else {\n    // Subsequent pages: seek directly using tuple comparison\n    query = `\n      SELECT id, event_name, created_at, actor \n      FROM audit_logs \n      WHERE tenant_id = $1 \n        AND (created_at, id) < ($2, $3)\n      ORDER BY created_at DESC, id DESC \n      LIMIT $4\n    `;\n    params = [tenantId, cursor.createdAt, cursor.id, limit];\n  }\n\n  const res = await db.query(query, params);\n  const rows = res.rows;\n  const nextCursor = rows.length === limit \n    ? { createdAt: rows[rows.length - 1].created_at, id: rows[rows.length - 1].id } \n    : null;\n\n  return { rows, nextCursor };\n}"
  },
  "rubric": [
    {
      "id": "rb-keyset-pagination",
      "category": "code_quality",
      "label": "Keyset / Cursor Pagination Architecture",
      "description": "Implements tuple cursor comparison and appropriate composite B-Tree index.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Writes tuple comparison (created_at, id) < (...), includes tie-breaker id, specifies composite index."
        },
        {
          "score": 2,
          "description": "Filters only on created_at without tie-breaker id (causes skipped rows on timestamp ties)."
        },
        {
          "score": 0,
          "description": "Keeps OFFSET."
        }
      ]
    }
  ],
  "alternatives": [
    "Deferred Join with OFFSET: `JOIN (SELECT id FROM audit_logs WHERE ... OFFSET ... LIMIT ...) ON ...` to avoid pulling wide columns."
  ],
  "commonMistakes": [
    "Not including a unique tie-breaker (like `id`): if multiple events share the exact same timestamp millisecond, `< created_at` skips records entirely.",
    "Attempting to allow random-access jumping to \"Page 400\" with keyset pagination (keyset is inherently sequential / cursor-based)."
  ],
  "followUps": [
    {
      "id": "db-fq-4",
      "question": "When is OFFSET pagination still acceptable or preferred over Keyset pagination?",
      "expectedConcepts": [
        "Small finite datasets (< 500 rows)",
        "Random jump to page number UI requirements",
        "Admin views with rarely updated tables"
      ],
      "sampleStrongAnswer": "OFFSET pagination is acceptable for small, bounded datasets (e.g. fewer than 1,000 total rows) where users require a UI that allows jumping directly to arbitrary page numbers (e.g. Page 14) and where the table has negligible write traffic."
    }
  ]
}
```
