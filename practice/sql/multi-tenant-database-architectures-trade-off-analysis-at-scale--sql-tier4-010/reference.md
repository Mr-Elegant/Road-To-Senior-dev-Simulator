# Reference: Multi-Tenant Database Architectures: Trade-Off Analysis at Scale

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Pattern 1: Shared Database, Shared Schema (with RLS)**\n- **Architecture**: Single database, all tenants share tables (`tenant_id` column on every table), enforced by Row-Level Security policies.\n- **Pros**: Simplest schema migrations (run once), maximum connection pool efficiency, lowest infrastructure cost.\n- **Cons**: \"Noisy neighbor\" problem (one tenant's heavy query degrades others), impossible to restore single tenant from physical backup without ETL, strict developer discipline needed to prevent data leaks.\n- **Scale Limit**: ~5,000-50,000 tenants before partitioning is mandatory.\n\n**2. Pattern 2: Shared Database, Separate Schema per Tenant (`CREATE SCHEMA tenant_42`)**\n- **Architecture**: One database instance, each tenant has its own isolated schema with private tables.\n- **Pros**: Logical data separation, per-tenant table customization, search_path routing.\n- **Cons**: **PostgreSQL System Catalog Bloat Disaster**. If you have 10,000 tenants and 50 tables, PostgreSQL must maintain $10,000 \\times 50 = 500,000$ tables in `pg_class` and `pg_attribute`. System catalog caches (`relcache`) exhaust gigabytes of RAM. Migrations must loop through 10,000 schemas, taking hours.\n- **Recommendation**: Avoid beyond ~500 tenants.\n\n**3. Pattern 3: Separate Database per Tenant**\n- **Architecture**: Each tenant has a dedicated PostgreSQL database (or container).\n- **Pros**: Absolute physical security isolation, independent backup and restore, zero noisy neighbor risk, easy regulatory compliance (SOC2/HIPAA).\n- **Cons**: High connection pool overhead (PgBouncer must manage separate pools per DB), costly multi-database migration pipelines, idle resource waste for small tenants.\n\n**Hybrid Architecture (Industry Best Practice):**\n- Standard Tier: Shared Database with RLS for 98% of small/mid-sized tenants.\n- Enterprise Tier: Dedicated Database per tenant for high-paying enterprise contracts.",
    "followUp": {
      "question": "Why does PgBouncer struggle when an application uses the Separate Database per Tenant model with 5,000 databases?",
      "expectedAnswer": "PgBouncer maintains separate connection pools per `(database, user)` pair. If 5,000 databases each require even a minimum pool of 2 backend connections, PostgreSQL would require at least 10,000 backend processes, completely exhausting server memory and exceeding max_connections."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Analyzes all three multi-tenant models systematically",
      "Identifies catalog bloat (pg_class/relcache) in schema-per-tenant",
      "Evaluates connection pooling constraints in database-per-tenant",
      "Proposes hybrid tiering architecture for real-world enterprise SaaS"
    ]
  },
  "expectedConcepts": [
    "Shared schema with RLS cost and migration simplicity",
    "Schema-per-tenant system catalog (pg_class) bloat limit",
    "Database-per-tenant isolation, backup, and connection pooling cost",
    "Noisy neighbor problem and noisy tenant partitioning",
    "Hybrid tiering architecture (Shared + Dedicated Enterprise)"
  ]
}
```
