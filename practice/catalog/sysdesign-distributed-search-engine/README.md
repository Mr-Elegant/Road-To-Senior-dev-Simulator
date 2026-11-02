# E-Commerce Real-Time Full-Text Search & Faceted Filtering

Collection: catalog · ID: `sysdesign-distributed-search-engine` · Mode: **guided**

## Business context

An e-commerce retailer with 25,000,000 product SKUs needs sub-50ms search with autocomplete, typo tolerance, synonyms, faceted aggregations (brand, category, price ranges, rating), and real-time inventory filtering.

## Task

Architect an enterprise search engine cluster (Elasticsearch / OpenSearch). Describe the document indexing pipeline from PostgreSQL via CDC, the inverted index and BKD tree structure, shard distribution, query DSL construction for boolean query scoring with BM25, and zero-downtime index re-indexing via index aliases.

## Candidate tasks

- Design the inverted index document mapping with analyzers (stemming, lowercase, edge_ngram for autocomplete).
- Explain BM25 relevance scoring algorithm (term frequency, inverse document frequency, document length normalization).
- Design the zero-downtime re-indexing strategy using Index Aliases (`products_v1` -> `products_v2` with `_aliases` switch).
- Design faceted aggregations using doc_values for low memory footprint.

## Constraints

- Search query P99 latency: < 50ms across 25M products.
- Freshness: New products or price changes searchable within 3 seconds of DB commit.
- Support typo tolerance (Levenshtein edit distance 1-2) without killing performance.

## Follow-up questions

- Why should filters like `in_stock: true` be placed in the `filter` context instead of the `must` context in Elasticsearch?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
