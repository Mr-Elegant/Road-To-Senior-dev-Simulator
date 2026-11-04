# Reference: Audit Logging with Trigger Functions and pg_trigger_depth

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Trigger Architecture:**\n- `BEFORE`: Executes before the row is written to disk. Can modify `NEW` values or cancel the operation (by returning `NULL`).\n- `AFTER`: Executes after row is written to the table heap. Cannot modify `NEW`. Ideal for audit logging and cascading notifications.\n- `FOR EACH ROW`: Fires once per affected tuple.\n- `FOR EACH STATEMENT`: Fires once per SQL command regardless of how many rows were updated.\n\n**2. Generic Audit Trigger Implementation:**\n```sql\nCREATE TABLE audit_logs (\n    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    table_name TEXT NOT NULL,\n    operation TEXT NOT NULL,\n    record_id TEXT NOT NULL,\n    old_data JSONB,\n    new_data JSONB,\n    changed_by TEXT NOT NULL DEFAULT current_user,\n    changed_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()\n);\n\nCREATE OR REPLACE FUNCTION audit_record_change()\nRETURNS TRIGGER AS $$\nBEGIN\n    -- Prevent recursive trigger loops if audit triggers cascade\n    IF pg_trigger_depth() > 1 THEN\n        RETURN NEW;\n    END IF;\n\n    IF TG_OP = 'DELETE' THEN\n        INSERT INTO audit_logs (table_name, operation, record_id, old_data)\n        VALUES (TG_TABLE_NAME, TG_OP, OLD.id::text, to_jsonb(OLD));\n        RETURN OLD;\n    ELSIF TG_OP = 'UPDATE' THEN\n        INSERT INTO audit_logs (table_name, operation, record_id, old_data, new_data)\n        VALUES (TG_TABLE_NAME, TG_OP, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW));\n        RETURN NEW;\n    ELSIF TG_OP = 'INSERT' THEN\n        INSERT INTO audit_logs (table_name, operation, record_id, new_data)\n        VALUES (TG_TABLE_NAME, TG_OP, NEW.id::text, to_jsonb(NEW));\n        RETURN NEW;\n    END IF;\n    RETURN NULL;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_loans_audit\nAFTER INSERT OR UPDATE OR DELETE ON loans\nFOR EACH ROW EXECUTE FUNCTION audit_record_change();\n```",
    "followUp": {
      "question": "What performance overhead do row-level audit triggers introduce on high-throughput batch UPDATE statements, and how can that be mitigated?",
      "expectedAnswer": "Row-level triggers force PostgreSQL to execute the PL/pgSQL function once per row, writing an audit row for every updated tuple. This turns a single bulk SQL statement into thousands of individual inserts, multiplying WAL writes and duration. Mitigation includes using statement-level triggers with transition tables (`REFERENCING NEW TABLE AS new_rows`), or offloading auditing to logical decoding / CDC tools like Debezium."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Differentiates BEFORE vs AFTER and ROW vs STATEMENT triggers",
      "Implements valid PL/pgSQL audit function with OLD/NEW handling",
      "Uses to_jsonb() for clean polymorphic schema logging",
      "Includes pg_trigger_depth() recursion guard"
    ]
  },
  "expectedConcepts": [
    "BEFORE vs AFTER trigger lifecycle",
    "FOR EACH ROW vs FOR EACH STATEMENT execution scope",
    "OLD and NEW record structures and TG_OP variable",
    "to_jsonb(OLD/NEW) serialization into structured JSONB",
    "pg_trigger_depth() guard against recursive cascades"
  ]
}
```
