# Reference: Custom PostgreSQL Types: DOMAIN vs ENUM vs Composite Types

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. PostgreSQL ENUM (`CREATE TYPE ... AS ENUM`):**\n- **Storage**: Stored internally as a 4-byte integer pointing to `pg_enum`, saving massive disk space over repetitive text strings (`VARCHAR`).\n- **Benefits**: Strict compile-time validation, self-documenting schema.\n- **Production Hazards**: In older PostgreSQL versions, altering an ENUM required table locks. While `ALTER TYPE ... ADD VALUE` is now safe, **you cannot remove an enum value** or rename values without dropping dependent tables/columns or editing system catalogs, making schema deprecation difficult.\n\n**2. PostgreSQL DOMAIN (`CREATE DOMAIN`):**\n- **Definition**: A user-defined scalar data type based on an underlying primitive (e.g. `NUMERIC(15,2)`), augmented with reusable `CHECK` constraints and `DEFAULT` values.\n- **Example**: `CREATE DOMAIN monetary_amount AS NUMERIC(12,2) CHECK (VALUE >= 0);`\n- **Benefits**: Reusable business validation across dozens of tables. Changing the domain check rule centrally cascades validation across all columns using the domain without redefining constraints.\n\n**3. COMPOSITE TYPE (`CREATE TYPE ... AS (...)`):**\n- **Definition**: A structured type containing named fields, identical to a table row schema without an underlying table.\n- **Example**: `CREATE TYPE address_type AS (street VARCHAR(100), city VARCHAR(50), postal_code VARCHAR(20));`\n- **Use Cases**: Structured return types from stored functions and PL/pgSQL procedures.",
    "followUp": {
      "question": "Why do many senior database engineers prefer a lookup table with a foreign key (`status_id REFERENCES statuses(id)`) over a PostgreSQL ENUM for rapidly evolving business statuses?",
      "expectedAnswer": "A lookup table allows adding, deprecating, disabling, and renaming statuses with standard DML (`INSERT`, `UPDATE`), supports soft-deletion (`is_active = false`), allows storing rich metadata (e.g., display label, allowed next transitions), and avoids non-standard DDL migration lock risks associated with ENUM alteration."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Explains 4-byte internal storage of ENUM types",
      "Details the operational difficulty of removing values from an ENUM",
      "Defines DOMAIN and demonstrates reusable CHECK constraint usage",
      "Compares ENUM against foreign-key lookup tables"
    ]
  },
  "expectedConcepts": [
    "4-byte internal storage of ENUM vs text storage",
    "ENUM operational hazard (cannot easily remove or reorder enum values)",
    "DOMAIN as constrained primitive type with reusable CHECK rules",
    "COMPOSITE TYPE for multi-attribute structured models and function returns",
    "Comparison with standard VARCHAR + CHECK constraint table pattern"
  ]
}
```
