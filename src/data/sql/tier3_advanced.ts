import { SqlQuestion } from '@/types/sqlTrack';

export const TIER3_ADVANCED_QUESTIONS: SqlQuestion[] = [
  {
    id: 'sql-tier3-001',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 1,
    title: 'B-Tree Index Internals: Leaf Pages, Splits, and Fillfactor',
    category: 'Indexes and Query Planning',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A high-frequency payment processing service experiences periodic latency spikes (from 4ms to 450ms) during bursts of INSERT statements into the `payments` table. Investigation shows high disk I/O on index files.',
    questionStatement:
      'Explain how PostgreSQL B-Tree indexes handle insertions. What is an index page split, why does it trigger 50/50 page allocations and random I/O, and how does the `fillfactor` storage parameter alleviate this for high-update/insert workloads?',
    referenceAnswer:
      'PostgreSQL B-Tree indexes are balanced trees composed of meta pages, internal routing pages, and leaf pages (default 8KB each) containing sorted `(key, ctid)` tuples.\n\n1. **Page Splits**: When a leaf page fills up and a new key must be inserted within its range, PostgreSQL allocates a new 8KB block and moves roughly half of the leaf page’s tuples to the new block (a 50/50 split), then updates the parent page. This causes write amplification, WAL volume bursts, and page fragmentation (sparse pages).\n2. **Right-Leaning Splits**: For strictly increasing sequences (like sequential BIGSERIAL/TIMESTAMPTZ), PostgreSQL optimizes splits by leaving the full page intact and allocating a new right leaf page.\n3. **Random Key Inserts (e.g. UUIDv4)**: Uniformly distributed keys land randomly across all leaf pages, triggering continuous 50/50 splits, severe bloat, and cache thrashing.\n4. **Fillfactor Optimization**: Setting `fillfactor` (e.g., `WITH (fillfactor = 70)` on indexes or tables) reserves 30% free space in each page at creation time. For tables, this enables HOT (Heap-Only Tuple) updates within the same heap page without touching the index. For indexes (PG 11+), it allows intra-page insertions without immediate leaf splits.',
    expectedConcepts: [
      'B-Tree 8KB leaf pages and (key, ctid) tuples',
      '50/50 page split mechanics and write amplification',
      'HOT (Heap-Only Tuple) updates and table fillfactor',
      'Sequential vs random (UUID) index insertion patterns',
      'Index bloat and fragmentation mitigation'
    ],
    hints: [
      'Think about what happens when an 8KB leaf page is 100% full and a new key falls between existing keys.',
      'Contrast sequential integer IDs with random UUIDv4 keys.',
      'Recall what HOT (Heap-Only Tuple) requires: the new row version must fit in the exact same 8KB table page.'
    ],
    followUp: {
      question:
        'Why does PostgreSQL 13+ B-Tree deduplication reduce index size for non-unique columns, and when is it disabled?',
      expectedAnswer:
        'PostgreSQL 13 introduced B-tree deduplication: when multiple index entries share identical key values, PostgreSQL stores the key once followed by an array of posting list TIDs (heap pointers) instead of repeating the key. This can reduce index size by 40-70%. It is automatically disabled for unique indexes, expressions, and types without support for deduplication equality.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains 8KB leaf page anatomy and (key, ctid) pairs',
        'Details 50/50 page split mechanics and write amplification',
        'Distinguishes sequential vs UUID random insert patterns',
        'Explains fillfactor for both tables (HOT updates) and indexes'
      ]
    }
  },
  {
    id: 'sql-tier3-002',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 2,
    title: 'EXPLAIN (ANALYZE, BUFFERS): Plan Reading & Scan Types',
    category: 'Indexes and Query Planning',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A dashboard query filtering `orders` by `customer_id` and `status` takes 1.8 seconds in staging. The developer ran `EXPLAIN (ANALYZE, BUFFERS)` and asks you to interpret the output.',
    questionStatement:
      'Analyze the four primary scan types in PostgreSQL: Sequential Scan, Index Scan, Index Only Scan, and Bitmap Index Scan. Under what exact conditions does the planner choose a Bitmap Index Scan over a normal Index Scan? What do `Buffers: shared hit, read, dirtied` signify?',
    referenceAnswer:
      '**1. Scan Types Comparison:**\n- **Seq Scan**: Reads entire heap table page by page sequentially. Chosen when a large fraction of the table matches (typically >5-15%), or when the table is small enough that random I/O overhead exceeds sequential throughput.\n- **Index Scan**: Traverses the B-Tree index to find matching keys, then fetches individual heap pages via `ctid` (tuple pointers). Fast for small result sets, but suffers from random I/O if matching rows are scattered across many pages.\n- **Index Only Scan**: Fetches required column values directly from the index tuple without visiting the heap table. Requires that all queried columns exist in the index (via composite keys or `INCLUDE`), AND the target heap page is marked clean in the table’s Visibility Map.\n- **Bitmap Index Scan + Bitmap Heap Scan**: Used when an index scan would produce too many random I/O lookups, or when combining multiple independent indexes (`BitmapAnd`, `BitmapOr`). The index scan builds an in-memory bitmap of candidate page IDs/offsets in `work_mem`. The subsequent `BitmapHeapScan` reads heap pages in sequential physical order, eliminating repeated page visits and random seeks.\n\n**2. Buffer Metrics:**\n- `shared hit`: 8KB buffer pool pages already present in Postgres `shared_buffers`.\n- `shared read`: 8KB pages read from OS kernel cache or physical storage.\n- `shared dirtied`: Pages modified in memory during execution (e.g. hint bits set for transaction visibility).\n- `shared written`: Pages written to disk (rarely happens during a read query unless buffer pool eviction occurs).',
    expectedConcepts: [
      'Seq Scan vs Index Scan vs Index Only Scan vs Bitmap Index Scan',
      'Bitmap Heap Scan reading physical pages in sequential order',
      'Visibility map requirement for Index Only Scans',
      'shared_buffers hit vs read vs dirtied'
    ],
    hints: [
      'Consider why random disk seeks are slower than sequential reads when fetching 5,000 scattered rows.',
      'Check the role of the visibility map in index-only scans.',
      'Buffers shared hit comes from PostgreSQL memory cache.'
    ],
    followUp: {
      question:
        'If EXPLAIN shows `Lossy Bitmap Heap Scan`, what configuration parameter was exceeded, and what is the performance impact?',
      expectedAnswer:
        'The query exceeded `work_mem`. When the memory required for the exact bitmap (storing exact tuple offsets) exceeds `work_mem`, Postgres degrades the bitmap to "lossy" mode, storing only page addresses rather than exact tuple pointers. During the heap scan, Postgres must recheck every single tuple on each candidate page against the filter condition, consuming extra CPU.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 20,
      performanceWeight: 30,
      edgeCaseWeight: 15,
      criteria: [
        'Accurately differentiates all four scan types',
        'Explains why Bitmap Index Scan converts random I/O to sequential physical reads',
        'Mentions visibility map in Index Only Scan',
        'Decodes shared hit, read, and dirtied buffer counters'
      ]
    }
  },
  {
    id: 'sql-tier3-003',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 3,
    title: 'GIN vs GiST vs BRIN Indexes: Architecture and Selection',
    category: 'Indexes and Query Planning',
    questionType: 'conceptual',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'Your SaaS platform logs 50 million telemetry rows per day into `events` (timestamp, user_id, event_name, metadata JSONB). B-Tree indexes on `(timestamp, metadata)` are ballooning past 120GB and destroying write throughput.',
    questionStatement:
      'Compare GIN, GiST, and BRIN index architectures in PostgreSQL. For each index type, identify its internal structure, ideal query patterns, write overhead, and storage characteristics. Which index should you apply to `metadata JSONB` and which to `created_at` in this 50M rows/day table?',
    referenceAnswer:
      '**1. GIN (Generalized Inverted Index):**\n- **Structure**: An inverted list mapping elements (JSON keys/values, array elements, tsvector tokens) to posting lists or posting trees of matching tuple IDs (TIDs).\n- **Use Cases**: JSONB containment (`@>`), array contains (`&&`, `@>`), Full-Text Search (`to_tsvector`).\n- **Write Overhead**: Heavy write amplification because one inserted row with 10 JSON keys generates 10 index updates. Mitigated by `fastupdate = on` (in-memory pending list buffer).\n- **Recommendation**: Apply `CREATE INDEX ON events USING gin (metadata jsonb_path_ops)` for JSONB containment queries.\n\n**2. GiST (Generalized Search Tree):**\n- **Structure**: Balanced tree of bounding boxes/predicates where child nodes are covered by the parent node’s predicate.\n- **Use Cases**: Geometric coordinates (PostGIS), IP ranges (`inet`), timestamp ranges (`tsrange` with exclusion constraints), trigram similarity (`pg_trgm`).\n- **Write Overhead**: Moderate, fast point lookups and nearest-neighbor (`<->`) distance searches.\n\n**3. BRIN (Block Range Index):**\n- **Structure**: Stores only the minimum and maximum values for physical blocks of heap pages (default 128 pages = 1MB block range). Size is minuscule (often < 10MB for 100M rows).\n- **Use Cases**: Naturally physically ordered append-only columns (e.g. `created_at`, sequential IDs) where physical storage closely correlates with logical value.\n- **Write Overhead**: Virtually zero write overhead on inserts. Searches scan pages within the matching min-max block range.\n- **Recommendation**: Apply `CREATE INDEX ON events USING brin (created_at)` for timestamp range filtering on the append-only events table.',
    expectedConcepts: [
      'GIN inverted index structure and posting lists/trees',
      'GIN fastupdate pending list buffer',
      'GiST bounding predicates and range/geometric search',
      'BRIN block range min-max summaries and tiny footprint',
      'Optimal pairing: BRIN for sequential timestamps, GIN for JSONB'
    ],
    hints: [
      'Append-only timestamps are naturally sorted on disk pages: what index stores only min/max per range of pages?',
      'GIN is an inverted index, perfect for multi-value keys.',
      'Compare GIN jsonb_path_ops vs jsonb_ops.'
    ],
    followUp: {
      question:
        'What is the practical difference between `jsonb_ops` and `jsonb_path_ops` when creating a GIN index on a JSONB column?',
      expectedAnswer:
        '`jsonb_ops` (the default) indexes every key, value, and sub-path independently, supporting `?`, `?|`, `?&`, and `@>` operators, but results in a larger index. `jsonb_path_ops` hashes the complete root-to-leaf path and value together into a single 32-bit hash, supporting only the `@>` (containment) operator, but produces indexes that are typically 60% smaller and significantly faster for containment queries.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains GIN inverted list architecture and write amplification',
        'Explains BRIN min-max block range summaries and compact footprint',
        'Contrasts GiST bounding trees with GIN and BRIN',
        'Correctly selects BRIN for append-only timestamp and GIN for JSONB'
      ]
    }
  },
  {
    id: 'sql-tier3-004',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 4,
    title: 'PostgreSQL MVCC Internals: Heap Tuples, xmin, xmax, and Hints',
    category: 'Isolation Levels and MVCC',
    questionType: 'conceptual',
    datasetId: 'loan_management',
    realWorldScenario:
      'During an audit of the `loans` table, a junior engineer notices that after running an `UPDATE loans SET status = \'ACTIVE\'` on 10,000 rows, the table size on disk doubled from 50MB to 100MB even though the row count remained identical.',
    questionStatement:
      'Explain PostgreSQL Multi-Version Concurrency Control (MVCC) at the physical tuple level. What are `xmin`, `xmax`, `t_ctid`, and `infomask` hint bits in the heap tuple header? Describe step-by-step how an UPDATE statement is executed physically on disk.',
    referenceAnswer:
      'In PostgreSQL, table rows (tuples) are immutable on disk. Rather than overwriting data in-place:\n\n1. **Tuple Header Fields**:\n   - `xmin`: The transaction ID (XID) that inserted/created this tuple version.\n   - `xmax`: The XID that updated or deleted this tuple version (0 if alive and uncommitted/unlocked).\n   - `t_ctid`: Pointer to physical location `(page_number, tuple_index)`. Points to itself if current, or to the newer tuple version if updated.\n   - `t_infomask / t_infomask2`: Bit flags storing commit status (e.g. `HEAP_XMIN_COMMITTED`, `HEAP_XMAX_INVALID`) known as "hint bits".\n\n2. **Physical Execution of UPDATE**:\n   - Step A: PostgreSQL reads the existing tuple.\n   - Step B: It writes its current transaction ID into the old tuple’s `xmax`.\n   - Step C: It appends a completely new tuple into a free heap page (or same page if HOT eligible) with `xmin = current_XID`, `xmax = 0`.\n   - Step D: It sets the old tuple’s `t_ctid` to point directly to the physical address of the new tuple.\n   - Result: Both the old (dead) and new (live) tuple versions consume disk space simultaneously until VACUUM reclaims the dead tuple space.',
    expectedConcepts: [
      'Tuple immutability in PostgreSQL',
      'xmin (creator XID) and xmax (deleter/updater XID)',
      't_ctid pointer chaining between tuple versions',
      'Hint bits (HEAP_XMIN_COMMITTED) preventing repeat pg_xact lookups',
      'Why UPDATE is physically an INSERT + soft-delete'
    ],
    hints: [
      'Remember that PostgreSQL never modifies an existing tuple in place during an UPDATE.',
      'What fields in the 23-byte tuple header record transaction visibility?',
      'How does PostgreSQL know whether a transaction committed without reading the commit log every time?'
    ],
    followUp: {
      question:
        'What are "hint bits" in the tuple header, and why does a pure read query (SELECT) sometimes dirty heap pages on disk?',
      expectedAnswer:
        'When a transaction checks tuple visibility, it consults `pg_xact` (commit log). To avoid querying `pg_xact` on every subsequent read, the reading query writes "hint bits" (`HEAP_XMIN_COMMITTED` or `HEAP_XMIN_ABORTED`) directly into the tuple header. This mutates the 8KB page in memory, turning a read operation into a page-dirtying write that eventually flushes to disk.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 20,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Correctly describes xmin and xmax semantics',
        'Explains tuple immutability and t_ctid forwarding',
        'Details step-by-step UPDATE execution as insert of new version',
        'Explains hint bits and why SELECT dirties pages'
      ]
    }
  },
  {
    id: 'sql-tier3-005',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 5,
    title: 'Autovacuum Tuning, Table Bloat, and Freeze Wraparound',
    category: 'Production Debugging',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A production PostgreSQL database with high write volume triggers a critical monitoring alert: `database age is 1,850,000,000 transactions; danger of shutdown in 150 million transactions`. Autovacuum appears unable to keep up.',
    questionStatement:
      'Explain the PostgreSQL Transaction ID (XID) wraparound hazard and the purpose of `VACUUM FREEZE`. What causes autovacuum worker starvation, and how do you tune autovacuum cost limits, scale factors, and workers to prevent database emergency shutdown?',
    referenceAnswer:
      '**1. The XID Wraparound Problem:**\n- PostgreSQL uses 32-bit unsigned transaction IDs (XIDs), allowing ~4.29 billion unique IDs.\n- Visibility logic considers XIDs modulo $2^{31}$: an XID is in the past if it is within $2^{31}$ transactions behind the current XID; otherwise it is treated as in the future.\n- If a table reaches $2^{31}$ (2.14 billion) transactions without freezing, old past transactions would suddenly appear to be in the future, rendering historical data invisible.\n- At 2 billion XIDs, PostgreSQL triggers an aggressive anti-wraparound autovacuum. If it reaches 2.14 billion, PostgreSQL shuts down and enters single-user mode to prevent data corruption.\n\n**2. VACUUM FREEZE:**\n- Freezing replaces an old tuple’s `xmin` with a special `FrozenTransactionId` (value 2), or sets the `HEAP_XMIN_FROZEN` hint bit in the tuple header, signifying this tuple is permanently visible to all past and future transactions.\n\n**3. Tuning to Prevent Starvation:**\n- `autovacuum_max_workers`: Increase from 3 to 6-8 on multi-core servers.\n- `autovacuum_vacuum_cost_limit`: Default (200 in older versions, 2000 in PG 16+) is too low; raise to 1000-5000 so vacuum workers run faster without sleeping.\n- `autovacuum_vacuum_cost_delay`: Reduce from 20ms or 2ms to 0ms or 2ms to prevent unnecessary throttle sleep.\n- Per-table tuning: For high-churn tables (e.g. `payments`):\n  `ALTER TABLE payments SET (autovacuum_vacuum_scale_factor = 0.05, autovacuum_vacuum_threshold = 1000);`',
    expectedConcepts: [
      '32-bit XID space and modulo 2^31 visibility horizon',
      'FrozenTransactionId / HEAP_XMIN_FROZEN hint bit',
      'Anti-wraparound autovacuum and emergency database shutdown',
      'autovacuum_vacuum_cost_limit and cost_delay throttling',
      'Per-table scale_factor and threshold tuning'
    ],
    hints: [
      'Why does 32-bit integer arithmetic wrap around at 2^31 in circular comparisons?',
      'What happens to a tuple when its xmin is replaced with FrozenTransactionId?',
      'Check autovacuum cost delay: workers sleep when accumulated I/O points reach cost limit.'
    ],
    followUp: {
      question:
        'Why does a long-running transaction or an abandoned replication slot prevent VACUUM from cleaning dead rows, even if autovacuum runs constantly?',
      expectedAnswer:
        'VACUUM can only remove dead tuple versions whose `xmax` is older than the oldest active transaction snapshot (`xmin horizon`). If an open transaction or an inactive logical replication slot holds back the catalog `xmin`, VACUUM cannot remove any dead rows generated after that transaction began, causing table and index bloat across the entire database.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains 32-bit circular XID space and 2^31 wraparound failure mode',
        'Details VACUUM FREEZE and FrozenTransactionId mechanics',
        'Explains cost limit / cost delay worker throttling',
        'Identifies oldest active transaction/replication slot xmin horizon'
      ]
    }
  },
  {
    id: 'sql-tier3-006',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 6,
    title: 'Declarative Partitioning: Range, List, and Hash Strategies',
    category: 'Partitioning and Large Tables',
    questionType: 'conceptual',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'The `events` table in SaaS analytics has reached 800 million rows (1.2 TB). Queries filtering by `created_at` are slow, and monthly data archiving requires deleting 70 million rows, which causes massive table bloat and lock contention.',
    questionStatement:
      'Design a declarative table partitioning architecture for the `events` table by month using PostgreSQL 13+ declarative range partitioning. Explain partition pruning (run-time vs compile-time), local vs global index constraints, and how dropping a partition provides instant zero-bloat data retention.',
    referenceAnswer:
      '**1. Declarative Range Partitioning Architecture:**\n```sql\n-- Create root partitioned table\nCREATE TABLE events (\n    id BIGINT GENERATED ALWAYS AS IDENTITY,\n    user_id INT NOT NULL,\n    event_name VARCHAR(100) NOT NULL,\n    metadata JSONB,\n    created_at TIMESTAMPTZ NOT NULL,\n    PRIMARY KEY (id, created_at) -- Partition key MUST be part of primary key\n) PARTITION BY RANGE (created_at);\n\n-- Create monthly child partitions\nCREATE TABLE events_2026_01 PARTITION OF events\n    FOR VALUES FROM (\'2026-01-01 00:00:00+00\') TO (\'2026-02-01 00:00:00+00\');\nCREATE TABLE events_2026_02 PARTITION OF events\n    FOR VALUES FROM (\'2026-02-01 00:00:00+00\') TO (\'2026-03-01 00:00:00+00\');\nCREATE TABLE events_default PARTITION OF events DEFAULT;\n```\n\n**2. Partition Pruning:**\n- **Compile-time Pruning**: The query planner analyzes static WHERE clauses (e.g. `WHERE created_at >= \'2026-02-01\'`) and completely excludes non-matching partitions from the plan tree.\n- **Run-time Pruning**: For parameterized queries or subqueries (`WHERE created_at >= $1`), the executor skips reading partition scans during execution.\n\n**3. Primary Key & Indexing Constraint:**\nPostgreSQL does NOT support global indexes across partitions. Any UNIQUE or PRIMARY KEY constraint on the parent table **must** include the partition key (`created_at`).\n\n**4. Zero-Bloat Data Retention:**\nInstead of running `DELETE FROM events WHERE created_at < \'2025-01-01\';` (which writes WAL for millions of dead tuples and causes bloat), you simply execute:\n```sql\nDROP TABLE events_2025_01;\n-- or detach first to avoid holding locks during drop\nALTER TABLE events DETACH PARTITION events_2025_01 CONCURRENTLY;\nDROP TABLE events_2025_01;\n```\nThis operation is instantaneous, drops the underlying storage file at the OS level, and generates negligible WAL.',
    expectedConcepts: [
      'PARTITION BY RANGE syntax and monthly child partitions',
      'Partition key inclusion requirement in primary/unique keys',
      'Compile-time vs run-time partition pruning',
      'DROP TABLE / DETACH PARTITION CONCURRENTLY for instant archiving',
      'Lack of global indexes in PostgreSQL'
    ],
    hints: [
      'In PostgreSQL, why must the partition key be included in every UNIQUE constraint on the partitioned table?',
      'Compare deleting 70 million rows via DELETE vs DROP TABLE.',
      'Check DETACH PARTITION CONCURRENTLY in PG 14+.'
    ],
    followUp: {
      question:
        'When would you choose Hash Partitioning over Range Partitioning, and what are its trade-offs?',
      expectedAnswer:
        'Hash Partitioning (`PARTITION BY HASH (tenant_id)`) is chosen when there is no natural time-series dimension, but you need to distribute concurrent writes and high-volume data evenly across N partitions (e.g., 16 or 32 physical tables) to prevent single-table B-Tree lock contention and keep working sets inside memory. The trade-off is that range-based queries scan all hash partitions, and dropping a partition for data retention is impossible.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Provides correct DDL for partitioned table and child tables',
        'Explains why partition key must be part of primary key',
        'Explains compile-time and run-time partition pruning',
        'Demonstrates DROP / DETACH PARTITION for zero-bloat archiving'
      ]
    }
  },
  {
    id: 'sql-tier3-007',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 7,
    title: 'PostgreSQL JSONB: Operators, jsonb_path_query, and GIN Indexing',
    category: 'JSONB and PostgreSQL-specific features',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Your e-commerce product catalog stores dynamic technical specifications in a `specifications JSONB` column. Queries searching for products with `"ram_gb" >= 16` and `"color" IN ("space_gray", "silver")` are performing full table scans.',
    questionStatement:
      'Compare JSON vs JSONB in PostgreSQL. Explain the core operators (`->`, `->>`, `@>`, `?`, `@@`). Write a query using PostgreSQL SQL/JSON path syntax (`jsonb_path_query` or `jsonb_path_match`) and specify the exact GIN index required to index deep key-value lookups efficiently.',
    referenceAnswer:
      '**1. JSON vs JSONB:**\n- `JSON` stores exact plain text (preserves whitespace, key order, duplicate keys). Parsing is deferred to query time on every read.\n- `JSONB` stores decomposed binary format. Removes whitespace, deduplicates keys, sorts keys for binary search. Slightly slower on write, but orders of magnitude faster on read and supports indexing.\n\n**2. Core JSONB Operators:**\n- `->`: Extracts JSON element by key or array index as `JSONB`.\n- `->>`: Extracts JSON element as scalar `TEXT`.\n- `@>`: Containment operator (checks if left JSONB contains right JSONB). Returns BOOLEAN.\n- `?`: Checks if string exists as top-level key in JSONB.\n- `@@` / `@?`: SQL/JSON path evaluation operators (PG 12+).\n\n**3. SQL/JSON Path Query:**\nTo find products where RAM is >= 16:\n```sql\nSELECT id, name, specifications\nFROM products\nWHERE specifications @@ \'$.ram_gb >= 16 && ($.color == "space_gray" || $.color == "silver")\';\n```\n\n**4. Indexing Strategy:**\n```sql\n-- For exact containment (@>) and path queries:\nCREATE INDEX idx_products_specs_gin ON products USING gin (specifications jsonb_path_ops);\n\n-- For numeric comparison inside JSONB, an expression B-tree index is best:\nCREATE INDEX idx_products_ram ON products (((specifications->>\'ram_gb\')::numeric));\n```',
    expectedConcepts: [
      'JSON (text) vs JSONB (decomposed binary) storage format',
      'Difference between -> (jsonb) and ->> (text)',
      'Containment operator @> and existence operator ?',
      'SQL/JSON path expression syntax (@@)',
      'Expression B-tree index vs GIN jsonb_path_ops index'
    ],
    hints: [
      'Which operator returns text versus JSONB?',
      'Can a GIN index accelerate numeric range comparisons like ram_gb >= 16 out of the box?',
      'Consider an expression B-Tree index for scalar casts.'
    ],
    followUp: {
      question:
        'Why does `CREATE INDEX ON products USING gin ((specifications->>\'brand\'))` fail, and what should be used instead?',
      expectedAnswer:
        '`specifications->>\'brand\'` returns a `TEXT` scalar. GIN indexes only support composite or multi-value types (JSONB, arrays, tsvector). To index a scalar text extraction from JSON, you must create a standard B-Tree expression index: `CREATE INDEX idx_brand ON products ((specifications->>\'brand\'));`'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains binary decomposition and indexing differences between JSON and JSONB',
        'Accurately defines ->, ->>, @>, and jsonb path syntax',
        'Recognizes that scalar range queries require expression B-tree indexes',
        'Distinguishes GIN containment from B-tree scalar indexing'
      ]
    }
  },
  {
    id: 'sql-tier3-008',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 8,
    title: 'PostgreSQL Transaction Isolation: Write Skew and Serializable Snapshot Isolation (SSI)',
    category: 'Isolation Levels and MVCC',
    questionType: 'conceptual',
    datasetId: 'loan_management',
    realWorldScenario:
      'In a loan management system, two loan officers simultaneously approve disbursements for the same applicant under `REPEATABLE READ`. The business rule states: "Total active disbursed debt for an applicant cannot exceed $100,000." Both officers see $60,000 active debt and both disburse $30,000. Total debt is now $120,000.',
    questionStatement:
      'Explain why `REPEATABLE READ` allows this Write Skew anomaly while preventing dirty reads and non-repeatable reads. Explain how PostgreSQL implements Serializable Snapshot Isolation (SSI) using SIREAD locks to detect rw-antidependencies and abort conflicting transactions with code `40001 serialization_failure`.',
    referenceAnswer:
      '**1. Why Write Skew Occurs in REPEATABLE READ:**\n- In `REPEATABLE READ`, each transaction takes a single snapshot at its first query.\n- Both transactions read total active debt = $60,000 against their snapshot.\n- Transaction A inserts a $30,000 loan on row X. Transaction B inserts a $30,000 loan on row Y.\n- Because they update/insert different rows, neither transaction experiences a row-level lock conflict, and neither modifies a row modified by the other. Both commit successfully.\n- The invariant ($Total \\le 100,000$) is violated because the business rule spans multiple rows that were read but not locked.\n\n**2. Serializable Snapshot Isolation (SSI) in PostgreSQL:**\n- PostgreSQL implements true `SERIALIZABLE` without locking rows using SSI (Michael J. Cahill algorithm).\n- It tracks **SIREAD locks** (predicate locks) in memory on tuples, pages, and relations read during the transaction.\n- SSI monitors for **rw-antidependencies** (where transaction $T_1$ reads data that concurrent transaction $T_2$ overwrites or inserts into).\n- When SSI detects a dangerous structure (a cycle of dependencies $T_1 \\to T_2 \\to T_1$), it aborts one of the transactions with `SQLSTATE 40001: serialization_failure`.\n- Any application using `SERIALIZABLE` **must** implement client-side transaction retry loops.',
    expectedConcepts: [
      'Write Skew anomaly definition on overlapping disjoint rows',
      'Why Repeatable Read only protects against single-row concurrent updates',
      'SSI (Serializable Snapshot Isolation) and non-blocking SIREAD locks',
      'rw-antidependency tracking and dependency cycle detection',
      'SQLSTATE 40001 serialization_failure and retry logic'
    ],
    hints: [
      'Remember that two concurrent inserts create new primary keys, so they do not lock each other.',
      'SIREAD locks are not traditional heavy locks; they do not block execution.',
      'What must application code do when a 40001 error occurs?'
    ],
    followUp: {
      question:
        'If you do not want to use SERIALIZABLE isolation, how can you prevent write skew in READ COMMITTED mode using explicit locking?',
      expectedAnswer:
        'You can serialize the check using an explicit lock: either lock the parent customer record with `SELECT id FROM customers WHERE id = $1 FOR UPDATE;` (which forces subsequent transactions for that customer to wait until the first commits), or acquire an advisory lock on the customer ID: `SELECT pg_advisory_xact_lock($1);`.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Defines Write Skew and explains why Repeatable Read fails to prevent it',
        'Explains SSI mechanics and non-blocking SIREAD predicate locks',
        'Identifies rw-antidependency cycles as the abort trigger',
        'Highlights application retry requirement for SQLSTATE 40001'
      ]
    }
  },
  {
    id: 'sql-tier3-009',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 9,
    title: 'Advisory Locks: Application-Level Distributed Locking in Postgres',
    category: 'Locks and Deadlocks',
    questionType: 'conceptual',
    datasetId: 'loan_management',
    realWorldScenario:
      'Your microservices backend must execute a monthly interest accrual batch job. Three container instances run concurrently. If two containers run the job simultaneously for the same loan portfolio, interest is doubled.',
    questionStatement:
      'Compare PostgreSQL Advisory Locks with row-level locks (`SELECT FOR UPDATE`). Explain the differences between session-level and transaction-level advisory locks (`pg_advisory_lock` vs `pg_advisory_xact_lock`), and between blocking and non-blocking variants (`pg_try_advisory_lock`).',
    referenceAnswer:
      '**1. Advisory Locks vs Row-Level Locks:**\n- Row-level locks (`FOR UPDATE`) require an actual physical row in a table. They create tuple-level write locks and record XIDs in heap pages.\n- Advisory Locks are lightweight, application-defined locks stored purely in the server’s shared memory lock table (the `PROCLOCK` / `LOCK` structures). They do not require any table or row and do not touch disk.\n- They take an arbitrary 64-bit integer (or two 32-bit integers) as the lock identifier (e.g. hash of entity name + ID).\n\n**2. Transaction-Level vs Session-Level:**\n- `pg_advisory_xact_lock(key)`: Automatically released when the surrounding transaction commits or rolls back. Safe against connection leaks, ideal for short-lived business operations.\n- `pg_advisory_lock(key)`: Tied to the client database session (TCP connection). Persists across transactions until explicitly released with `pg_advisory_unlock(key)` or until the connection terminates. Dangerous with connection poolers like PgBouncer in transaction pooling mode.\n\n**3. Blocking vs Non-Blocking:**\n- `pg_advisory_xact_lock(key)`: Blocks and waits until the lock is available.\n- `pg_try_advisory_xact_lock(key)`: Returns `TRUE` immediately if lock acquired; returns `FALSE` immediately without waiting if already held by another session. Ideal for cron jobs that should skip if already running.',
    expectedConcepts: [
      'In-memory lock table without table/row dependency',
      '64-bit integer or (int4, int4) key space',
      'Transaction-scoped (xact) vs session-scoped locks',
      'pg_try_advisory_xact_lock non-blocking semantics for idempotent jobs',
      'PgBouncer transaction-mode danger with session-level advisory locks'
    ],
    hints: [
      'What happens if a session-level lock is used with PgBouncer transaction pooling?',
      'Which function returns a boolean immediately instead of blocking?'
    ],
    followUp: {
      question:
        'What disaster occurs if an application uses session-level `pg_advisory_lock()` through PgBouncer configured in `pool_mode = transaction`?',
      expectedAnswer:
        'In transaction pooling mode, PgBouncer assigns a backend server connection to a client for only a single transaction, then returns that connection to the pool for reuse by any other client. The session-level advisory lock remains active on that backend connection, causing subsequent unrelated transactions from different users to fail or inherit unauthorized lock state.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Differentiates in-memory advisory locks from row-level locks',
        'Distinguishes transaction-level from session-level lifecycles',
        'Explains non-blocking pg_try variants',
        'Warns about session advisory lock danger with PgBouncer transaction pooling'
      ]
    }
  },
  {
    id: 'sql-tier3-010',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 10,
    title: 'Hierarchical Queries with Recursive CTEs (WITH RECURSIVE)',
    category: 'Subqueries and CTEs',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Your product catalog supports deep nested product categories (e.g., Electronics -> Audio -> Headphones -> Wireless Headphones). You need to generate the full breadcrumb path and depth level for every category.',
    questionStatement:
      'Write a query using a recursive Common Table Expression (`WITH RECURSIVE`) against a hierarchical table of categories (`id`, `parent_id`, `name`) that calculates the complete ancestor path (`breadcrumb`) and hierarchical depth level for each category, ordered by path.',
    starterCode:
      'WITH RECURSIVE category_tree AS (\n    -- Anchor member\n    SELECT \n        id, \n        parent_id, \n        name,\n        1 AS depth,\n        name AS breadcrumb\n    FROM categories\n    WHERE parent_id IS NULL\n    \n    UNION ALL\n    \n    -- Recursive member\n    SELECT \n        c.id, \n        c.parent_id, \n        c.name,\n        ct.depth + 1,\n        ct.breadcrumb || \' > \' || c.name\n    FROM categories c\n    JOIN category_tree ct ON c.parent_id = ct.id\n)\nSELECT id, name, depth, breadcrumb\nFROM category_tree\nORDER BY breadcrumb;',
    sqlSolution:
      'WITH RECURSIVE category_tree AS (\n    SELECT \n        id, \n        parent_id, \n        name,\n        1 AS depth,\n        name AS breadcrumb\n    FROM categories\n    WHERE parent_id IS NULL\n    \n    UNION ALL\n    \n    SELECT \n        c.id, \n        c.parent_id, \n        c.name,\n        ct.depth + 1,\n        ct.breadcrumb || \' > \' || c.name\n    FROM categories c\n    JOIN category_tree ct ON c.parent_id = ct.id\n)\nSELECT id, name, depth, breadcrumb\nFROM category_tree\nORDER BY breadcrumb;',
    referenceAnswer:
      'Recursive CTEs in SQL consist of two parts united by `UNION ALL` (or `UNION`):\n\n1. **Anchor Member**: The base query executed once to initialize the intermediate working table (e.g. root nodes where `parent_id IS NULL`).\n2. **Recursive Member**: The query that references the CTE itself, executing iteratively on the rows returned by the previous iteration until it returns an empty result set.\n\n```sql\nWITH RECURSIVE category_tree AS (\n    -- Anchor: top-level roots\n    SELECT \n        id, parent_id, name,\n        1 AS depth,\n        CAST(name AS VARCHAR(1000)) AS breadcrumb\n    FROM categories\n    WHERE parent_id IS NULL\n    \n    UNION ALL\n    \n    -- Recursive: children join to current working table\n    SELECT \n        c.id, c.parent_id, c.name,\n        ct.depth + 1,\n        CAST(ct.breadcrumb || \' > \' || c.name AS VARCHAR(1000))\n    FROM categories c\n    JOIN category_tree ct ON c.parent_id = ct.id\n)\nSELECT id, name, depth, breadcrumb\nFROM category_tree\nORDER BY breadcrumb;\n```',
    expectedConcepts: [
      'Anchor query selecting base root records',
      'Recursive query joining child records to working CTE table',
      'Termination condition when recursive join returns 0 rows',
      'Depth counting and string path accumulation'
    ],
    hints: [
      'Start with rows where parent_id IS NULL as the anchor.',
      'In the recursive part, join categories to category_tree on c.parent_id = ct.id.',
      'Increment depth by 1 and concatenate breadcrumb on each step.'
    ],
    followUp: {
      question:
        'How do you prevent infinite recursion in a recursive CTE if the data contains a cyclic graph (e.g., node A is parent of B, B is parent of A)?',
      expectedAnswer:
        'In PostgreSQL 14+, you can use the `CYCLE` clause: `CYCLE id SET is_cycle USING path`. In older versions, accumulate visited IDs in an array (`ARRAY[id]`) and add a termination guard in the recursive member: `WHERE NOT (c.id = ANY(ct.visited_ids))`.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Correctly structures anchor query with parent_id IS NULL',
        'Correctly structures recursive member with parent-child join',
        'Accurately computes depth and breadcrumb path string',
        'Explains cycle prevention techniques'
      ]
    },
    testCases: [
      {
        id: 'tc-tier3-010-1',
        description: 'Verify category tree breadcrumb and depth calculation',
        setupSql:
          'CREATE TABLE categories (id INT PRIMARY KEY, parent_id INT, name VARCHAR(50));\nINSERT INTO categories VALUES (1, NULL, \'Electronics\'), (2, 1, \'Computers\'), (3, 2, \'Laptops\'), (4, 1, \'Audio\'), (5, 4, \'Headphones\');',
        expectedOutputSql:
          'WITH RECURSIVE category_tree AS (\n    SELECT id, parent_id, name, 1 AS depth, name AS breadcrumb\n    FROM categories WHERE parent_id IS NULL\n    UNION ALL\n    SELECT c.id, c.parent_id, c.name, ct.depth + 1, ct.breadcrumb || \' > \' || c.name\n    FROM categories c JOIN category_tree ct ON c.parent_id = ct.id\n)\nSELECT id, name, depth, breadcrumb FROM category_tree ORDER BY breadcrumb;',
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier3-011',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 11,
    title: 'Row-Level Security (RLS) for Multi-Tenant Database Architecture',
    category: 'Database Security and Permissions',
    questionType: 'conceptual',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'A multi-tenant SaaS application shares a single PostgreSQL database across 1,200 enterprise tenants. An engineer accidentally forgets `WHERE tenant_id = ?` in a new microservice endpoint, exposing Tenant A’s data to Tenant B.',
    questionStatement:
      'Design an end-to-end Row-Level Security (RLS) policy in PostgreSQL that guarantees tenant isolation at the database engine level. Explain `ENABLE ROW LEVEL SECURITY`, `FORCE ROW LEVEL SECURITY`, setting session context via `current_setting()`, and why `SUPERUSER` or `BYPASSRLS` roles can bypass tenant isolation.',
    referenceAnswer:
      '**1. Enabling and Forcing RLS:**\n```sql\n-- Enable RLS on multi-tenant table\nALTER TABLE invoices ENABLE ROW LEVEL SECURITY;\n\n-- CRITICAL: Prevent table owner from accidentally bypassing RLS\nALTER TABLE invoices FORCE ROW LEVEL SECURITY;\n```\n\n**2. Implementing RLS Policies using Session Context:**\n```sql\n-- Create isolation policy based on runtime session variable\nCREATE POLICY tenant_isolation_policy ON invoices\n    FOR ALL\n    USING (tenant_id = NULLIF(current_setting(\'app.current_tenant_id\', true), \'\')::int)\n    WITH CHECK (tenant_id = NULLIF(current_setting(\'app.current_tenant_id\', true), \'\')::int);\n```\n\n**3. Application Runtime Flow:**\nWhen a connection is checked out from the connection pool:\n```sql\n-- Set tenant context for this specific transaction\nSET LOCAL app.current_tenant_id = \'42\';\n\n-- Application query without explicit WHERE clause:\nSELECT * FROM invoices; -- PostgreSQL automatically rewrites query to enforce tenant_id = 42\n```\n\n**4. Security Pitfalls & Bypass Hazards:**\n- `SUPERUSER` and roles with `BYPASSRLS` attribute ignore RLS completely. The application backend must connect as an unprivileged role without `BYPASSRLS`.\n- Without `FORCE ROW LEVEL SECURITY`, the table owner role bypasses RLS policies.\n- `SET LOCAL` ensures the session variable is automatically cleared at transaction boundaries, preventing leakage across pooled connections.',
    expectedConcepts: [
      'ALTER TABLE ENABLE ROW LEVEL SECURITY',
      'FORCE ROW LEVEL SECURITY to restrict table owners',
      'current_setting(key, true) runtime session context',
      'USING (for read/delete) vs WITH CHECK (for insert/update)',
      'SET LOCAL transaction scoping in pooled connections',
      'BYPASSRLS and SUPERUSER privilege risks'
    ],
    hints: [
      'What happens if the table owner executes a query without FORCE ROW LEVEL SECURITY?',
      'How does SET LOCAL ensure tenant ID does not leak to the next client using the pooled connection?',
      'Difference between USING (filtering existing rows) and WITH CHECK (validating inserted/updated rows).'
    ],
    followUp: {
      question:
        'Why can a query with a leakproof user-defined function or side-channel error reveal unauthorized tenant data even under RLS?',
      expectedAnswer:
        'If a query contains functions or operators that are not marked `LEAKPROOF`, the query optimizer may push user-provided WHERE filters ahead of the RLS security barrier filter to optimize performance. A malicious user could craft an expression like `WHERE 1 / (CASE WHEN secret_col = \'target\' THEN 0 ELSE 1 END) = 1` that throws a divide-by-zero error, leaking information about unauthorized rows before the RLS condition filters them.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Provides correct RLS DDL with ENABLE and FORCE',
        'Implements USING and WITH CHECK with session setting',
        'Explains SET LOCAL transaction isolation in connection pools',
        'Details SUPERUSER / BYPASSRLS bypass risks'
      ]
    }
  },
  {
    id: 'sql-tier3-012',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 12,
    title: 'PgBouncer Connection Pooling: Session vs Transaction vs Statement Modes',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'A Node.js backend running 50 Kubernetes pods establishes 20 connections per pod (1,000 total connections) directly to PostgreSQL. The database server’s memory is exhausted, context switching spikes, and query response time degrades by 800%.',
    questionStatement:
      'Analyze how PgBouncer connection pooling resolves PostgreSQL connection scalability limits. Compare the three pooling modes: Session, Transaction, and Statement. What PostgreSQL features break under Transaction Pooling, and how do you resolve them?',
    referenceAnswer:
      '**1. Why PostgreSQL Needs a Connection Pooler:**\n- PostgreSQL uses a process-based model (`fork()` per client connection). Each backend process allocates private memory (`work_mem`, stack, catalog caches) typically consuming 5-10MB RAM per idle connection.\n- 1,000 idle connections waste 5-10GB RAM, and OS scheduler context switching across hundreds of active processes causes CPU thrashing.\n- Optimal PostgreSQL performance is achieved with active connections $\\approx 2 \\times \\text{CPU cores} + \\text{disk spindle count}$.\n\n**2. PgBouncer Pooling Modes:**\n- **Session Pooling**: A server connection is dedicated to the client for the entire duration of the TCP session. Safest, supports all Postgres features, but lowest concurrency improvement.\n- **Transaction Pooling** (Industry Standard): A server connection is bound to a client only for the duration of a transaction (`BEGIN ... COMMIT`). When the transaction finishes, the server connection returns to the pool for another client. Multiplies throughput by 10-50x.\n- **Statement Pooling**: Server connection is assigned for a single SQL statement. Breaks multi-statement transactions; rarely used.\n\n**3. Features Broken by Transaction Pooling:**\n- `SET` / `RESET` session configuration (e.g. `SET timezone`, `SET search_path`). *Fix*: Use `SET LOCAL` inside transactions.\n- Server-side Prepared Statements (`PREPARE / EXECUTE`). *Fix*: Disable client-side prepared statements or use PgBouncer 1.21+ prepared statement support (`max_prepared_statements`).\n- Session-level advisory locks (`pg_advisory_lock`). *Fix*: Use transaction-level advisory locks (`pg_advisory_xact_lock`).\n- `LISTEN` / `NOTIFY`. *Fix*: Dedicate a small unpooled connection pool for pub/sub.\n- Temporary tables (`CREATE TEMP TABLE`). *Fix*: Avoid temp tables; use unlogged tables with transaction IDs or CTEs.',
    expectedConcepts: [
      'PostgreSQL process-based architecture (fork) and memory overhead per connection',
      'Session vs Transaction vs Statement pooling comparison',
      'Features broken by transaction pooling: SET, PREPARE, temp tables, LISTEN/NOTIFY, session advisory locks',
      'SET LOCAL and transaction-level alternatives'
    ],
    hints: [
      'Why does PostgreSQL use more memory per connection than MySQL or threaded databases?',
      'What happens to prepared statements when a subsequent query in the session executes on a different backend connection?',
      'Why does PgBouncer transaction mode break LISTEN / NOTIFY?'
    ],
    followUp: {
      question:
        'How does PgBouncer 1.21+ allow named prepared statements to work in transaction pooling mode?',
      expectedAnswer:
        'PgBouncer 1.21+ intercepts protocol-level `Parse` and `Bind` messages. It tracks prepared statements created by clients, assigns internal unique hashes, and automatically transparently prepares the statement on whichever server backend connection is assigned to the transaction before binding and executing.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains process-per-connection architecture and memory footprint',
        'Compares Session, Transaction, and Statement pooling modes',
        'Itemizes features broken under transaction pooling',
        'Provides workarounds (SET LOCAL, max_prepared_statements)'
      ]
    }
  },
  {
    id: 'sql-tier3-013',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 13,
    title: 'PostgreSQL LISTEN and NOTIFY: Pub/Sub Architecture and Queue Hazards',
    category: 'PostgreSQL Data Types',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'An engineering team implements an event-driven microservice using PostgreSQL `LISTEN` and `NOTIFY` triggers on the `orders` table to notify a webhook service. During Black Friday, the database logs warnings about the notification queue filling up.',
    questionStatement:
      'Explain how `LISTEN` and `NOTIFY` work internally in PostgreSQL. Where is the notification queue stored, what are the payload size limitations, and what occurs when the queue overflows? When should you use LISTEN/NOTIFY vs an external message broker like Kafka or RabbitMQ?',
    referenceAnswer:
      '**1. Internal Architecture:**\n- PostgreSQL implements `LISTEN / NOTIFY` via an in-memory ring buffer (default 8GB or 8MB depending on version, managed in shared memory) and the `pg_notify` SLRU (Simple Least Recently Used) cache.\n- When a backend runs `NOTIFY channel, payload;`, the notification is buffered in backend private memory until the transaction **commits**. If the transaction rolls back, nothing is sent.\n- At commit, the message is written into the global notification queue and a signal is sent to listening client backends.\n\n**2. Constraints and Limitations:**\n- **Payload Limit**: Exactly 8000 bytes per notification string.\n- **Queue Overflow**: If listening clients disconnect, stall, or read too slowly, unconsumed notifications accumulate in the queue. If the queue reaches 50% capacity, Postgres logs warnings. If it fills 100%, PostgreSQL **aborts all transactions that attempt to send NOTIFY** with an error: `queue is full`.\n- **Ephemeral Delivery**: Notifications are not persisted to tables. A subscriber that is disconnected while a message is sent will never receive it.\n\n**3. Best Practice vs External Brokers:**\n- *Use LISTEN/NOTIFY*: Low-throughput cache invalidation signals, UI notifications, or triggering an asynchronous worker when a table changes.\n- *Use Kafka / RabbitMQ*: High-throughput event streams, durable message persistence, guaranteed at-least-once delivery, horizontal consumer group scaling.',
    expectedConcepts: [
      'Transactional guarantees (NOTIFY is sent only upon commit)',
      '8000 byte payload ceiling',
      'Shared memory SLRU queue and queue overflow aborting transactions',
      'Ephemeral nature (no message durability for offline listeners)',
      'Appropriate use cases vs external message queues'
    ],
    hints: [
      'Does NOTIFY deliver messages if the enclosing transaction rolls back?',
      'What happens if an unconsumed listener hangs for 4 hours while millions of notifications are fired?',
      'Payload limit is 8000 bytes.'
    ],
    followUp: {
      question:
        'How can an application combine PostgreSQL tables with LISTEN/NOTIFY to achieve durable, at-least-once message processing without losing notifications?',
      expectedAnswer:
        'The Transactional Outbox pattern: write the event payload into an `outbox` table in the exact same ACID transaction as the business entity update, then issue an empty `NOTIFY outbox_channel;` signal. Workers wake up on NOTIFY and query the `outbox` table for unprocessed rows. If workers are offline or the queue drops notifications, workers poll the outbox table on startup, guaranteeing zero message loss.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Explains commit-bound transactional delivery semantics',
        'Identifies 8000-byte limit and SLRU queue architecture',
        'Details queue overflow failure mode (aborts committing transactions)',
        'Synthesizes Transactional Outbox pattern to overcome ephemeral limitation'
      ]
    }
  },
  {
    id: 'sql-tier3-014',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 14,
    title: 'Materialized Views with REFRESH CONCURRENTLY',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'An executive analytics dashboard aggregates customer lifetime spend and average order values across 10 million orders. The query takes 14 seconds. Running a normal `REFRESH MATERIALIZED VIEW` locks out all dashboard reads for 45 seconds.',
    questionStatement:
      'Explain how `MATERIALIZED VIEW` works in PostgreSQL. What is the difference between standard `REFRESH` and `REFRESH MATERIALIZED VIEW CONCURRENTLY`? What prerequisite must be met to allow concurrent refresh, and what are the performance trade-offs?',
    referenceAnswer:
      '**1. Materialized View Fundamentals:**\n- A standard PostgreSQL `VIEW` is a stored query that is evaluated on every execution.\n- A `MATERIALIZED VIEW` stores the physical result of the query on disk in a heap table, allowing indexes to be built on it and delivering sub-millisecond read access.\n\n**2. Standard vs Concurrent Refresh:**\n- **Standard REFRESH**: Acquires an `ACCESS EXCLUSIVE` lock on the materialized view. It completely locks out all concurrent reads (`SELECT`) while it recalculates the view and replaces the heap file. Any read query blocks until refresh completes.\n- **REFRESH CONCURRENTLY**: Acquires only an `EXCLUSIVE` lock. Concurrent reads (`SELECT`) continue without blocking, reading the old version of the view while the refresh is underway.\n\n**3. Prerequisite for CONCURRENT:**\nThe materialized view **must have at least one UNIQUE index** on a column or set of columns with no `WHERE` clause. Postgres uses this unique index to perform an in-place diff (inserting new rows, updating modified rows, and deleting removed rows) between the old data and the newly computed result.\n\n**4. Trade-offs:**\n- Concurrent refresh is slower and consumes significantly more temporary disk space and WAL because it must write the new query result to a temporary table, perform diff joins against the existing unique index, and apply atomic row updates.',
    expectedConcepts: [
      'ACCESS EXCLUSIVE lock of standard refresh blocking concurrent reads',
      'REFRESH CONCURRENTLY allowing concurrent SELECT queries',
      'Mandatory UNIQUE index requirement without partial clauses',
      'Diff calculation mechanics using temporary table and unique key',
      'Performance and WAL trade-offs of concurrent refresh'
    ],
    hints: [
      'What lock level does standard REFRESH acquire on the table?',
      'Why does Postgres need a unique index to refresh concurrently?',
      'Think about how Postgres compares old rows with new rows.'
    ],
    followUp: {
      question:
        'Can a materialized view with `REFRESH MATERIALIZED VIEW CONCURRENTLY` be updated incrementally (only calculating rows changed since last refresh)?',
      expectedAnswer:
        'No. PostgreSQL core does not support Incremental View Maintenance (IVM). Every refresh re-executes the complete underlying query from scratch and diffs the entire result set against the existing view. For true incremental updates, extensions like `pg_ivm` or trigger-based rollup tables are required.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Differentiates ACCESS EXCLUSIVE from EXCLUSIVE lock modes',
        'States mandatory requirement for a non-partial UNIQUE index',
        'Explains diff mechanism and why concurrent refresh is slower',
        'Recognizes lack of core Incremental View Maintenance (IVM)'
      ]
    }
  },
  {
    id: 'sql-tier3-015',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 15,
    title: 'Window Frame Specifications: ROWS vs RANGE vs GROUPS',
    category: 'Window Functions',
    questionType: 'executable',
    datasetId: 'loan_management',
    realWorldScenario:
      'A financial risk officer needs a 3-day rolling sum of repayments per borrower to detect repayment surges. Because multiple repayments occur on the same day, using `ROWS BETWEEN` produces different totals depending on arbitrary row sorting.',
    questionStatement:
      'Explain the difference between `ROWS`, `RANGE`, and `GROUPS` framing modes in SQL window functions. Write a query against `repayments` that calculates both a 2-row physical moving average (`ROWS`) and a calendar-date-based rolling 3-day sum (`RANGE`) per loan.',
    starterCode:
      'SELECT \n    id,\n    loan_id,\n    payment_date,\n    amount,\n    -- 2-row moving average (current row and 1 preceding physical row)\n    AVG(amount) OVER (\n        PARTITION BY loan_id \n        ORDER BY payment_date, id \n        ROWS BETWEEN 1 PRECEDING AND CURRENT ROW\n    ) AS physical_2row_avg,\n    -- Rolling sum over identical dates\n    SUM(amount) OVER (\n        PARTITION BY loan_id \n        ORDER BY amount\n        RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS range_accum_sum\nFROM repayments\nORDER BY loan_id, payment_date;',
    sqlSolution:
      'SELECT \n    id,\n    loan_id,\n    payment_date,\n    amount,\n    AVG(amount) OVER (\n        PARTITION BY loan_id \n        ORDER BY payment_date, id \n        ROWS BETWEEN 1 PRECEDING AND CURRENT ROW\n    ) AS physical_2row_avg,\n    SUM(amount) OVER (\n        PARTITION BY loan_id \n        ORDER BY amount\n        RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS range_accum_sum\nFROM repayments\nORDER BY loan_id, payment_date;',
    referenceAnswer:
      '**1. Frame Mode Differences:**\n- **ROWS**: Operates on physical row offsets relative to current row regardless of duplicate values in `ORDER BY`. `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW` always evaluates exactly 1 or 2 physical rows.\n- **RANGE**: Operates on logical value offsets of the `ORDER BY` expression. All peer rows with identical `ORDER BY` values are included in the frame together. In PostgreSQL 11+, supports numeric/date intervals (e.g. `RANGE BETWEEN \'3 days\' PRECEDING AND CURRENT ROW`).\n- **GROUPS**: Operates on groups of tied peer values. `GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW` includes the current group of tied values plus the single preceding group of tied values.\n\n**2. Default Frame Hazard:**\nWhen `ORDER BY` is specified without an explicit frame, the SQL standard default is:\n`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`\nThis default causes peer rows with tied values to sum together unexpectedly rather than evaluating sequentially row-by-row.',
    expectedConcepts: [
      'ROWS operates on physical row offsets',
      'RANGE operates on logical value boundaries (peers lumped together)',
      'GROUPS operates on peer rank clusters',
      'Default window frame trap: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW'
    ],
    hints: [
      'Notice that if two rows have the same amount, RANGE treats them as tied peers.',
      'ROWS treats every row distinctly based on physical sequence.',
      'Check the default frame when ORDER BY is provided.'
    ],
    followUp: {
      question:
        'Why can `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` cause significant performance degradation compared to `ROWS`?',
      expectedAnswer:
        'With `ROWS`, the window executor maintains a simple running state (accumulating one value and subtracting one value per row). With `RANGE`, Postgres must inspect peer rows to find ties, requiring buffering and re-evaluating peer groups, which prevents certain streaming window aggregate optimizations.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Differentiates ROWS, RANGE, and GROUPS clearly',
        'Explains peer group tie behavior in RANGE',
        'Identifies the default frame trap in SQL standard',
        'Produces valid SQL demonstrating both framing modes'
      ]
    },
    testCases: [
      {
        id: 'tc-tier3-015-1',
        description: 'Verify ROWS physical average and RANGE cumulative calculations',
        setupSql:
          'CREATE TABLE repayments (id INT, loan_id INT, payment_date VARCHAR(10), amount NUMERIC);\nINSERT INTO repayments VALUES (1, 101, \'2026-01-01\', 100), (2, 101, \'2026-01-02\', 200), (3, 101, \'2026-01-03\', 300);',
        expectedOutputSql:
          'SELECT id, loan_id, payment_date, amount, AVG(amount) OVER (PARTITION BY loan_id ORDER BY payment_date, id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS physical_2row_avg, SUM(amount) OVER (PARTITION BY loan_id ORDER BY amount RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS range_accum_sum FROM repayments ORDER BY loan_id, payment_date;',
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier3-016',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 16,
    title: 'PostgreSQL Join Strategies: Nested Loop, Hash Join, and Merge Join',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'While reviewing query plans across your application, you observe that joining `customers` (50,000 rows) and `orders` (2,000,000 rows) sometimes uses a Nested Loop, sometimes a Hash Join, and occasionally a Merge Join.',
    questionStatement:
      'Analyze the three fundamental join algorithms in the PostgreSQL query engine: Nested Loop (with and without index), Hash Join, and Merge Join. Detail the memory prerequisites (`work_mem`), sort requirements, time complexity, and the specific cost trade-offs that drive the optimizer’s choice.',
    referenceAnswer:
      '**1. Nested Loop Join:**\n- **Mechanism**: For each outer row, scans the inner relation looking for matching rows.\n- **Indexed Nested Loop**: If the inner relation has an index on the join key, lookup cost is $O(M \\cdot \\log N)$. Ideal when the outer relation has very few rows (e.g. 1 to 500 rows) filtered by a selective WHERE clause.\n- **Non-Indexed Nested Loop**: $O(M \\cdot N)$ cartesian scan; disastrous for large tables.\n\n**2. Hash Join:**\n- **Mechanism**: Reads the entire inner (smaller) relation into an in-memory hash table in `work_mem` using a hash function on the join key. Then sequentially scans the outer relation, probing the hash table for matches.\n- **Complexity**: $O(M + N)$ linear time. Ideal for large, unsorted datasets with equality join predicates (`=`).\n- **Memory & Batching**: If the hash table exceeds `work_mem`, Postgres switches to a multi-batch Hash Join (spilling partition buckets to disk via temporary files), causing significant disk I/O.\n\n**3. Merge Join:**\n- **Mechanism**: Requires both relations to be pre-sorted on the join keys. Two cursors advance in parallel down both inputs simultaneously like a zip.\n- **Complexity**: $O(M + N)$ scan time after sorting. Ideal when inputs are already sorted (e.g. from B-tree index scans or explicit ORDER BY) or when join condition involves inequality operators with sorting.',
    expectedConcepts: [
      'Nested loop optimal for tiny outer set + indexed inner lookup',
      'Hash join builds hash table in work_mem and probes with outer scan',
      'Multi-batch hash join spilling to disk when exceeding work_mem',
      'Merge join requires pre-sorted inputs (B-tree or explicit sort)',
      'Time complexity comparison across all three'
    ],
    hints: [
      'Which join strategy builds an in-memory hash table on the smaller table?',
      'Which join requires both inputs to be sorted on the join key first?',
      'What happens when a Hash Join exceeds work_mem?'
    ],
    followUp: {
      question:
        'Why would the query planner choose a Nested Loop over a Hash Join even when joining a 1-million row table, and how can stale statistics cause a disastrous plan regression here?',
      expectedAnswer:
        'If stale statistics cause the planner to underestimate the outer relation’s row count (e.g., predicting 1 row when 200,000 actually match), it chooses an Indexed Nested Loop because 1 index seek is cheaper than building a hash table. In reality, executing 200,000 random index seeks takes minutes instead of milliseconds. Running `ANALYZE` updates table statistics and restores the Hash Join.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Describes inner/outer mechanics of all three join types',
        'Explains memory and work_mem spilling in Hash Join',
        'Identifies pre-sorted requirement for Merge Join',
        'Explains how cardinality misestimation triggers bad Nested Loop plans'
      ]
    }
  },
  {
    id: 'sql-tier3-017',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 17,
    title: 'Zero-Downtime Schema Migrations: Safe Index Creation & Column Additions',
    category: 'Migrations and Schema Evolution',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A developer deploys a migration to add a non-null column with a default value and an index on a 40-million row `orders` table during peak traffic: `ALTER TABLE orders ADD COLUMN tracking_code VARCHAR(64) DEFAULT \'PENDING\' NOT NULL; CREATE INDEX idx_orders_tracking ON orders(tracking_code);`. The entire API locks up and crashes.',
    questionStatement:
      'Identify the lock types acquired by standard DDL commands. Why did this migration cause API downtime? Write the safe, zero-downtime PostgreSQL procedure to add a column with a default value, enforce NOT NULL, and build the index on a live high-traffic table.',
    referenceAnswer:
      '**1. Why the Migration Crashed Production:**\n- `CREATE INDEX` takes a `SHARE` lock on the table, which blocks all concurrent `INSERT`, `UPDATE`, and `DELETE` transactions until the entire index is built across 40M rows (several minutes).\n- Incoming write queries queue behind the lock. Subsequent read queries queue behind the waiting writes, exhausting the connection pool and causing complete API failure.\n- (Note: In PG 11+, `ADD COLUMN ... DEFAULT ... NOT NULL` is fast metadata-only, but in PG 10 and below it rewritten the entire table under `ACCESS EXCLUSIVE` lock).\n\n**2. The Safe Zero-Downtime Recipe:**\n\n```sql\n-- Step 1: Add column as nullable without default (instant metadata-only lock)\nALTER TABLE orders ADD COLUMN tracking_code VARCHAR(64);\n\n-- Step 2: Set default for future inserts (metadata only)\nALTER TABLE orders ALTER COLUMN tracking_code SET DEFAULT \'PENDING\';\n\n-- Step 3: Backfill existing rows in small batches (e.g., 5,000 rows per transaction) to avoid locks\n-- (Executed via background worker script: UPDATE orders SET tracking_code = \'PENDING\' WHERE tracking_code IS NULL AND id BETWEEN ...)\n\n-- Step 4: Add NOT NULL check constraint without validating table\nALTER TABLE orders ADD CONSTRAINT chk_tracking_not_null CHECK (tracking_code IS NOT NULL) NOT VALID;\n\n-- Step 5: Validate constraint concurrently (acquires only SHARE UPDATE EXCLUSIVE lock; reads do not block writes)\nALTER TABLE orders VALIDATE CONSTRAINT chk_tracking_not_null;\n\n-- Step 6: Create index concurrently without blocking writes\nCREATE INDEX CONCURRENTLY idx_orders_tracking ON orders(tracking_code);\n```',
    expectedConcepts: [
      'SHARE lock of standard CREATE INDEX blocking all writes',
      'Lock queue pileup: writes blocked by DDL, reads blocked by queued writes',
      'CREATE INDEX CONCURRENTLY using 2-pass table scan',
      'NOT VALID check constraint followed by VALIDATE CONSTRAINT',
      'Batch backfilling to prevent transaction lock exhaustion'
    ],
    hints: [
      'What lock does CREATE INDEX require versus CREATE INDEX CONCURRENTLY?',
      'How does CREATE INDEX CONCURRENTLY avoid blocking writes?',
      'Why should you validate check constraints in a separate statement?'
    ],
    followUp: {
      question:
        'What does `CREATE INDEX CONCURRENTLY` do if it fails midway (e.g. due to a unique constraint violation or deadlock)? What state is the index left in, and how do you fix it?',
      expectedAnswer:
        'If it fails, Postgres leaves an `INVALID` index in place (`idx_orders_tracking INVALID`). It will not be used for queries, but it will still be updated on every INSERT/UPDATE/DELETE, causing write overhead and bloat. You must drop it (`DROP INDEX CONCURRENTLY idx_orders_tracking;`) and investigate the failure before retrying.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains lock queue cascading failure caused by standard CREATE INDEX',
        'Specifies CREATE INDEX CONCURRENTLY',
        'Uses NOT VALID and VALIDATE CONSTRAINT for zero-downtime NOT NULL',
        'Explains invalid index state on concurrent build failure'
      ]
    }
  },
  {
    id: 'sql-tier3-018',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 18,
    title: 'Advisory Locks vs FOR UPDATE SKIP LOCKED for Message Queues',
    category: 'Locks and Deadlocks',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'You are building a background task processor where multiple worker processes concurrently poll an `outbox_events` table to process and publish pending events. Standard `SELECT ... FOR UPDATE` causes workers to block each other and serialize execution.',
    questionStatement:
      'Compare `SELECT FOR UPDATE`, `SELECT FOR UPDATE NOWAIT`, and `SELECT FOR UPDATE SKIP LOCKED`. Write a concurrency-safe worker query that claims exactly 5 unprocessed events, locks them so no other worker can touch them, and updates their status to `PROCESSING` in an atomic transaction.',
    starterCode:
      '-- Concurrently safe job queue claim query\nWITH claimed_jobs AS (\n    SELECT id\n    FROM outbox_events\n    WHERE status = \'PENDING\'\n    ORDER BY id ASC\n    LIMIT 5\n    FOR UPDATE SKIP LOCKED\n)\nUPDATE outbox_events\nSET \n    status = \'PROCESSING\',\n    processed_at = CURRENT_TIMESTAMP\nFROM claimed_jobs\nWHERE outbox_events.id = claimed_jobs.id\nRETURNING outbox_events.id, outbox_events.payload, outbox_events.status;',
    sqlSolution:
      'WITH claimed_jobs AS (\n    SELECT id\n    FROM outbox_events\n    WHERE status = \'PENDING\'\n    ORDER BY id ASC\n    LIMIT 5\n    FOR UPDATE SKIP LOCKED\n)\nUPDATE outbox_events\nSET \n    status = \'PROCESSING\',\n    processed_at = CURRENT_TIMESTAMP\nFROM claimed_jobs\nWHERE outbox_events.id = claimed_jobs.id\nRETURNING outbox_events.id, outbox_events.payload, outbox_events.status;',
    referenceAnswer:
      '**1. Comparison of Locking Modifiers:**\n- `FOR UPDATE`: Acquires row-level exclusive locks. If another transaction holds a lock on a row, the current query **blocks and waits** until the other transaction commits or aborts.\n- `FOR UPDATE NOWAIT`: Attempts to lock the rows; if any matching row is already locked by another transaction, it **immediately aborts** with an error: `55P03 lock_not_available`.\n- `FOR UPDATE SKIP LOCKED`: Inspects candidate rows. If a row is already locked by any concurrent transaction, it **silently skips that row** and continues down the index to lock the next available unlocked rows up to the `LIMIT`.\n\n**2. Atomic Worker Claim Query:**\n```sql\nWITH claimed_jobs AS (\n    SELECT id\n    FROM outbox_events\n    WHERE status = \'PENDING\'\n    ORDER BY id ASC\n    LIMIT 5\n    FOR UPDATE SKIP LOCKED\n)\nUPDATE outbox_events\nSET \n    status = \'PROCESSING\',\n    processed_at = CURRENT_TIMESTAMP\nFROM claimed_jobs\nWHERE outbox_events.id = claimed_jobs.id\nRETURNING outbox_events.id, outbox_events.payload, outbox_events.status;\n```\nThis enables perfectly parallel, non-blocking queue workers with zero lock contention.',
    expectedConcepts: [
      'FOR UPDATE blocking behavior vs NOWAIT failure',
      'SKIP LOCKED silently bypassing locked rows for parallel worker queues',
      'CTE pairing SELECT ... FOR UPDATE SKIP LOCKED with UPDATE ... RETURNING',
      'Index requirement on (status, id) to avoid sequential scan locking'
    ],
    hints: [
      'SKIP LOCKED skips rows that are currently locked by other transactions.',
      'Wrap the SELECT in a CTE to feed the IDs directly into an UPDATE statement.',
      'Use RETURNING to fetch the job payload in the same round-trip.'
    ],
    followUp: {
      question:
        'Why is an index on `(status, id)` essential for `SKIP LOCKED` worker queries on tables with millions of completed rows?',
      expectedAnswer:
        'Without an index on `(status, id)`, PostgreSQL must perform a sequential scan of the table to find `status = \'PENDING\'` rows. While scanning, it must check row lock status on every examined row, creating massive lock manager overhead and scanning millions of historical processed rows.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Differentiates FOR UPDATE, NOWAIT, and SKIP LOCKED clearly',
        'Implements CTE with SELECT ... FOR UPDATE SKIP LOCKED and UPDATE',
        'Explains why workers achieve lock-free parallelism',
        'Identifies indexing requirement on queue status column'
      ]
    },
    testCases: [
      {
        id: 'tc-tier3-018-1',
        description: 'Verify CTE update with claimed status',
        setupSql:
          'CREATE TABLE outbox_events (id INT PRIMARY KEY, status VARCHAR(20), payload VARCHAR(50), processed_at VARCHAR(30));\nINSERT INTO outbox_events VALUES (1, \'PENDING\', \'event_1\', NULL), (2, \'PENDING\', \'event_2\', NULL), (3, \'DONE\', \'event_3\', \'2026-01-01\');',
        expectedOutputSql:
          'UPDATE outbox_events SET status = \'PROCESSING\' WHERE status = \'PENDING\'; SELECT id, status, payload FROM outbox_events WHERE status = \'PROCESSING\' ORDER BY id;',
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier3-019',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 19,
    title: 'PostgreSQL Full-Text Search: tsvector, tsquery, and GIN Indexing',
    category: 'PostgreSQL Data Types',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Customers complain that searching for "wireless headphone" in your e-commerce store fails to return products titled "Wireless Bluetooth Headphones" when using `LIKE \'%wireless headphone%\'`. Furthermore, the `LIKE` query takes 900ms.',
    questionStatement:
      'Explain PostgreSQL native Full-Text Search. Compare `tsvector` and `tsquery`. Explain text normalization (tokenization, stop words, stemming with Snowball dictionary). Provide the SQL to create a generated `tsvector` column, a GIN index, and a ranked search query using `ts_rank()`.',
    referenceAnswer:
      '**1. Full-Text Search Fundamentals:**\n- `tsvector` (Text Search Vector): A sorted list of distinct normalized lexemes (words reduced to base stems, e.g. "headphones" $\\to$ "headphon", "running" $\\to$ "run") with positional weights.\n- `tsquery`: A search query containing normalized lexemes combined with boolean operators (`&` AND, `|` OR, `!` NOT, `<->` FOLLOWED BY).\n- Normalization steps: Tokenizer parses words $\\to$ Dictionary removes stop words ("the", "a", "in") $\\to$ Snowball stemmer reduces suffixes to root lexeme.\n\n**2. Implementation with Generated Column & GIN Index:**\n```sql\n-- Add generated tsvector column (PG 12+)\nALTER TABLE products \nADD COLUMN search_vector tsvector \nGENERATED ALWAYS AS (\n    setweight(to_tsvector(\'english\', coalesce(name, \'\')), \'A\') ||\n    setweight(to_tsvector(\'english\', coalesce(description, \'\')), \'B\')\n) STORED;\n\n-- Create GIN index on search vector\nCREATE INDEX idx_products_search ON products USING gin(search_vector);\n```\n\n**3. Query Execution with Ranking:**\n```sql\nSELECT \n    id, name,\n    ts_rank(search_vector, query) AS rank_score\nFROM products, \n     websearch_to_tsquery(\'english\', \'wireless headphone\') query\nWHERE search_vector @@ query\nORDER BY rank_score DESC\nLIMIT 20;\n```\n`websearch_to_tsquery` supports Google-style search syntax (quotes for exact phrase, minus for exclusion).',
    expectedConcepts: [
      'tsvector lexemes and positional weights (A, B, C, D)',
      'tsquery boolean logic and phrase distance (<->)',
      'Snowball stemmer reducing words to root forms',
      'Stored generated column + GIN index pattern',
      'ts_rank / ts_rank_cd and websearch_to_tsquery'
    ],
    hints: [
      'Why does LIKE \'%wireless headphone%\' fail to match plural "headphones"?',
      'What dictionary stems words in PostgreSQL?',
      'Use websearch_to_tsquery for natural user search inputs.'
    ],
    followUp: {
      question:
        'When should you use `pg_trgm` (trigram similarity) instead of or in addition to `tsvector` Full-Text Search?',
      expectedAnswer:
        '`tsvector` requires correct root words and fails on typos or substring matches (e.g., searching "hedphone" or "logi" for "Logitech"). `pg_trgm` decomposes words into 3-character sliding windows (trigrams) and calculates Jaccard similarity. It is ideal for autocomplete, substring search (`ILIKE \'%foo%\'`), and fuzzy spell-checking / typo tolerance.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Differentiates tsvector from tsquery',
        'Explains stemming and stop-word removal',
        'Provides DDL for generated tsvector column with setweight and GIN index',
        'Contrasts full-text search with pg_trgm trigram similarity'
      ]
    }
  },
  {
    id: 'sql-tier3-020',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 20,
    title: 'CTEs in PostgreSQL 12+: MATERIALIZED vs NOT MATERIALIZED',
    category: 'Subqueries and CTEs',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'After upgrading a database from PostgreSQL 11 to PostgreSQL 14, an analytical query that used a Common Table Expression ran 50 times faster. However, another query containing a CTE suddenly experienced a severe plan regression.',
    questionStatement:
      'Explain the fundamental change PostgreSQL 12 introduced regarding Common Table Expression (CTE) optimization. What is CTE inlining? How do the `AS MATERIALIZED` and `AS NOT MATERIALIZED` clauses allow developers to explicitly control query planner behavior and optimization fences?',
    referenceAnswer:
      '**1. Pre-PostgreSQL 12 Behavior (The Optimization Fence):**\n- Prior to PG 12, all CTEs (`WITH cte AS (...)`) were treated as strict **optimization fences**.\n- PostgreSQL always evaluated the CTE independently, materialized the entire intermediate result into temporary memory or disk, and blocked the planner from pushing outer WHERE predicates or join conditions down into the CTE.\n- This often resulted in slow plans where a CTE computed 100,000 rows only for the outer query to filter it down to 10 rows.\n\n**2. PostgreSQL 12+ Inlining (NOT MATERIALIZED by default):**\n- Starting in PG 12, if a CTE is non-recursive, does not contain side-effects (e.g. `INSERT/UPDATE/DELETE`), and is referenced only once in the outer query, PostgreSQL **inlines** the CTE directly into the main query tree (treating it like a subquery in `FROM`).\n- Outer filters and join conditions are pushed down, allowing index scans and optimal join orders.\n\n**3. Explicit Control Clauses:**\n- `WITH cte AS MATERIALIZED (...)`: Forces PostgreSQL to evaluate the CTE once and store the result in memory, acting as an optimization fence. Useful when the CTE is expensive and referenced multiple times, or to force a specific execution order to prevent division-by-zero errors.\n- `WITH cte AS NOT MATERIALIZED (...)`: Forces PostgreSQL to inline the CTE even if it is referenced multiple times in the query, allowing filters to be pushed into each usage.',
    expectedConcepts: [
      'Pre-PG12 optimization fence behavior and forced materialization',
      'PG12+ automatic CTE inlining when referenced once without side-effects',
      'Predicate pushdown benefits of inlining',
      'WITH cte AS MATERIALIZED syntax to restore fence',
      'AS NOT MATERIALIZED to force inlining across multiple references'
    ],
    hints: [
      'What is an optimization fence in database query planners?',
      'What happens when an outer WHERE clause cannot be pushed inside a CTE?',
      'Check the AS MATERIALIZED keyword introduced in PostgreSQL 12.'
    ],
    followUp: {
      question:
        'When is forcing `AS MATERIALIZED` beneficial in modern PostgreSQL 14+?',
      expectedAnswer:
        'Forcing `AS MATERIALIZED` is beneficial when: (1) A complex, expensive CTE is referenced multiple times in the outer query, and inlining would cause Postgres to execute the expensive subquery multiple times; or (2) To prevent the planner from pushing down a condition that triggers an exception on rows that would otherwise have been excluded (acting as an intentional guard fence).'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains pre-PG12 optimization fence behavior',
        'Details PG12+ CTE inlining and predicate pushdown',
        'Contrasts AS MATERIALIZED vs AS NOT MATERIALIZED syntax',
        'Identifies use cases where materialization fence is desirable'
      ]
    }
  },
  {
    id: 'sql-tier3-021',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 21,
    title: 'PostgreSQL Foreign Data Wrappers (postgres_fdw) and Pushdown',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'Your architecture team separates high-volume analytics into an isolated PostgreSQL cluster while user authentication lives in the core database. You need the analytics database to join `events` with `users` from the core database seamlessly.',
    questionStatement:
      'Explain how PostgreSQL Foreign Data Wrappers (`postgres_fdw`) implement the SQL/MED standard. Detail the setup steps (`CREATE SERVER`, `CREATE USER MAPPING`, `IMPORT FOREIGN SCHEMA`). What is query pushdown (WHERE clauses, aggregates, joins), and how does network latency impact FDW performance?',
    referenceAnswer:
      '**1. SQL/MED and postgres_fdw Overview:**\n- SQL/MED (Management of External Data) is an ANSI standard that allows a database to query external data sources as if they were local tables.\n- `postgres_fdw` provides read/write access to remote PostgreSQL servers transparently.\n\n**2. Setup Architecture:**\n```sql\n-- 1. Install extension\nCREATE EXTENSION postgres_fdw;\n\n-- 2. Define remote server connection\nCREATE SERVER core_db_server\n    FOREIGN DATA WRAPPER postgres_fdw\n    OPTIONS (host \'core-db.internal\', dbname \'core_prod\', port \'5432\');\n\n-- 3. Map local role to remote user credentials\nCREATE USER MAPPING FOR current_user\n    SERVER core_db_server\n    OPTIONS (user \'analytics_reader\', password \'secret_token\');\n\n-- 4. Import foreign schema or table\nIMPORT FOREIGN SCHEMA public LIMIT TO (users)\n    FROM SERVER core_db_server INTO remote_core;\n```\n\n**3. Query Pushdown Mechanics:**\n- **Predicate Pushdown**: If you run `SELECT * FROM remote_core.users WHERE created_at > \'2026-01-01\'`, `postgres_fdw` sends the WHERE clause to the remote server so only matching rows travel over the network.\n- **Aggregate & Join Pushdown**: When joining two foreign tables on the same remote server, or calculating `SUM()` / `COUNT()`, PostgreSQL pushes the join and aggregation to the remote server if `fetch_size` and options are configured.\n- **Limitations**: Joins between a local table and a foreign table cannot be pushed down; PostgreSQL must fetch candidate rows over the network to perform the join locally.',
    expectedConcepts: [
      'SQL/MED standard and postgres_fdw extension',
      'CREATE SERVER, USER MAPPING, and IMPORT FOREIGN SCHEMA workflow',
      'Predicate, aggregate, and sort pushdown to remote engine',
      'Network round-trip latency and fetch_size parameter',
      'Local-to-foreign join limitations'
    ],
    hints: [
      'How does postgres_fdw avoid downloading the whole table when a WHERE clause is present?',
      'What user mapping is required so the local user has rights on the remote server?',
      'Consider the impact of network latency on joins between local and foreign tables.'
    ],
    followUp: {
      question:
        'What setting controls how many rows `postgres_fdw` fetches in a single network round trip, and why is the default often suboptimal?',
      expectedAnswer:
        'The `fetch_size` option (default 100 rows). Fetching in chunks of 100 causes severe network round-trip overhead when querying millions of rows over high-latency networks. Setting `OPTIONS (fetch_size \'10000\')` on the foreign server or table drastically reduces network latency.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Outlines DDL sequence: EXTENSION, SERVER, USER MAPPING, IMPORT',
        'Explains predicate and aggregate pushdown mechanics',
        'Identifies network latency bottlenecks and fetch_size optimization',
        'Delineates limitations of cross-node local-foreign joins'
      ]
    }
  },
  {
    id: 'sql-tier3-022',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 22,
    title: 'Audit Logging with Trigger Functions and pg_trigger_depth',
    category: 'Migrations and Schema Evolution',
    questionType: 'conceptual',
    datasetId: 'loan_management',
    realWorldScenario:
      'For regulatory compliance, an NBFC must maintain an immutable audit trail of every update to interest rates or loan statuses, recording the old values, new values, timestamp, and the database user who executed the change.',
    questionStatement:
      'Implement an automated audit trail trigger function in PostgreSQL. Detail the differences between `BEFORE` and `AFTER` triggers, statement-level vs row-level triggers (`FOR EACH ROW`), the role of `OLD` and `NEW` pseudo-records, and how to use `pg_trigger_depth()` to prevent infinite trigger loops.',
    referenceAnswer:
      '**1. Trigger Architecture:**\n- `BEFORE`: Executes before the row is written to disk. Can modify `NEW` values or cancel the operation (by returning `NULL`).\n- `AFTER`: Executes after row is written to the table heap. Cannot modify `NEW`. Ideal for audit logging and cascading notifications.\n- `FOR EACH ROW`: Fires once per affected tuple.\n- `FOR EACH STATEMENT`: Fires once per SQL command regardless of how many rows were updated.\n\n**2. Generic Audit Trigger Implementation:**\n```sql\nCREATE TABLE audit_logs (\n    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    table_name TEXT NOT NULL,\n    operation TEXT NOT NULL,\n    record_id TEXT NOT NULL,\n    old_data JSONB,\n    new_data JSONB,\n    changed_by TEXT NOT NULL DEFAULT current_user,\n    changed_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()\n);\n\nCREATE OR REPLACE FUNCTION audit_record_change()\nRETURNS TRIGGER AS $$\nBEGIN\n    -- Prevent recursive trigger loops if audit triggers cascade\n    IF pg_trigger_depth() > 1 THEN\n        RETURN NEW;\n    END IF;\n\n    IF TG_OP = \'DELETE\' THEN\n        INSERT INTO audit_logs (table_name, operation, record_id, old_data)\n        VALUES (TG_TABLE_NAME, TG_OP, OLD.id::text, to_jsonb(OLD));\n        RETURN OLD;\n    ELSIF TG_OP = \'UPDATE\' THEN\n        INSERT INTO audit_logs (table_name, operation, record_id, old_data, new_data)\n        VALUES (TG_TABLE_NAME, TG_OP, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW));\n        RETURN NEW;\n    ELSIF TG_OP = \'INSERT\' THEN\n        INSERT INTO audit_logs (table_name, operation, record_id, new_data)\n        VALUES (TG_TABLE_NAME, TG_OP, NEW.id::text, to_jsonb(NEW));\n        RETURN NEW;\n    END IF;\n    RETURN NULL;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_loans_audit\nAFTER INSERT OR UPDATE OR DELETE ON loans\nFOR EACH ROW EXECUTE FUNCTION audit_record_change();\n```',
    expectedConcepts: [
      'BEFORE vs AFTER trigger lifecycle',
      'FOR EACH ROW vs FOR EACH STATEMENT execution scope',
      'OLD and NEW record structures and TG_OP variable',
      'to_jsonb(OLD/NEW) serialization into structured JSONB',
      'pg_trigger_depth() guard against recursive cascades'
    ],
    hints: [
      'Can an AFTER trigger modify the NEW row values?',
      'How does to_jsonb() simplify storing arbitrary table schemas into a single audit table?',
      'Why check pg_trigger_depth()?'
    ],
    followUp: {
      question:
        'What performance overhead do row-level audit triggers introduce on high-throughput batch UPDATE statements, and how can that be mitigated?',
      expectedAnswer:
        'Row-level triggers force PostgreSQL to execute the PL/pgSQL function once per row, writing an audit row for every updated tuple. This turns a single bulk SQL statement into thousands of individual inserts, multiplying WAL writes and duration. Mitigation includes using statement-level triggers with transition tables (`REFERENCING NEW TABLE AS new_rows`), or offloading auditing to logical decoding / CDC tools like Debezium.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Differentiates BEFORE vs AFTER and ROW vs STATEMENT triggers',
        'Implements valid PL/pgSQL audit function with OLD/NEW handling',
        'Uses to_jsonb() for clean polymorphic schema logging',
        'Includes pg_trigger_depth() recursion guard'
      ]
    }
  },
  {
    id: 'sql-tier3-023',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 23,
    title: 'PostgreSQL Extensions: pg_stat_statements and Performance Profiling',
    category: 'Production Debugging',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Your database CPU is pegged at 95%. Hundreds of different query patterns run concurrently from microservices. You need to identify which queries are consuming the most cumulative time and I/O across the entire server.',
    questionStatement:
      'Explain how `pg_stat_statements` tracks SQL execution metrics in PostgreSQL. How does it normalize SQL text? Write a query against `pg_stat_statements` to find the top 5 most resource-intensive queries by total execution time, buffer cache miss ratio, and average call latency.',
    referenceAnswer:
      '**1. Architecture and Normalization:**\n- `pg_stat_statements` hooks directly into the PostgreSQL query execution pipeline (ExecutorStart, ExecutorRun, ExecutorFinish).\n- It **normalizes** SQL queries by replacing literal constants with parameter placeholders (`$1, $2`), aggregating identical query structures into a single row identified by `queryid`.\n- Must be preloaded in `shared_preload_libraries = \'pg_stat_statements\'` because it allocates shared memory at server boot.\n\n**2. Top Resource-Intensive Queries Diagnostic SQL:**\n```sql\nSELECT \n    queryid,\n    substring(query, 1, 80) AS query_snippet,\n    calls,\n    round(total_exec_time::numeric, 2) AS total_time_ms,\n    round(mean_exec_time::numeric, 2) AS avg_time_ms,\n    round((100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0))::numeric, 2) AS cache_hit_pct,\n    shared_blks_read AS disk_reads,\n    shared_blks_dirtied AS disk_dirtied\nFROM pg_stat_statements\nWHERE query NOT LIKE \'%pg_stat_statements%\'\nORDER BY total_exec_time DESC\nLIMIT 5;\n```\n\n**3. Key Metrics to Watch:**\n- `mean_exec_time`: Identifies inherently slow, unindexed queries.\n- `calls * mean_exec_time` (`total_exec_time`): Identifies high-frequency N+1 query patterns that dominate total database load.\n- Low `cache_hit_pct`: Identifies queries reading cold data from disk, thrashing `shared_buffers`.',
    expectedConcepts: [
      'Query normalization via queryid parameterization',
      'shared_preload_libraries requirement',
      'total_exec_time vs mean_exec_time distinction',
      'Buffer cache hit ratio formula (shared_blks_hit vs shared_blks_read)',
      'Identifying high-frequency N+1 queries vs slow individual queries'
    ],
    hints: [
      'Why does pg_stat_statements need to be in shared_preload_libraries?',
      'How does it group queries that only differ by WHERE id = 1 vs WHERE id = 2?',
      'Buffer cache hit ratio = hits / (hits + reads).'
    ],
    followUp: {
      question:
        'How does `pg_stat_statements_reset()` interact with production monitoring, and when should it be executed?',
      expectedAnswer:
        '`pg_stat_statements_reset()` clears all accumulated counters back to zero. It should be executed immediately after deploying major schema migrations or index additions so that post-deployment metrics reflect only new query plans rather than being skewed by months of historical pre-optimization counters.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains query normalization and queryid aggregation',
        'Provides valid diagnostic SQL querying pg_stat_statements',
        'Computes buffer cache hit ratio accurately',
        'Distinguishes total time (frequency) from average latency'
      ]
    }
  },
  {
    id: 'sql-tier3-024',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 24,
    title: 'Custom PostgreSQL Types: DOMAIN vs ENUM vs Composite Types',
    category: 'PostgreSQL Data Types',
    questionType: 'conceptual',
    datasetId: 'loan_management',
    realWorldScenario:
      'Your engineering team is debating how to represent currency amounts and loan statuses. Some suggest `VARCHAR(20) CHECK (status IN (...))`, others propose `CREATE TYPE loan_status AS ENUM (...)`, and a senior engineer suggests `CREATE DOMAIN`.',
    questionStatement:
      'Compare PostgreSQL `ENUM`, `DOMAIN`, and `COMPOSITE TYPE`. What are the storage characteristics, type-safety benefits, and operational risks of each? Specifically, what are the migration hazards of altering an existing ENUM type in production?',
    referenceAnswer:
      '**1. PostgreSQL ENUM (`CREATE TYPE ... AS ENUM`):**\n- **Storage**: Stored internally as a 4-byte integer pointing to `pg_enum`, saving massive disk space over repetitive text strings (`VARCHAR`).\n- **Benefits**: Strict compile-time validation, self-documenting schema.\n- **Production Hazards**: In older PostgreSQL versions, altering an ENUM required table locks. While `ALTER TYPE ... ADD VALUE` is now safe, **you cannot remove an enum value** or rename values without dropping dependent tables/columns or editing system catalogs, making schema deprecation difficult.\n\n**2. PostgreSQL DOMAIN (`CREATE DOMAIN`):**\n- **Definition**: A user-defined scalar data type based on an underlying primitive (e.g. `NUMERIC(15,2)`), augmented with reusable `CHECK` constraints and `DEFAULT` values.\n- **Example**: `CREATE DOMAIN monetary_amount AS NUMERIC(12,2) CHECK (VALUE >= 0);`\n- **Benefits**: Reusable business validation across dozens of tables. Changing the domain check rule centrally cascades validation across all columns using the domain without redefining constraints.\n\n**3. COMPOSITE TYPE (`CREATE TYPE ... AS (...)`):**\n- **Definition**: A structured type containing named fields, identical to a table row schema without an underlying table.\n- **Example**: `CREATE TYPE address_type AS (street VARCHAR(100), city VARCHAR(50), postal_code VARCHAR(20));`\n- **Use Cases**: Structured return types from stored functions and PL/pgSQL procedures.',
    expectedConcepts: [
      '4-byte internal storage of ENUM vs text storage',
      'ENUM operational hazard (cannot easily remove or reorder enum values)',
      'DOMAIN as constrained primitive type with reusable CHECK rules',
      'COMPOSITE TYPE for multi-attribute structured models and function returns',
      'Comparison with standard VARCHAR + CHECK constraint table pattern'
    ],
    hints: [
      'Can you delete a value from a PostgreSQL ENUM without recreating the type?',
      'How does CREATE DOMAIN allow centralized check constraint definitions?',
      'Think about 4-byte enum storage vs 20-byte strings.'
    ],
    followUp: {
      question:
        'Why do many senior database engineers prefer a lookup table with a foreign key (`status_id REFERENCES statuses(id)`) over a PostgreSQL ENUM for rapidly evolving business statuses?',
      expectedAnswer:
        'A lookup table allows adding, deprecating, disabling, and renaming statuses with standard DML (`INSERT`, `UPDATE`), supports soft-deletion (`is_active = false`), allows storing rich metadata (e.g., display label, allowed next transitions), and avoids non-standard DDL migration lock risks associated with ENUM alteration.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Explains 4-byte internal storage of ENUM types',
        'Details the operational difficulty of removing values from an ENUM',
        'Defines DOMAIN and demonstrates reusable CHECK constraint usage',
        'Compares ENUM against foreign-key lookup tables'
      ]
    }
  },
  {
    id: 'sql-tier3-025',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 25,
    title: 'Partial Indexes and Expression Indexes: Advanced Query Optimization',
    category: 'Indexes and Query Planning',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'In the `orders` table (5 million rows), 97% of orders are in `DELIVERED` status and are rarely queried by operational tools. The customer support dashboard frequently searches for orders with `status IN (\'FAILED\', \'PENDING\')` by customer email in lower case.',
    questionStatement:
      'Explain the architecture and storage efficiency of Partial Indexes and Expression Indexes in PostgreSQL. Write the SQL to create a partial expression index that indexes `lower(customer_email)` ONLY for orders where status is `FAILED` or `PENDING`. Write the exact matching query that utilizes this index.',
    starterCode:
      '-- 1. Create partial expression index\nCREATE INDEX idx_orders_unresolved ON orders (lower(customer_email))\nWHERE status IN (\'FAILED\', \'PENDING\');\n\n-- 2. Query that matches index condition and expression\nSELECT id, customer_email, total_amount, status\nFROM orders\nWHERE lower(customer_email) = \'alice@example.com\'\n  AND status = \'PENDING\';',
    sqlSolution:
      '-- 1. Create partial expression index\nCREATE INDEX idx_orders_unresolved ON orders (lower(customer_email))\nWHERE status IN (\'FAILED\', \'PENDING\');\n\n-- 2. Query that matches index condition and expression\nSELECT id, customer_email, total_amount, status\nFROM orders\nWHERE lower(customer_email) = \'alice@example.com\'\n  AND status = \'PENDING\';',
    referenceAnswer:
      '**1. Partial Indexes:**\n- A partial index includes an index predicate (`WHERE ...`). It only indexes rows that satisfy the predicate.\n- If 97% of rows are `DELIVERED`, a partial index on `status IN (\'FAILED\', \'PENDING\')` indexes only 3% of the table.\n- **Benefits**: 97% smaller index size, stays completely inside `shared_buffers` memory, and writes to `DELIVERED` orders generate **zero** index maintenance overhead.\n\n**2. Expression (Functional) Indexes:**\n- Normal B-tree indexes store raw column values. If a query applies a function (e.g. `WHERE lower(email) = ...`), a standard index on `email` **cannot be used** because the index keys do not match the function output.\n- An expression index computes and stores the evaluated result of the expression directly in the index leaf pages.\n\n**3. Creation and Query Match:**\n```sql\n-- Index definition:\nCREATE INDEX idx_orders_unresolved ON orders (lower(customer_email))\nWHERE status IN (\'FAILED\', \'PENDING\');\n\n-- Query matching both expression and predicate:\nSELECT id, customer_email, total_amount, status\nFROM orders\nWHERE lower(customer_email) = \'alice@example.com\'\n  AND status = \'PENDING\';\n```\nThe query planner recognizes that `status = \'PENDING\'` implies `status IN (\'FAILED\', \'PENDING\')` and utilizes the index.',
    expectedConcepts: [
      'Partial index predicate filtering rows at index creation time',
      'Expression index evaluating and storing function outputs',
      'Index size reduction and write overhead elimination for excluded rows',
      'Planner requirement that query WHERE clause subsume the index predicate'
    ],
    hints: [
      'What happens to index write overhead when an UPDATE modifies a row not covered by the partial index?',
      'Why does WHERE lower(email) fail to use a regular index on email?',
      'Make sure the query WHERE clause includes the partial condition.'
    ],
    followUp: {
      question:
        'If a query runs `WHERE lower(customer_email) = \'alice@example.com\'` without specifying `status`, will PostgreSQL use this partial index?',
      expectedAnswer:
        'No. PostgreSQL will refuse to use the partial index because the query could match rows where status is `DELIVERED` or `REFUNDED`, which do not exist in the partial index. The query predicate must mathematically imply the index predicate for the planner to consider it.'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Explains partial index predicate mechanics and storage savings',
        'Explains expression index function value storage',
        'Provides correct DDL combining expression and partial predicate',
        'Explains why queries must satisfy index predicate to use it'
      ]
    },
    testCases: [
      {
        id: 'tc-tier3-025-1',
        description: 'Verify partial expression query execution',
        setupSql:
          'CREATE TABLE orders (id INT, customer_email VARCHAR(50), total_amount NUMERIC, status VARCHAR(20));\nINSERT INTO orders VALUES (1, \'ALICE@EXAMPLE.COM\', 150, \'PENDING\'), (2, \'BOB@EXAMPLE.COM\', 200, \'DELIVERED\'), (3, \'alice@example.com\', 90, \'FAILED\');',
        expectedOutputSql:
          'SELECT id, customer_email, total_amount, status FROM orders WHERE lower(customer_email) = \'alice@example.com\' AND status = \'PENDING\';',
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier3-026',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 26,
    title: 'PostgreSQL JIT Compilation: Overhead, Thresholds, and OLTP Regressions',
    category: 'Query Optimization',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'After upgrading to PostgreSQL 12+, an OLTP payment API experiences random latency spikes where individual queries that normally take 2ms take 120ms. Looking at `EXPLAIN ANALYZE`, you see `JIT: Functions: 14, Options: Inlining true, Optimization true, Emission true, Timing: Generation 1.2ms, Inlining 24.5ms, Optimization 62.1ms, Emission 31.8ms`.',
    questionStatement:
      'Explain PostgreSQL Just-In-Time (JIT) compilation (using LLVM). What does JIT accelerate (expression evaluation, tuple deforming), what causes JIT overhead in OLTP environments, and which configuration parameters control when JIT engages?',
    referenceAnswer:
      '**1. What JIT Does in PostgreSQL:**\n- PostgreSQL uses LLVM to dynamically compile parts of a SQL query into native machine code at runtime.\n- **Accelerated Components**:\n  - *Expression Evaluation*: Compiles complex WHERE clauses, mathematical projections, and aggregate calculations into native CPU instructions, removing function call overhead.\n  - *Tuple Deforming*: Generates specialized native code to extract column values from raw 8KB heap tuples based on null bitmaps and variable-length offsets.\n\n**2. Why JIT Causes OLTP Regressions:**\n- LLVM compilation is CPU-heavy. Inlining, LLVM IR optimization, and emitting machine code frequently takes **50ms to 200ms**.\n- For an analytical query scanning 100 million rows for 2 minutes, spending 100ms compiling machine code saves 20 seconds (huge net win).\n- For an OLTP query that should complete in 2ms, spending 100ms on JIT compilation increases response time by 5,000% (severe regression).\n\n**3. Controlling JIT Configuration:**\n- `jit`: Master switch (`on` or `off`).\n- `jit_above_cost`: Queries with estimated planner cost exceeding this threshold engage JIT (default 100,000).\n- `jit_inline_above_cost`: Threshold to perform function inlining (default 500,000).\n- `jit_optimize_above_cost`: Threshold to run expensive LLVM optimization passes (default 500,000).\n- *OLTP Recommendation*: For purely transactional OLTP databases, disable JIT globally (`jit = off`) or set `jit_above_cost = 1000000`.',
    expectedConcepts: [
      'LLVM native machine code compilation at runtime',
      'Expression evaluation and tuple deforming acceleration',
      'Compilation time overhead (50-200ms) dominating sub-second OLTP queries',
      'jit_above_cost and jit_optimize_above_cost thresholds',
      'OLTP best practice: disable JIT or raise cost threshold'
    ],
    hints: [
      'Look at the timing numbers in the scenario: JIT emission took over 110ms alone.',
      'JIT is great for multi-minute OLAP queries, bad for 2ms OLTP queries.',
      'What parameter turns off JIT or raises its cost threshold?'
    ],
    followUp: {
      question:
        'Why does a query with a low actual execution time trigger JIT if `jit_above_cost = 100000` is set to a high number?',
      expectedAnswer:
        'JIT engages based on the query planner’s **estimated cost**, not the actual execution time. If outdated statistics or cross-column correlations cause the planner to overestimate the cost (e.g. estimating a cost of 350,000 for a query that actually touches only 10 rows), PostgreSQL will spend 100ms compiling JIT code for a query that finishes in microseconds.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 20,
      performanceWeight: 30,
      edgeCaseWeight: 15,
      criteria: [
        'Explains what JIT compiles (expressions, tuple deforming)',
        'Identifies LLVM compilation latency as the root cause of OLTP spikes',
        'Details jit_above_cost and related configuration parameters',
        'Explains discrepancy between planner estimated cost and actual runtime'
      ]
    }
  },
  {
    id: 'sql-tier3-027',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 27,
    title: 'Array Data Types and High-Performance Containment Queries',
    category: 'PostgreSQL Data Types',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A tagging system for products stores assigned tags in a `VARCHAR[]` array column (e.g. `{\'electronics\', \'sale\', \'audio\'}`). You need to find products that contain specific combinations of tags without maintaining a join table.',
    questionStatement:
      'Explain PostgreSQL array data types, array operators (`@>` contains, `<@` is contained by, `&&` overlaps), and how to index arrays using GIN. Write a query against `products` that finds all products having both `\'wireless\'` and `\'audio\'` in their tags array, and projects the total tag count using `cardinality()`.',
    starterCode:
      '-- Query products having both \'wireless\' and \'audio\' tags\nSELECT \n    id,\n    name,\n    tags,\n    cardinality(tags) AS total_tags\nFROM products\nWHERE tags @> ARRAY[\'wireless\', \'audio\']\nORDER BY id;',
    sqlSolution:
      'SELECT \n    id,\n    name,\n    tags,\n    cardinality(tags) AS total_tags\nFROM products\nWHERE tags @> ARRAY[\'wireless\', \'audio\']\nORDER BY id;',
    referenceAnswer:
      '**1. PostgreSQL Array Operators:**\n- `@>` (Contains): Checks if the left array contains all elements of the right array.\n- `<@` (Is Contained By): Checks if left array elements are a subset of the right array.\n- `&&` (Overlap): Checks if arrays share at least one common element.\n- `cardinality(arr)`: Returns the total number of elements in the array (or 0 if empty).\n- `unnest(arr)`: Expands an array into a relational set of rows.\n\n**2. GIN Indexing for Arrays:**\nA B-tree index on an array column only supports whole-array equality (`tags = ARRAY[...]`). To accelerate containment (`@>`) and overlap (`&&`), a GIN index must be used:\n```sql\nCREATE INDEX idx_products_tags_gin ON products USING gin (tags);\n```\nGIN decomposes each distinct tag into an inverted index entry, allowing instant lookups regardless of tag position in the array.\n\n**3. Executable Query:**\n```sql\nSELECT \n    id, name, tags,\n    cardinality(tags) AS total_tags\nFROM products\nWHERE tags @> ARRAY[\'wireless\', \'audio\']\nORDER BY id;\n```',
    expectedConcepts: [
      'Array containment (@>) vs overlap (&&) operators',
      'cardinality() function for element count',
      'GIN inverted index requirement for array elements',
      'Difference between whole-array B-tree equality and GIN element search'
    ],
    hints: [
      'Which operator checks if an array contains all elements of another array?',
      'Use cardinality(tags) to count the number of items.',
      'Remember that GIN is the inverted index suitable for array containment.'
    ],
    followUp: {
      question:
        'When is storing data in an array column an anti-pattern compared to a standard normalized junction table (`product_tags`)?',
      expectedAnswer:
        'Storing in an array is an anti-pattern when: (1) You need foreign key constraints to ensure tags exist in a master `tags` table (Postgres cannot enforce FKs on array elements); (2) You need to associate attributes with the relationship (e.g. `added_by`, `assigned_at`); or (3) Tags are frequently updated independently by concurrent transactions (modifying an array requires updating the entire parent row, causing tuple bloat).'
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 15,
      criteria: [
        'Uses @> containment operator accurately',
        'Uses cardinality() function for element counting',
        'Explains GIN inverted indexing for array columns',
        'Identifies trade-offs between array columns and normalized junction tables'
      ]
    },
    testCases: [
      {
        id: 'tc-tier3-027-1',
        description: 'Verify array containment and cardinality projection',
        setupSql:
          'CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(50), tags TEXT[]);\nINSERT INTO products VALUES (1, \'Headphones\', ARRAY[\'wireless\', \'audio\', \'sale\']), (2, \'Cable\', ARRAY[\'audio\']), (3, \'Earbuds\', ARRAY[\'wireless\', \'audio\']);',
        expectedOutputSql:
          'SELECT id, name, tags, cardinality(tags) AS total_tags FROM products WHERE tags @> ARRAY[\'wireless\', \'audio\'] ORDER BY id;',
        orderMatters: true
      }
    ]
  },
  {
    id: 'sql-tier3-028',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 28,
    title: 'PostgreSQL NULLS FIRST / NULLS LAST Index Semantics',
    category: 'Indexes and Query Planning',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A pagination endpoint sorts orders by `shipped_at DESC NULLS LAST` to display the most recently shipped orders first and pending unshipped orders at the end. Despite having an index on `(shipped_at DESC)`, the query takes 1.2 seconds and shows `Sort Method: external merge Disk` in the plan.',
    questionStatement:
      'Explain how PostgreSQL indexes store NULL values by default in B-Trees. What is the difference between `NULLS FIRST` and `NULLS LAST`? Why did the index on `(shipped_at DESC)` fail to eliminate the explicit sort, and what exact index definition matches `ORDER BY shipped_at DESC NULLS LAST`?',
    referenceAnswer:
      '**1. Default B-Tree NULL Ordering:**\n- In SQL standard and PostgreSQL, B-tree indexes are sorted ascending by default: `ASC NULLS LAST` (NULLs are treated as larger than any value, placed at the end).\n- For descending indexes (`DESC`), the default is `DESC NULLS FIRST` (NULLs appear at the very beginning of the index scan).\n\n**2. Why the Index Failed:**\n- The index was created as `CREATE INDEX idx_orders_shipped ON orders(shipped_at DESC);`.\n- Because of defaults, this index physically stores entries as `DESC NULLS FIRST`.\n- The query requested `ORDER BY shipped_at DESC NULLS LAST`.\n- Because the physical order of NULLs in the index does not match the requested query sort order, PostgreSQL cannot read the index in order. It must perform an expensive in-memory or disk sort (`Sort Method: external merge Disk`).\n\n**3. Exact Matching Index Solution:**\n```sql\nCREATE INDEX idx_orders_shipped_desc_nulls_last \nON orders (shipped_at DESC NULLS LAST);\n```\nWith this index, PostgreSQL reads the leaf pages directly via an Index Scan with zero CPU sorting.',
    expectedConcepts: [
      'B-Tree physical sort ordering and NULL placement',
      'Default rules: ASC defaults to NULLS LAST; DESC defaults to NULLS FIRST',
      'Sort elimination requirement: index ordering must match query ORDER BY exactly',
      'CREATE INDEX ... DESC NULLS LAST syntax'
    ],
    hints: [
      'What is the default NULL placement for DESC indexes in PostgreSQL?',
      'If the query specifies NULLS LAST but the index was built with NULLS FIRST, can the planner eliminate the sort?',
      'Define the index with explicit DESC NULLS LAST.'
    ],
    followUp: {
      question:
        'Can PostgreSQL scan an `ASC NULLS LAST` index backwards (backward index scan) to satisfy an `ORDER BY col DESC NULLS LAST` query?',
      expectedAnswer:
        'No. Scanning an `ASC NULLS LAST` index backwards yields `DESC NULLS FIRST`. Because the NULLs are physically at the end of the ASC index, reading it backwards encounters the NULLs first. Therefore, a backward scan cannot satisfy `DESC NULLS LAST` without an explicit sort step.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 25,
      edgeCaseWeight: 15,
      criteria: [
        'Explains default NULL ordering (ASC NULLS LAST, DESC NULLS FIRST)',
        'Identifies mismatch between index (NULLS FIRST) and query (NULLS LAST)',
        'Explains why backward index scans fail to resolve this mismatch',
        'Provides exact DDL: CREATE INDEX ... (col DESC NULLS LAST)'
      ]
    }
  },
  {
    id: 'sql-tier3-029',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 29,
    title: 'Database Security: Role Inheritance, Schema search_path Poisoning, and SECURITY DEFINER',
    category: 'Database Security and Permissions',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'A database security review reveals a function `process_refund(order_id INT)` created with `SECURITY DEFINER` by a `postgres` superuser. A junior engineer added an unprivileged tenant user who was able to execute arbitrary code with superuser privileges.',
    questionStatement:
      'Explain the security risks of `SECURITY DEFINER` functions in PostgreSQL. What is `search_path` hijacking/poisoning, how do attackers exploit it, and what are the mandatory defensive measures (including `SET search_path = pg_catalog, pg_temp`) required when creating privileged functions?',
    referenceAnswer:
      '**1. SECURITY DEFINER vs SECURITY INVOKER:**\n- `SECURITY INVOKER` (default): The function executes with the privileges of the user who calls it.\n- `SECURITY DEFINER`: The function executes with the privileges of the user who **created/owns** the function (e.g. `postgres` superuser), similar to a Unix `setuid` binary.\n\n**2. Search Path Hijacking Attack:**\n- When a function calls an unqualified table or function name (e.g. `SELECT * FROM orders` or `SELECT lower(str)`), PostgreSQL searches schemas in the order defined by the caller’s `search_path`.\n- If an unprivileged user can create objects in a public or temporary schema (`pg_temp`), they can create a malicious function or table with the same name (e.g. `public.lower()` or `pg_temp.orders`).\n- When the `SECURITY DEFINER` function runs, it executes the attacker’s malicious code with superuser privileges.\n\n**3. Mandatory Defensive Hardening:**\n```sql\nCREATE OR REPLACE FUNCTION process_refund(p_order_id INT)\nRETURNS VOID\nSECURITY DEFINER\n-- 1. Reset search_path to safe trusted system catalog and lock out public/temp schemas\nSET search_path = pg_catalog, pg_temp\nLANGUAGE plpgsql AS $$\nBEGIN\n    -- 2. Fully qualify all user schema object references\n    UPDATE public.orders \n    SET status = \'REFUNDED\' \n    WHERE id = p_order_id;\nEND;\n$$;\n\n-- 3. Revoke default public execution rights\nREVOKE ALL ON FUNCTION process_refund(INT) FROM PUBLIC;\nGRANT EXECUTE ON FUNCTION process_refund(INT) TO finance_app_role;\n```',
    expectedConcepts: [
      'SECURITY DEFINER executing as function owner (setuid analogy)',
      'search_path resolution order and object substitution attack',
      'Exploitation via public schema or pg_temp shadow functions',
      'Mandatory SET search_path = pg_catalog, pg_temp clause',
      'Explicit schema qualification (public.table) and REVOKE EXECUTE FROM PUBLIC'
    ],
    hints: [
      'What happens if a caller has search_path = "malicious_schema, public"?',
      'What does SET search_path = pg_catalog do inside the function definition?',
      'Who can execute a newly created function by default in PostgreSQL?'
    ],
    followUp: {
      question:
        'Why does PostgreSQL 15+ no longer grant `CREATE` privileges on the `public` schema to `PUBLIC` by default?',
      expectedAnswer:
        'In PG 14 and earlier, any connected user could create tables and functions in the `public` schema by default. This made search_path poisoning trivial on multi-user databases. PostgreSQL 15 removed `CREATE` on schema `public` from the pseudo-role `PUBLIC` to prevent unprivileged users from planting malicious objects in shared schemas.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Explains SECURITY DEFINER privileges and setuid vulnerability',
        'Details search_path poisoning and object resolution mechanics',
        'Provides hardened function DDL with explicit SET search_path',
        'Revokes public execute permissions and qualifies schema names'
      ]
    }
  },
  {
    id: 'sql-tier3-030',
    tier: 'tier-3',
    difficultyLabel: 'Advanced',
    order: 30,
    title: 'Advisory Locks for Distributed Idempotency and Rate Limiting',
    category: 'Locks and Deadlocks',
    questionType: 'conceptual',
    datasetId: 'ecommerce',
    realWorldScenario:
      'An e-commerce API allows customers to redeem a single-use coupon code. High-concurrency automated scripts send 20 requests within 50 milliseconds using the same coupon code. Multiple requests succeed simultaneously before the `used` flag can be checked and written.',
    questionStatement:
      'Design a concurrency-safe single-use coupon redemption mechanism using PostgreSQL advisory locks. Contrast using `pg_advisory_xact_lock(hashtext(coupon_code))` against `SELECT ... FOR UPDATE`, explaining deadlocks, memory consumption, and transaction isolation interactions.',
    referenceAnswer:
      '**1. Concurrency Race Condition:**\nIn `READ COMMITTED` or `REPEATABLE READ`, multiple transactions read `is_redeemed = FALSE` concurrently because no single row was locked yet. All transactions proceed to generate discounts.\n\n**2. Solution with Transaction Advisory Locks:**\nUsing `pg_advisory_xact_lock`: Take an in-memory lock on the hash of the coupon code before querying:\n```sql\nCREATE OR REPLACE FUNCTION redeem_coupon(p_user_id INT, p_coupon_code TEXT)\nRETURNS BOOLEAN AS $$\nDECLARE\n    v_already_used BOOLEAN;\nBEGIN\n    -- 1. Acquire transaction-level advisory lock on 64-bit hash of coupon code\n    -- Concurrent requests for the SAME coupon will wait here in queue\n    PERFORM pg_advisory_xact_lock(hashtext(p_coupon_code));\n\n    -- 2. Check current state (reads latest committed state)\n    SELECT is_redeemed INTO v_already_used\n    FROM coupons\n    WHERE code = p_coupon_code;\n\n    IF v_already_used THEN\n        RETURN FALSE; -- Coupon already redeemed by previous transaction in queue\n    END IF;\n\n    -- 3. Mark coupon redeemed and record transaction\n    UPDATE coupons SET is_redeemed = TRUE, redeemed_by = p_user_id, redeemed_at = clock_timestamp()\n    WHERE code = p_coupon_code;\n\n    RETURN TRUE;\nEND;\n$$ LANGUAGE plpgsql;\n```\n\n**3. Comparison with SELECT FOR UPDATE:**\n- `SELECT ... FOR UPDATE` locks the physical row in the `coupons` table. It works if the row already exists, but writes XIDs to the heap page and can cause lock wait timeouts on hot tables.\n- `pg_advisory_xact_lock` works in PostgreSQL shared memory with zero disk writes, does not bloat tables, and automatically releases when the transaction commits or aborts.\n- If the coupon does not yet exist in the table (e.g. first-time insert), `SELECT FOR UPDATE` cannot lock anything, whereas `pg_advisory_xact_lock` locks the logical entity name before insert, preventing duplicate creation races.',
    expectedConcepts: [
      'pg_advisory_xact_lock with hashtext() hash key',
      'Serialization of concurrent requests for identical resource',
      'Automatic transaction-boundary lock release',
      'Advantages over row-level locks when rows do not yet exist (insert race)',
      'Zero disk I/O and zero tuple bloat in shared memory lock table'
    ],
    hints: [
      'What happens if the row does not exist yet? Can SELECT FOR UPDATE lock a non-existent row?',
      'hashtext() converts a string to a 32-bit integer for the lock key.',
      'Transaction-level advisory locks release automatically on COMMIT.'
    ],
    followUp: {
      question:
        'What is a potential hash collision hazard when using `hashtext(string)` with 32-bit advisory locks, and how do you resolve it?',
      expectedAnswer:
        '`hashtext()` returns a 32-bit integer, which has a small probability of hash collisions ($2^{-32}$) across millions of strings. A collision would cause two unrelated coupons with colliding hashes to briefly serialize against each other. To mitigate, use `pg_advisory_xact_lock(int4, int4)` with two independent 32-bit hashes or use 64-bit hashing via `(\'x\' || substr(md5(string), 1, 16))::bit(64)::bigint`.'
    },
    rubric: {
      correctnessWeight: 35,
      semanticRelationalWeight: 25,
      performanceWeight: 20,
      edgeCaseWeight: 20,
      criteria: [
        'Implements pg_advisory_xact_lock with string hashing',
        'Explains why concurrent requests serialize safely',
        'Contrasts advisory locks with SELECT FOR UPDATE (especially non-existent rows)',
        'Addresses hash collision handling in 32-bit vs 64-bit keys'
      ]
    }
  }
];
