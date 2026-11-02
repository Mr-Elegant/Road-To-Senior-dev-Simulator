# Reference: Database Security: Role Inheritance, Schema search_path Poisoning, and SECURITY DEFINER

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. SECURITY DEFINER vs SECURITY INVOKER:**\n- `SECURITY INVOKER` (default): The function executes with the privileges of the user who calls it.\n- `SECURITY DEFINER`: The function executes with the privileges of the user who **created/owns** the function (e.g. `postgres` superuser), similar to a Unix `setuid` binary.\n\n**2. Search Path Hijacking Attack:**\n- When a function calls an unqualified table or function name (e.g. `SELECT * FROM orders` or `SELECT lower(str)`), PostgreSQL searches schemas in the order defined by the caller’s `search_path`.\n- If an unprivileged user can create objects in a public or temporary schema (`pg_temp`), they can create a malicious function or table with the same name (e.g. `public.lower()` or `pg_temp.orders`).\n- When the `SECURITY DEFINER` function runs, it executes the attacker’s malicious code with superuser privileges.\n\n**3. Mandatory Defensive Hardening:**\n```sql\nCREATE OR REPLACE FUNCTION process_refund(p_order_id INT)\nRETURNS VOID\nSECURITY DEFINER\n-- 1. Reset search_path to safe trusted system catalog and lock out public/temp schemas\nSET search_path = pg_catalog, pg_temp\nLANGUAGE plpgsql AS $$\nBEGIN\n    -- 2. Fully qualify all user schema object references\n    UPDATE public.orders \n    SET status = 'REFUNDED' \n    WHERE id = p_order_id;\nEND;\n$$;\n\n-- 3. Revoke default public execution rights\nREVOKE ALL ON FUNCTION process_refund(INT) FROM PUBLIC;\nGRANT EXECUTE ON FUNCTION process_refund(INT) TO finance_app_role;\n```",
    "followUp": {
      "question": "Why does PostgreSQL 15+ no longer grant `CREATE` privileges on the `public` schema to `PUBLIC` by default?",
      "expectedAnswer": "In PG 14 and earlier, any connected user could create tables and functions in the `public` schema by default. This made search_path poisoning trivial on multi-user databases. PostgreSQL 15 removed `CREATE` on schema `public` from the pseudo-role `PUBLIC` to prevent unprivileged users from planting malicious objects in shared schemas."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Explains SECURITY DEFINER privileges and setuid vulnerability",
      "Details search_path poisoning and object resolution mechanics",
      "Provides hardened function DDL with explicit SET search_path",
      "Revokes public execute permissions and qualifies schema names"
    ]
  },
  "expectedConcepts": [
    "SECURITY DEFINER executing as function owner (setuid analogy)",
    "search_path resolution order and object substitution attack",
    "Exploitation via public schema or pg_temp shadow functions",
    "Mandatory SET search_path = pg_catalog, pg_temp clause",
    "Explicit schema qualification (public.table) and REVOKE EXECUTE FROM PUBLIC"
  ]
}
```
