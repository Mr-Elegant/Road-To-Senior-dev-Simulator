# Reference: E-Commerce Order History Endpoint N+1 Query & Composite Index Optimization

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "1. N+1 Problem: For 50 orders, the code executed 1 initial query + 50 individual item queries = 51 database roundtrips. Even with a low 2ms network ping, 51 queries sequentially take 100ms+ just in network round trips, tying up database connections.\n2. Missing Composite Index: 'WHERE user_id = $1 ORDER BY created_at DESC' requires the database to find rows matching user_id and sort them. Without an index on (user_id, created_at DESC), Postgres either does a Sequential Scan or an index scan on user_id followed by an in-memory Sort (quicksort or disk external sort).\n      \nFix:\n1. Index: CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);\n2. Query: Fetch orders and line items using JSON aggregation or 2 batch queries.",
    "codeOrArtifact": "/* DDL Composite Index */\n-- CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders (user_id, created_at DESC);\n-- CREATE INDEX CONCURRENTLY idx_order_items_order_id ON order_items (order_id);\n\nasync function getUserOrderHistoryOptimized(db, userId) {\n  const query = `\n    SELECT \n      o.id, \n      o.total_amount, \n      o.created_at,\n      COALESCE(\n        json_agg(\n          json_build_object('product_name', i.product_name, 'price', i.price, 'qty', i.qty)\n        ) FILTER (WHERE i.id IS NOT NULL), \n        '[]'\n      ) as items\n    FROM orders o\n    LEFT JOIN order_items i ON o.id = i.order_id\n    WHERE o.user_id = $1\n    GROUP BY o.id\n    ORDER BY o.created_at DESC\n    LIMIT 50\n  `;\n\n  const result = await db.query(query, [userId]);\n  return result.rows;\n}"
  },
  "rubric": [
    {
      "id": "rb-nplus-one",
      "category": "root_cause",
      "label": "N+1 Query & Indexing Architecture",
      "description": "Diagnoses N+1 round trips and designs optimal composite index.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Eliminates loop queries, writes composite index (user_id, created_at DESC), explains EXPLAIN ANALYZE."
        },
        {
          "score": 2,
          "description": "Fixes query with IN clause but forgets composite index."
        },
        {
          "score": 0,
          "description": "Leaves loop queries."
        }
      ]
    }
  ],
  "alternatives": [
    "Two-query approach: Query 1 fetches 50 orders; Query 2 fetches items WHERE order_id = ANY(orderIds); stitch together in application memory.",
    "Using GraphQL / DataLoader to batch and cache item lookups."
  ],
  "commonMistakes": [
    "Creating two separate single-column indexes on user_id and created_at instead of a single composite index.",
    "Ordering index columns as (created_at, user_id), which does not help equality filtering on user_id."
  ],
  "followUps": [
    {
      "id": "db-fq-2",
      "question": "What is the \"Equality, Sort, Range\" (ESR) rule when designing composite indexes?",
      "expectedConcepts": [
        "Equality columns first",
        "Sort columns second",
        "Range condition columns last"
      ],
      "sampleStrongAnswer": "The ESR rule states that columns queried with exact equality (=) should appear first in the composite index, followed by columns used for sorting (ORDER BY), and finally columns filtered with inequality/range operators (<, >, BETWEEN). This allows the B-Tree index to perform a direct lookup, walk the sorted branch, and slice range values without additional filter passes."
    }
  ]
}
```
