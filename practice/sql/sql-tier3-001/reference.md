# Reference: B-Tree Index Internals: Leaf Pages, Splits, and Fillfactor

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "PostgreSQL B-Tree indexes are balanced trees composed of meta pages, internal routing pages, and leaf pages (default 8KB each) containing sorted `(key, ctid)` tuples.\n\n1. **Page Splits**: When a leaf page fills up and a new key must be inserted within its range, PostgreSQL allocates a new 8KB block and moves roughly half of the leaf page’s tuples to the new block (a 50/50 split), then updates the parent page. This causes write amplification, WAL volume bursts, and page fragmentation (sparse pages).\n2. **Right-Leaning Splits**: For strictly increasing sequences (like sequential BIGSERIAL/TIMESTAMPTZ), PostgreSQL optimizes splits by leaving the full page intact and allocating a new right leaf page.\n3. **Random Key Inserts (e.g. UUIDv4)**: Uniformly distributed keys land randomly across all leaf pages, triggering continuous 50/50 splits, severe bloat, and cache thrashing.\n4. **Fillfactor Optimization**: Setting `fillfactor` (e.g., `WITH (fillfactor = 70)` on indexes or tables) reserves 30% free space in each page at creation time. For tables, this enables HOT (Heap-Only Tuple) updates within the same heap page without touching the index. For indexes (PG 11+), it allows intra-page insertions without immediate leaf splits.",
    "followUp": {
      "question": "Why does PostgreSQL 13+ B-Tree deduplication reduce index size for non-unique columns, and when is it disabled?",
      "expectedAnswer": "PostgreSQL 13 introduced B-tree deduplication: when multiple index entries share identical key values, PostgreSQL stores the key once followed by an array of posting list TIDs (heap pointers) instead of repeating the key. This can reduce index size by 40-70%. It is automatically disabled for unique indexes, expressions, and types without support for deduplication equality."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains 8KB leaf page anatomy and (key, ctid) pairs",
      "Details 50/50 page split mechanics and write amplification",
      "Distinguishes sequential vs UUID random insert patterns",
      "Explains fillfactor for both tables (HOT updates) and indexes"
    ]
  },
  "expectedConcepts": [
    "B-Tree 8KB leaf pages and (key, ctid) tuples",
    "50/50 page split mechanics and write amplification",
    "HOT (Heap-Only Tuple) updates and table fillfactor",
    "Sequential vs random (UUID) index insertion patterns",
    "Index bloat and fragmentation mitigation"
  ]
}
```
