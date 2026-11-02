# Reference: E-Commerce Real-Time Full-Text Search & Faceted Filtering

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Search Architecture Design:\n1. Ingestion & Sync Pipeline:\n- Source of truth: PostgreSQL.\n- CDC (Change Data Capture) via Debezium monitors DB WAL -> pushes to Kafka 'products.cdc' topic.\n- Ingestion Worker batch-indexes documents into OpenSearch using the Bulk API (batches of 1,000 docs).\n\n2. Document Index Mapping:\n- Analyzers:\n  - Standard English Analyzer (lowercase, stemmer, stop-words) for full-text search.\n  - Edge-nGram Token Filter (min_gram: 2, max_gram: 15) on dedicated 'title.autocomplete' sub-field for fast prefix search without expensive regex.\n  - Keyword type on 'brand', 'category', 'sku' with 'doc_values: true' for fast aggregations and sorting.\n  - Dense Vector field for semantic hybrid search with embeddings.\n\n3. Query Construction (Bool Query):\n- 'must': Multi-match on 'title' (boost 3.0), 'description' (boost 1.0) with BM25 scoring and 'fuzziness: \"AUTO\"'.\n- 'filter': Range queries on 'price', 'in_stock: true' (runs in filter context: bypasses scoring and leverages fast bitset caching).\n- 'aggs': Terms aggregations on 'brand', 'category' and stats aggregation on 'price'.\n\n4. Zero-Downtime Re-indexing via Aliases:\n- Application queries the alias 'products_active'.\n- To change schema or mapping, create 'products_v2'.\n- Run '_reindex' API from 'products_v1' to 'products_v2'.\n- Atomically swap the alias:\n  'POST /_aliases { actions: [ { remove: { index: \"products_v1\", alias: \"products_active\" } }, { add: { index: \"products_v2\", alias: \"products_active\" } } ] }'\n- Zero downtime, zero dropped queries.",
    "codeOrArtifact": "/* Elasticsearch Index Mapping Snippet */\nPUT /products_v1\n{\n  \"settings\": {\n    \"number_of_shards\": 5,\n    \"number_of_replicas\": 2,\n    \"analysis\": {\n      \"analyzer\": {\n        \"autocomplete_analyzer\": {\n          \"tokenizer\": \"autocomplete_tokenizer\",\n          \"filter\": [\"lowercase\"]\n        }\n      },\n      \"tokenizer\": {\n        \"autocomplete_tokenizer\": {\n          \"type\": \"edge_ngram\",\n          \"min_gram\": 2,\n          \"max_gram\": 15,\n          \"token_chars\": [\"letter\", \"digit\"]\n        }\n      }\n    }\n  },\n  \"mappings\": {\n    \"properties\": {\n      \"title\": {\n        \"type\": \"text\",\n        \"fields\": {\n          \"autocomplete\": { \"type\": \"text\", \"analyzer\": \"autocomplete_analyzer\" }\n        }\n      },\n      \"brand\": { \"type\": \"keyword\" },\n      \"price\": { \"type\": \"scaled_float\", \"scaling_factor\": 100 },\n      \"in_stock\": { \"type\": \"boolean\" }\n    }\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-search-inverted",
      "category": "tradeoffs",
      "label": "Inverted Index & Analyzer Architecture",
      "description": "Details text analysis, tokenizers, edge-ngram, and BKD tree numeric indexing.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Deep mastery of text analyzers, inverted index, BKD trees, and doc_values for aggregations."
        },
        {
          "score": 2,
          "description": "Suggests Elasticsearch but unaware of analyzer pipelines or alias swapping."
        },
        {
          "score": 0,
          "description": "Suggests doing ILIKE %query% in Postgres."
        }
      ]
    }
  ],
  "alternatives": [
    "PostgreSQL `pgvector` + `pg_trgm` if catalog is smaller than 200k items.",
    "Algolia / Meilisearch for managed developer-friendly search."
  ],
  "commonMistakes": [
    "Running wildcards `*term*` in production: leading wildcards bypass inverted indexes and force a full cluster scan.",
    "Putting filters in the `must` clause instead of `filter` clause, calculating unnecessary relevance scores for boolean attributes and preventing cache utilization."
  ],
  "followUps": [
    {
      "id": "sys-fq-5",
      "question": "Why should filters like `in_stock: true` be placed in the `filter` context instead of the `must` context in Elasticsearch?",
      "expectedConcepts": [
        "Filter context skips scoring (saves CPU)",
        "Filter context results are cached in bitsets in RAM",
        "Must context calculates BM25 score for every document"
      ],
      "sampleStrongAnswer": "The `must` context calculates a relevance score (BM25) for each document matching the clause. In contrast, the `filter` context asks a binary yes/no question without calculating scores. Elasticsearch automatically caches filter context results in memory as compact roaring bitsets, providing nearly instant filtering and significantly lower CPU utilization."
    }
  ]
}
```
