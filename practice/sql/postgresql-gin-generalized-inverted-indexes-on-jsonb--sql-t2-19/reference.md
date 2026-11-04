# Reference: PostgreSQL GIN (Generalized Inverted) Indexes on JSONB

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "B-Tree indexes sort entire values in scalar sequence. In a JSONB document with dynamic keys and nested objects, there is no scalar ordering that allows looking up internal key-value pairs. A Generalized Inverted Index (GIN) breaks down the JSONB document into individual key-value tokens (paths and scalar values). The GIN index stores an inverted list: for each token, it lists all table row IDs (TIDs) containing that token. Searching for `{\"ip_country\": \"DE\"}` performs an instant set intersection of matching row IDs.",
    "followUp": {
      "question": "What is the difference between jsonb_ops and jsonb_path_ops operator classes for GIN indexes?",
      "expectedAnswer": "jsonb_ops (default) indexes both keys and values separately, supporting ?, ?|, and @> operators. jsonb_path_ops hashes entire paths (e.g. hash(\"a.b.c\")), creating much smaller and faster indexes, but only supports the @> containment operator."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains inverted index concept",
      "Explains posting lists / TIDs",
      "Explains containment acceleration"
    ]
  },
  "expectedConcepts": [
    "Inverted index structure",
    "Tokens mapping to row ID posting lists",
    "Acceleration of containment operator (@>)",
    "Write overhead of GIN indexes"
  ]
}
```
