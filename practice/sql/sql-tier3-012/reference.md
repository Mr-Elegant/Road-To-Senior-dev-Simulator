# Reference: PgBouncer Connection Pooling: Session vs Transaction vs Statement Modes

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why PostgreSQL Needs a Connection Pooler:**\n- PostgreSQL uses a process-based model (`fork()` per client connection). Each backend process allocates private memory (`work_mem`, stack, catalog caches) typically consuming 5-10MB RAM per idle connection.\n- 1,000 idle connections waste 5-10GB RAM, and OS scheduler context switching across hundreds of active processes causes CPU thrashing.\n- Optimal PostgreSQL performance is achieved with active connections $\\approx 2 \\times \\text{CPU cores} + \\text{disk spindle count}$.\n\n**2. PgBouncer Pooling Modes:**\n- **Session Pooling**: A server connection is dedicated to the client for the entire duration of the TCP session. Safest, supports all Postgres features, but lowest concurrency improvement.\n- **Transaction Pooling** (Industry Standard): A server connection is bound to a client only for the duration of a transaction (`BEGIN ... COMMIT`). When the transaction finishes, the server connection returns to the pool for another client. Multiplies throughput by 10-50x.\n- **Statement Pooling**: Server connection is assigned for a single SQL statement. Breaks multi-statement transactions; rarely used.\n\n**3. Features Broken by Transaction Pooling:**\n- `SET` / `RESET` session configuration (e.g. `SET timezone`, `SET search_path`). *Fix*: Use `SET LOCAL` inside transactions.\n- Server-side Prepared Statements (`PREPARE / EXECUTE`). *Fix*: Disable client-side prepared statements or use PgBouncer 1.21+ prepared statement support (`max_prepared_statements`).\n- Session-level advisory locks (`pg_advisory_lock`). *Fix*: Use transaction-level advisory locks (`pg_advisory_xact_lock`).\n- `LISTEN` / `NOTIFY`. *Fix*: Dedicate a small unpooled connection pool for pub/sub.\n- Temporary tables (`CREATE TEMP TABLE`). *Fix*: Avoid temp tables; use unlogged tables with transaction IDs or CTEs.",
    "followUp": {
      "question": "How does PgBouncer 1.21+ allow named prepared statements to work in transaction pooling mode?",
      "expectedAnswer": "PgBouncer 1.21+ intercepts protocol-level `Parse` and `Bind` messages. It tracks prepared statements created by clients, assigns internal unique hashes, and automatically transparently prepares the statement on whichever server backend connection is assigned to the transaction before binding and executing."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains process-per-connection architecture and memory footprint",
      "Compares Session, Transaction, and Statement pooling modes",
      "Itemizes features broken under transaction pooling",
      "Provides workarounds (SET LOCAL, max_prepared_statements)"
    ]
  },
  "expectedConcepts": [
    "PostgreSQL process-based architecture (fork) and memory overhead per connection",
    "Session vs Transaction vs Statement pooling comparison",
    "Features broken by transaction pooling: SET, PREPARE, temp tables, LISTEN/NOTIFY, session advisory locks",
    "SET LOCAL and transaction-level alternatives"
  ]
}
```
