# Reference: Correlated Columns and Multi-Column Extended Statistics (CREATE STATISTICS)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Default Conditional Independence Assumption:**\n- PostgreSQL gathers single-column statistics in `pg_statistic` (accessible via `pg_stats`).\n- When a query filters by multiple columns (`WHERE colA = 'x' AND colB = 'y'`), PostgreSQL assumes the two columns are **statistically independent**.\n- It multiplies their independent selectivities:\n  $$P(A \\land B) = P(A) \\times P(B)$$\n- Example: If `make = 'Audi'` is 1% ($0.01$) and `model = 'R8'` is 0.01% ($0.0001$), PostgreSQL estimates selectivity as $0.01 \\times 0.0001 = 0.000001$ (1 row in a million).\n- In reality, all R8s are Audis! The true probability is correlated ($P(B|A) \\approx 1$), so the actual row count is 85,000 rows. A 85,000x error!\n\n**2. Resolution via Extended Statistics (`CREATE STATISTICS`):**\nPostgreSQL allows defining multi-column statistics objects:\n```sql\nCREATE STATISTICS stat_cars_make_model (dependencies, mcv)\nON make, model FROM cars;\n\nANALYZE cars;\n```\n\n**3. Types of Extended Statistics:**\n- **Functional Dependencies (`dependencies`)**: Measures how strongly one column determines another (degree of dependency from 0.0 to 1.0). Corrects selectivity when one column implies another.\n- **Most Common Values (`mcv`)**: Builds an N-dimensional multi-column frequency list of the most common combinations of values.\n- **Distinct Counts (`ndistinct`)**: Tracks true combined distinct count for `GROUP BY colA, colB` to eliminate memory spills in hash aggregations.",
    "followUp": {
      "question": "Does `CREATE STATISTICS` automatically gather statistics immediately upon execution?",
      "expectedAnswer": "No. `CREATE STATISTICS` merely registers the metadata intent in `pg_statistic_ext`. No data is sampled or analyzed until you explicitly run `ANALYZE <tablename>;`. Until `ANALYZE` is executed, the query planner will continue using the default independent probability model."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains mathematical multiplication of independent probabilities",
      "Details catastrophic consequences of cardinality misestimation on join choice",
      "Explains functional dependencies, MCV, and ndistinct extended stats",
      "Provides CREATE STATISTICS DDL and emphasizes mandatory ANALYZE"
    ]
  },
  "expectedConcepts": [
    "Conditional independence assumption: P(A and B) = P(A) * P(B)",
    "Severe underestimation on correlated attributes",
    "Planner picking nested loop due to 1-row estimation",
    "CREATE STATISTICS syntax with dependencies, mcv, and ndistinct",
    "Mandatory ANALYZE step to populate the statistics object"
  ]
}
```
