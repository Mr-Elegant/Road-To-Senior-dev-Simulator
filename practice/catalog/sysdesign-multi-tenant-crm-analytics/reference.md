# Reference: Real-Time Multi-Tenant CRM Analytics & Aggregation Engine

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Architecture:\n1. Operational vs Analytical Decoupling:\n- Never run heavy OLAP aggregate queries on your primary OLTP transactional database.\n- OLTP (PostgreSQL): Optimized for high-frequency point reads and ACID writes (row-oriented).\n- OLAP (ClickHouse / Snowflake): Columnar storage, vectorized query execution, massive parallel processing (MPP).\n\n2. Ingestion Pipeline (Near Real-Time):\n- CDC (Change Data Capture) via Debezium monitors PostgreSQL WAL and publishes events to Apache Kafka.\n- ClickHouse consumes directly from Kafka using the ClickHouse Kafka Engine or an ingestion microservice (Vector / Go consumer) with micro-batching (batches of 10,000 rows or 2 seconds).\n\n3. ClickHouse Table Design:\n- Engine: ReplicatedReplacingMergeTree / ReplicatedSummingMergeTree\n- Partition by: 'toYYYYMM(event_date)'\n- Order by (Primary Sort Key): '(tenant_id, event_type, event_date, id)'\nBecause 'tenant_id' is the primary prefix of the sparse index, ClickHouse prunes 99.99% of data blocks instantly when querying for a specific tenant.\n\n4. Noisy-Neighbor Protection:\n- Analytics API Gateway assigns tenants into tiers: Enterprise, Pro, Free.\n- Query Concurrency Limits: Enterprise tenants get up to 20 concurrent queries; Free tenants get 2.\n- Query Timeouts: Hard cap at 5 seconds; queries scanning more than 10M rows are aborted.",
    "codeOrArtifact": "/* ClickHouse Table DDL */\nCREATE TABLE crm_analytics_events\n(\n    tenant_id UUID,\n    event_id UUID,\n    event_type LowCardinality(String),\n    event_timestamp DateTime64(3, 'UTC'),\n    event_date Date DEFAULT toDate(event_timestamp),\n    lead_id UUID,\n    deal_amount Decimal64(2),\n    stage LowCardinality(String),\n    source LowCardinality(String),\n    rep_id UUID,\n    custom_properties Map(String, String)\n)\nENGINE = ReplicatedReplacingMergeTree('/clickhouse/tables/{shard}/crm_events', '{replica}')\nPARTITION BY toYYYYMM(event_date)\nPRIMARY KEY (tenant_id, event_type, event_date)\nORDER BY (tenant_id, event_type, event_date, event_id)\nSETTINGS index_granularity = 8192;"
  },
  "rubric": [
    {
      "id": "rb-olap-separation",
      "category": "tradeoffs",
      "label": "OLTP vs OLAP Separation & Columnar Storage",
      "description": "Decouples analytical workloads from operational database using columnar database.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Selects ClickHouse/StarRocks, designs partitioning/sorting keys by tenant_id, uses CDC ingestion."
        },
        {
          "score": 2,
          "description": "Uses Postgres read replicas (helps read scale, but still struggles with large aggregations)."
        },
        {
          "score": 0,
          "description": "Queries production transactional database directly."
        }
      ]
    },
    {
      "id": "rb-tenant-isolation",
      "category": "security",
      "label": "Multi-Tenant Isolation & Noisy Neighbor Defense",
      "description": "Implements tenant query queuing, CPU limits, and strict WHERE tenant_id scoping.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Enforces tenant_id partitioning, per-tenant query concurrency quotas, and row-level security."
        },
        {
          "score": 1,
          "description": "Mentions tenant_id in WHERE clause without resource quotas."
        },
        {
          "score": 0,
          "description": "No isolation architecture."
        }
      ]
    }
  ],
  "alternatives": [
    "PostgreSQL with TimescaleDB / Citus extension for smaller scale (< 50M events)."
  ],
  "commonMistakes": [
    "Creating separate database tables or schemas for each of the 10,000 tenants in ClickHouse (leads to metadata explosion and file descriptor exhaustion).",
    "Ingesting events row-by-row into ClickHouse: ClickHouse requires micro-batches (e.g. 5,000+ rows per insert) to prevent part-creation thrashing."
  ],
  "followUps": [
    {
      "id": "sys-fq-3",
      "question": "Why does ClickHouse require batched inserts instead of single-row inserts?",
      "expectedConcepts": [
        "Each INSERT creates an immutable data part on disk",
        "Too many parts triggers \"Too many parts in all data parts in table\" error",
        "Micro-batching allows efficient LSM tree compaction"
      ],
      "sampleStrongAnswer": "Every `INSERT` in ClickHouse writes an immutable directory (a \"part\") on disk. Background merge threads asynchronously combine smaller parts into larger parts. If you insert single rows 1,000 times a second, parts are created faster than background merges can consolidate them, crashing the server with the dreaded \"Too many parts in table\" error. Batches of 5,000–50,000 rows allow optimal compression and disk I/O."
    }
  ]
}
```
