WITH updated_bucket AS (
    UPDATE rate_limit_buckets
    SET 
        tokens = CASE 
            WHEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) >= 1.0
            THEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) - 1.0
            ELSE LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec))
        END,
        last_refilled_at = clock_timestamp()
    WHERE tenant_id = 101
    RETURNING tenant_id, tokens, max_tokens
)
SELECT 
    tenant_id,
    tokens,
    CASE WHEN tokens >= 0.0 THEN true ELSE false END AS allowed
FROM updated_bucket;
