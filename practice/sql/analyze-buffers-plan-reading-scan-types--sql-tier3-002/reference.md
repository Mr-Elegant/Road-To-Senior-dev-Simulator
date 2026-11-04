# Reference: EXPLAIN (ANALYZE, BUFFERS): Plan Reading & Scan Types

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Scan Types Comparison:**\n- **Seq Scan**: Reads entire heap table page by page sequentially. Chosen when a large fraction of the table matches (typically >5-15%), or when the table is small enough that random I/O overhead exceeds sequential throughput.\n- **Index Scan**: Traverses the B-Tree index to find matching keys, then fetches individual heap pages via `ctid` (tuple pointers). Fast for small result sets, but suffers from random I/O if matching rows are scattered across many pages.\n- **Index Only Scan**: Fetches required column values directly from the index tuple without visiting the heap table. Requires that all queried columns exist in the index (via composite keys or `INCLUDE`), AND the target heap page is marked clean in the table’s Visibility Map.\n- **Bitmap Index Scan + Bitmap Heap Scan**: Used when an index scan would produce too many random I/O lookups, or when combining multiple independent indexes (`BitmapAnd`, `BitmapOr`). The index scan builds an in-memory bitmap of candidate page IDs/offsets in `work_mem`. The subsequent `BitmapHeapScan` reads heap pages in sequential physical order, eliminating repeated page visits and random seeks.\n\n**2. Buffer Metrics:**\n- `shared hit`: 8KB buffer pool pages already present in Postgres `shared_buffers`.\n- `shared read`: 8KB pages read from OS kernel cache or physical storage.\n- `shared dirtied`: Pages modified in memory during execution (e.g. hint bits set for transaction visibility).\n- `shared written`: Pages written to disk (rarely happens during a read query unless buffer pool eviction occurs).",
    "followUp": {
      "question": "If EXPLAIN shows `Lossy Bitmap Heap Scan`, what configuration parameter was exceeded, and what is the performance impact?",
      "expectedAnswer": "The query exceeded `work_mem`. When the memory required for the exact bitmap (storing exact tuple offsets) exceeds `work_mem`, Postgres degrades the bitmap to \"lossy\" mode, storing only page addresses rather than exact tuple pointers. During the heap scan, Postgres must recheck every single tuple on each candidate page against the filter condition, consuming extra CPU."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 20,
    "performanceWeight": 30,
    "edgeCaseWeight": 15,
    "criteria": [
      "Accurately differentiates all four scan types",
      "Explains why Bitmap Index Scan converts random I/O to sequential physical reads",
      "Mentions visibility map in Index Only Scan",
      "Decodes shared hit, read, and dirtied buffer counters"
    ]
  },
  "expectedConcepts": [
    "Seq Scan vs Index Scan vs Index Only Scan vs Bitmap Index Scan",
    "Bitmap Heap Scan reading physical pages in sequential order",
    "Visibility map requirement for Index Only Scans",
    "shared_buffers hit vs read vs dirtied"
  ]
}
```
