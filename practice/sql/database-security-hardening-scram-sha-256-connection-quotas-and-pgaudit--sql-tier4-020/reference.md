# Reference: Database Security Hardening: SCRAM-SHA-256, Connection Quotas, and pgaudit

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. SCRAM-SHA-256 vs Legacy MD5:**\n- `md5` authentication in PostgreSQL is vulnerable to dictionary attacks and rainbow tables because the stored hash is merely `md5(password + username)`.\n- `scram-sha-256` (RFC 7677) uses cryptographic salt, PBKDF2 key stretching (4096 iterations), and mutual client-server authentication without sending passwords over the wire.\n- **Migration Steps**:\n  1. Set `password_encryption = 'scram-sha-256'` in `postgresql.conf`.\n  2. Reset all database user passwords: `ALTER USER app_user WITH PASSWORD 'new_secret';` to generate SCRAM verifier strings.\n  3. Update `pg_hba.conf` authentication method to `scram-sha-256`.\n\n**2. Connection Limits & DoS Prevention:**\nPrevent a misconfigured service pod from exhausting the database connection pool:\n```sql\nALTER ROLE app_user CONNECTION LIMIT 50;\nALTER ROLE analytics_worker CONNECTION LIMIT 5;\n```\n\n**3. Schema Isolation Principle of Least Privilege:**\n```sql\nREVOKE CREATE ON SCHEMA public FROM PUBLIC;\nCREATE SCHEMA app AUTHORIZATION app_owner;\nGRANT USAGE ON SCHEMA app TO app_user;\nGRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_user;\nALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;\n```\n\n**4. Compliance Auditing with `pgaudit`:**\n- Add `pgaudit` to `shared_preload_libraries`.\n- Configure audit categories in `postgresql.conf`:\n  `pgaudit.log = 'ROLE, DDL, MISC'`\n  `pgaudit.log_catalog = off`\n  `pgaudit.log_parameter = on` (records parameterized values for forensic analysis).\n- Writes structured audit records to PostgreSQL syslog/journald for SIEM ingestion.",
    "followUp": {
      "question": "Why should `pgaudit.log = 'READ'` be used with extreme caution on production databases?",
      "expectedAnswer": "`pgaudit.log = 'READ'` logs every single `SELECT` statement and rows scanned across the entire database. On high-throughput production systems, this generates gigabytes of logs per minute, saturating disk I/O, filling log volumes, and drastically increasing query latency."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Outlines end-to-end SCRAM-SHA-256 migration procedure",
      "Configures CONNECTION LIMIT per role to prevent pool starvation",
      "Implements least privilege schema security and default privileges",
      "Details pgaudit extension parameters and logging categories"
    ]
  },
  "expectedConcepts": [
    "SCRAM-SHA-256 PBKDF2 salting vs MD5 rainbow table vulnerability",
    "password_encryption setting and pg_hba.conf enforcement",
    "ALTER ROLE ... CONNECTION LIMIT for connection starvation defense",
    "Least privilege schema permissions and ALTER DEFAULT PRIVILEGES",
    "pgaudit extension configuration for DDL, ROLE, and parameter logging"
  ]
}
```
