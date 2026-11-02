# Reference: GIN vs GiST vs BRIN Indexes: Architecture and Selection

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. GIN (Generalized Inverted Index):**\n- **Structure**: An inverted list mapping elements (JSON keys/values, array elements, tsvector tokens) to posting lists or posting trees of matching tuple IDs (TIDs).\n- **Use Cases**: JSONB containment (`@>`), array contains (`&&`, `@>`), Full-Text Search (`to_tsvector`).\n- **Write Overhead**: Heavy write amplification because one inserted row with 10 JSON keys generates 10 index updates. Mitigated by `fastupdate = on` (in-memory pending list buffer).\n- **Recommendation**: Apply `CREATE INDEX ON events USING gin (metadata jsonb_path_ops)` for JSONB containment queries.\n\n**2. GiST (Generalized Search Tree):**\n- **Structure**: Balanced tree of bounding boxes/predicates where child nodes are covered by the parent node’s predicate.\n- **Use Cases**: Geometric coordinates (PostGIS), IP ranges (`inet`), timestamp ranges (`tsrange` with exclusion constraints), trigram similarity (`pg_trgm`).\n- **Write Overhead**: Moderate, fast point lookups and nearest-neighbor (`<->`) distance searches.\n\n**3. BRIN (Block Range Index):**\n- **Structure**: Stores only the minimum and maximum values for physical blocks of heap pages (default 128 pages = 1MB block range). Size is minuscule (often < 10MB for 100M rows).\n- **Use Cases**: Naturally physically ordered append-only columns (e.g. `created_at`, sequential IDs) where physical storage closely correlates with logical value.\n- **Write Overhead**: Virtually zero write overhead on inserts. Searches scan pages within the matching min-max block range.\n- **Recommendation**: Apply `CREATE INDEX ON events USING brin (created_at)` for timestamp range filtering on the append-only events table.",
    "followUp": {
      "question": "What is the practical difference between `jsonb_ops` and `jsonb_path_ops` when creating a GIN index on a JSONB column?",
      "expectedAnswer": "`jsonb_ops` (the default) indexes every key, value, and sub-path independently, supporting `?`, `?|`, `?&`, and `@>` operators, but results in a larger index. `jsonb_path_ops` hashes the complete root-to-leaf path and value together into a single 32-bit hash, supporting only the `@>` (containment) operator, but produces indexes that are typically 60% smaller and significantly faster for containment queries."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains GIN inverted list architecture and write amplification",
      "Explains BRIN min-max block range summaries and compact footprint",
      "Contrasts GiST bounding trees with GIN and BRIN",
      "Correctly selects BRIN for append-only timestamp and GIN for JSONB"
    ]
  },
  "expectedConcepts": [
    "GIN inverted index structure and posting lists/trees",
    "GIN fastupdate pending list buffer",
    "GiST bounding predicates and range/geometric search",
    "BRIN block range min-max summaries and tiny footprint",
    "Optimal pairing: BRIN for sequential timestamps, GIN for JSONB"
  ]
}
```
