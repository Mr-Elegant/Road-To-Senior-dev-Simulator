# Reference: PostgreSQL Full-Text Search: tsvector, tsquery, and GIN Indexing

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Full-Text Search Fundamentals:**\n- `tsvector` (Text Search Vector): A sorted list of distinct normalized lexemes (words reduced to base stems, e.g. \"headphones\" $\\to$ \"headphon\", \"running\" $\\to$ \"run\") with positional weights.\n- `tsquery`: A search query containing normalized lexemes combined with boolean operators (`&` AND, `|` OR, `!` NOT, `<->` FOLLOWED BY).\n- Normalization steps: Tokenizer parses words $\\to$ Dictionary removes stop words (\"the\", \"a\", \"in\") $\\to$ Snowball stemmer reduces suffixes to root lexeme.\n\n**2. Implementation with Generated Column & GIN Index:**\n```sql\n-- Add generated tsvector column (PG 12+)\nALTER TABLE products \nADD COLUMN search_vector tsvector \nGENERATED ALWAYS AS (\n    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||\n    setweight(to_tsvector('english', coalesce(description, '')), 'B')\n) STORED;\n\n-- Create GIN index on search vector\nCREATE INDEX idx_products_search ON products USING gin(search_vector);\n```\n\n**3. Query Execution with Ranking:**\n```sql\nSELECT \n    id, name,\n    ts_rank(search_vector, query) AS rank_score\nFROM products, \n     websearch_to_tsquery('english', 'wireless headphone') query\nWHERE search_vector @@ query\nORDER BY rank_score DESC\nLIMIT 20;\n```\n`websearch_to_tsquery` supports Google-style search syntax (quotes for exact phrase, minus for exclusion).",
    "followUp": {
      "question": "When should you use `pg_trgm` (trigram similarity) instead of or in addition to `tsvector` Full-Text Search?",
      "expectedAnswer": "`tsvector` requires correct root words and fails on typos or substring matches (e.g., searching \"hedphone\" or \"logi\" for \"Logitech\"). `pg_trgm` decomposes words into 3-character sliding windows (trigrams) and calculates Jaccard similarity. It is ideal for autocomplete, substring search (`ILIKE '%foo%'`), and fuzzy spell-checking / typo tolerance."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Differentiates tsvector from tsquery",
      "Explains stemming and stop-word removal",
      "Provides DDL for generated tsvector column with setweight and GIN index",
      "Contrasts full-text search with pg_trgm trigram similarity"
    ]
  },
  "expectedConcepts": [
    "tsvector lexemes and positional weights (A, B, C, D)",
    "tsquery boolean logic and phrase distance (<->)",
    "Snowball stemmer reducing words to root forms",
    "Stored generated column + GIN index pattern",
    "ts_rank / ts_rank_cd and websearch_to_tsquery"
  ]
}
```
