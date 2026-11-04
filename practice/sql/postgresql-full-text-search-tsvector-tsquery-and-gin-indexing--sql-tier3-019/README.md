# PostgreSQL Full-Text Search: tsvector, tsquery, and GIN Indexing

Collection: sql · ID: `sql-tier3-019` · Mode: **guided**

## Business context

Customers complain that searching for "wireless headphone" in your e-commerce store fails to return products titled "Wireless Bluetooth Headphones" when using `LIKE '%wireless headphone%'`. Furthermore, the `LIKE` query takes 900ms.

## Task

Explain PostgreSQL native Full-Text Search. Compare `tsvector` and `tsquery`. Explain text normalization (tokenization, stop words, stemming with Snowball dictionary). Provide the SQL to create a generated `tsvector` column, a GIN index, and a ranked search query using `ts_rank()`.

## Follow-up questions

- When should you use `pg_trgm` (trigram similarity) instead of or in addition to `tsvector` Full-Text Search?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
