# Reference: PostgreSQL JSONB vs JSON Storage and Operators

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "1. `JSON` stores an exact textual copy of the input string. It preserves whitespace, indentation, and key order, but must re-parse the raw text on every query. Does not support GIN indexing. 2. `JSONB` decomposes and stores data in a parsed binary format. Whitespace and duplicate keys are discarded, but queries are significantly faster and support GIN indexing.\nExtraction Operators:\n- `->` extracts a JSON object or array element (returns jsonb).\n- `->>` extracts an element as plain `TEXT`.\nExample: `data->'user'->>'email'`.",
    "followUp": {
      "question": "What does the JSONB containment operator (@>) do?",
      "expectedAnswer": "The containment operator (@>) checks whether the left JSONB value contains the right JSONB structure (e.g. data @> '{\"role\": \"ADMIN\"}'). It can be accelerated using GIN indexes for fast key/value searches."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Contrasts text vs binary storage",
      "Identifies GIN index advantage",
      "Correctly differentiates -> from ->>"
    ]
  },
  "expectedConcepts": [
    "JSON textual representation vs JSONB decomposed binary format",
    "Re-parsing overhead of JSON",
    "GIN indexing capability of JSONB",
    "-> (jsonb) vs ->> (text) operators"
  ]
}
```
