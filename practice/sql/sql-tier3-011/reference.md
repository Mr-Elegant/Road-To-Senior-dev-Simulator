# Reference: Row-Level Security (RLS) for Multi-Tenant Database Architecture

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Enabling and Forcing RLS:**\n```sql\n-- Enable RLS on multi-tenant table\nALTER TABLE invoices ENABLE ROW LEVEL SECURITY;\n\n-- CRITICAL: Prevent table owner from accidentally bypassing RLS\nALTER TABLE invoices FORCE ROW LEVEL SECURITY;\n```\n\n**2. Implementing RLS Policies using Session Context:**\n```sql\n-- Create isolation policy based on runtime session variable\nCREATE POLICY tenant_isolation_policy ON invoices\n    FOR ALL\n    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::int)\n    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::int);\n```\n\n**3. Application Runtime Flow:**\nWhen a connection is checked out from the connection pool:\n```sql\n-- Set tenant context for this specific transaction\nSET LOCAL app.current_tenant_id = '42';\n\n-- Application query without explicit WHERE clause:\nSELECT * FROM invoices; -- PostgreSQL automatically rewrites query to enforce tenant_id = 42\n```\n\n**4. Security Pitfalls & Bypass Hazards:**\n- `SUPERUSER` and roles with `BYPASSRLS` attribute ignore RLS completely. The application backend must connect as an unprivileged role without `BYPASSRLS`.\n- Without `FORCE ROW LEVEL SECURITY`, the table owner role bypasses RLS policies.\n- `SET LOCAL` ensures the session variable is automatically cleared at transaction boundaries, preventing leakage across pooled connections.",
    "followUp": {
      "question": "Why can a query with a leakproof user-defined function or side-channel error reveal unauthorized tenant data even under RLS?",
      "expectedAnswer": "If a query contains functions or operators that are not marked `LEAKPROOF`, the query optimizer may push user-provided WHERE filters ahead of the RLS security barrier filter to optimize performance. A malicious user could craft an expression like `WHERE 1 / (CASE WHEN secret_col = 'target' THEN 0 ELSE 1 END) = 1` that throws a divide-by-zero error, leaking information about unauthorized rows before the RLS condition filters them."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Provides correct RLS DDL with ENABLE and FORCE",
      "Implements USING and WITH CHECK with session setting",
      "Explains SET LOCAL transaction isolation in connection pools",
      "Details SUPERUSER / BYPASSRLS bypass risks"
    ]
  },
  "expectedConcepts": [
    "ALTER TABLE ENABLE ROW LEVEL SECURITY",
    "FORCE ROW LEVEL SECURITY to restrict table owners",
    "current_setting(key, true) runtime session context",
    "USING (for read/delete) vs WITH CHECK (for insert/update)",
    "SET LOCAL transaction scoping in pooled connections",
    "BYPASSRLS and SUPERUSER privilege risks"
  ]
}
```
