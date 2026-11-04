# Reference: PostgreSQL Foreign Data Wrappers (postgres_fdw) and Pushdown

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. SQL/MED and postgres_fdw Overview:**\n- SQL/MED (Management of External Data) is an ANSI standard that allows a database to query external data sources as if they were local tables.\n- `postgres_fdw` provides read/write access to remote PostgreSQL servers transparently.\n\n**2. Setup Architecture:**\n```sql\n-- 1. Install extension\nCREATE EXTENSION postgres_fdw;\n\n-- 2. Define remote server connection\nCREATE SERVER core_db_server\n    FOREIGN DATA WRAPPER postgres_fdw\n    OPTIONS (host 'core-db.internal', dbname 'core_prod', port '5432');\n\n-- 3. Map local role to remote user credentials\nCREATE USER MAPPING FOR current_user\n    SERVER core_db_server\n    OPTIONS (user 'analytics_reader', password 'secret_token');\n\n-- 4. Import foreign schema or table\nIMPORT FOREIGN SCHEMA public LIMIT TO (users)\n    FROM SERVER core_db_server INTO remote_core;\n```\n\n**3. Query Pushdown Mechanics:**\n- **Predicate Pushdown**: If you run `SELECT * FROM remote_core.users WHERE created_at > '2026-01-01'`, `postgres_fdw` sends the WHERE clause to the remote server so only matching rows travel over the network.\n- **Aggregate & Join Pushdown**: When joining two foreign tables on the same remote server, or calculating `SUM()` / `COUNT()`, PostgreSQL pushes the join and aggregation to the remote server if `fetch_size` and options are configured.\n- **Limitations**: Joins between a local table and a foreign table cannot be pushed down; PostgreSQL must fetch candidate rows over the network to perform the join locally.",
    "followUp": {
      "question": "What setting controls how many rows `postgres_fdw` fetches in a single network round trip, and why is the default often suboptimal?",
      "expectedAnswer": "The `fetch_size` option (default 100 rows). Fetching in chunks of 100 causes severe network round-trip overhead when querying millions of rows over high-latency networks. Setting `OPTIONS (fetch_size '10000')` on the foreign server or table drastically reduces network latency."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Outlines DDL sequence: EXTENSION, SERVER, USER MAPPING, IMPORT",
      "Explains predicate and aggregate pushdown mechanics",
      "Identifies network latency bottlenecks and fetch_size optimization",
      "Delineates limitations of cross-node local-foreign joins"
    ]
  },
  "expectedConcepts": [
    "SQL/MED standard and postgres_fdw extension",
    "CREATE SERVER, USER MAPPING, and IMPORT FOREIGN SCHEMA workflow",
    "Predicate, aggregate, and sort pushdown to remote engine",
    "Network round-trip latency and fetch_size parameter",
    "Local-to-foreign join limitations"
  ]
}
```
