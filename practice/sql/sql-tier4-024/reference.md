# Reference: PostgreSQL Memory Hierarchy: Shared Buffers, OS Page Cache, and Double Buffering

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Double Buffering Architecture:**\n- PostgreSQL uses standard POSIX `read()` and `write()` system calls (buffered I/O), not `O_DIRECT`.\n- When Postgres reads an 8KB page from disk, the Linux kernel first reads it into the **OS Page Cache**.\n- PostgreSQL then copies the page into its own internal memory pool: **`shared_buffers`**.\n- Thus, active pages often reside in both memory locations simultaneously (\"Double Buffering\").\n\n**2. Why 60 GB `shared_buffers` Degraded Performance:**\n- Setting `shared_buffers` to 60 GB leaves only 4 GB for the OS kernel, backend process memory (`work_mem`, `maintenance_work_mem`), and connection stack overhead.\n- PostgreSQL’s clock-sweep buffer eviction algorithm is simpler than the Linux kernel’s sophisticated multi-generational LRU page cache.\n- Writing dirty pages from `shared_buffers` requires syncing through kernel memory. With no kernel RAM left, disk write queuing stalls.\n- When backend processes allocate `work_mem` for queries, the OS runs out of memory and starts swapping to disk or invokes the OOM killer.\n\n**3. The 25% Rule & `effective_cache_size`:**\n- **`shared_buffers`**: Recommended at **25% of total system RAM** (e.g. 16 GB). This provides ample dedicated memory for frequently accessed hot pages while leaving 75% for the OS page cache and query execution.\n- **`effective_cache_size`**: Set to **70-75% of total RAM** (e.g. 48 GB). **It does not allocate any memory!** It is purely an informational advisory hint to the query planner, estimating the total memory available for caching data (shared_buffers + OS page cache). A higher value encourages the planner to choose Index Scans over Seq Scans because it assumes index pages are already cached in RAM.",
    "followUp": {
      "question": "What official PostgreSQL extension allows inspection of the exact contents currently cached inside `shared_buffers` in real-time?",
      "expectedAnswer": "The `pg_buffercache` extension. It provides the view `pg_buffercache` which details every 8KB buffer block, showing which database, relation, and block number is cached, and whether the page is dirty or pinned."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 20,
    "performanceWeight": 30,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains double buffering between shared_buffers and OS page cache",
      "Details negative consequences of oversized shared_buffers (swapping, OOM)",
      "Justifies the 25% RAM rule for shared_buffers",
      "Clarifies that effective_cache_size is a planner estimation hint, not allocation"
    ]
  },
  "expectedConcepts": [
    "Buffered I/O via POSIX read/write and Linux Page Cache",
    "Double buffering: page residing in both shared_buffers and kernel cache",
    "Why 60GB shared_buffers starves OS page cache and causes swapping",
    "25% rule for shared_buffers",
    "effective_cache_size as an informational planner cost hint (not memory allocation)"
  ]
}
```
