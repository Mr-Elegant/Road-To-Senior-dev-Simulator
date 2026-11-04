# Reference: Advisory Locks for Distributed Idempotency and Rate Limiting

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Concurrency Race Condition:**\nIn `READ COMMITTED` or `REPEATABLE READ`, multiple transactions read `is_redeemed = FALSE` concurrently because no single row was locked yet. All transactions proceed to generate discounts.\n\n**2. Solution with Transaction Advisory Locks:**\nUsing `pg_advisory_xact_lock`: Take an in-memory lock on the hash of the coupon code before querying:\n```sql\nCREATE OR REPLACE FUNCTION redeem_coupon(p_user_id INT, p_coupon_code TEXT)\nRETURNS BOOLEAN AS $$\nDECLARE\n    v_already_used BOOLEAN;\nBEGIN\n    -- 1. Acquire transaction-level advisory lock on 64-bit hash of coupon code\n    -- Concurrent requests for the SAME coupon will wait here in queue\n    PERFORM pg_advisory_xact_lock(hashtext(p_coupon_code));\n\n    -- 2. Check current state (reads latest committed state)\n    SELECT is_redeemed INTO v_already_used\n    FROM coupons\n    WHERE code = p_coupon_code;\n\n    IF v_already_used THEN\n        RETURN FALSE; -- Coupon already redeemed by previous transaction in queue\n    END IF;\n\n    -- 3. Mark coupon redeemed and record transaction\n    UPDATE coupons SET is_redeemed = TRUE, redeemed_by = p_user_id, redeemed_at = clock_timestamp()\n    WHERE code = p_coupon_code;\n\n    RETURN TRUE;\nEND;\n$$ LANGUAGE plpgsql;\n```\n\n**3. Comparison with SELECT FOR UPDATE:**\n- `SELECT ... FOR UPDATE` locks the physical row in the `coupons` table. It works if the row already exists, but writes XIDs to the heap page and can cause lock wait timeouts on hot tables.\n- `pg_advisory_xact_lock` works in PostgreSQL shared memory with zero disk writes, does not bloat tables, and automatically releases when the transaction commits or aborts.\n- If the coupon does not yet exist in the table (e.g. first-time insert), `SELECT FOR UPDATE` cannot lock anything, whereas `pg_advisory_xact_lock` locks the logical entity name before insert, preventing duplicate creation races.",
    "followUp": {
      "question": "What is a potential hash collision hazard when using `hashtext(string)` with 32-bit advisory locks, and how do you resolve it?",
      "expectedAnswer": "`hashtext()` returns a 32-bit integer, which has a small probability of hash collisions ($2^{-32}$) across millions of strings. A collision would cause two unrelated coupons with colliding hashes to briefly serialize against each other. To mitigate, use `pg_advisory_xact_lock(int4, int4)` with two independent 32-bit hashes or use 64-bit hashing via `('x' || substr(md5(string), 1, 16))::bit(64)::bigint`."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Implements pg_advisory_xact_lock with string hashing",
      "Explains why concurrent requests serialize safely",
      "Contrasts advisory locks with SELECT FOR UPDATE (especially non-existent rows)",
      "Addresses hash collision handling in 32-bit vs 64-bit keys"
    ]
  },
  "expectedConcepts": [
    "pg_advisory_xact_lock with hashtext() hash key",
    "Serialization of concurrent requests for identical resource",
    "Automatic transaction-boundary lock release",
    "Advantages over row-level locks when rows do not yet exist (insert race)",
    "Zero disk I/O and zero tuple bloat in shared memory lock table"
  ]
}
```
