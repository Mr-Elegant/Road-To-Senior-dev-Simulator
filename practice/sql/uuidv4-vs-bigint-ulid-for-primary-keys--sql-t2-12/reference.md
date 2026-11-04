# Reference: UUIDv4 vs. BIGINT / ULID for Primary Keys

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "UUIDv4 generates purely random 128-bit numbers. Because values are random, new inserts do not append to the end of the B-Tree; they land randomly across all leaf pages. Once the index exceeds RAM (`shared_buffers`), almost every insert requires loading a different page from disk, causing random disk I/O, cache thrashing, and page splits (leaf fragmentation). Sequential identifiers (BIGINT IDENTITY, UUIDv7, or ULID) are time-ordered: new inserts append monotonically to the rightmost leaf pages, keeping write operations localized to hot memory buffers.",
    "followUp": {
      "question": "What is the risk of using auto-incrementing BIGINT identifiers in public-facing web URLs?",
      "expectedAnswer": "Enumeration attacks (Insecure Direct Object References - IDOR). Attackers can iterate through ids (/api/orders/1, /api/orders/2) to harvest data or estimate company order volume."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains B-Tree random insertion penalty",
      "Mentions page splits and memory thrashing",
      "Explains time-ordered keys"
    ]
  },
  "expectedConcepts": [
    "UUIDv4 random distribution",
    "B-Tree page splits and cache thrashing",
    "Monotonic time-ordered keys (UUIDv7/ULID/BIGINT)",
    "Index memory footprint"
  ]
}
```
