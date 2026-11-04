-- Concurrency-safe rate limit token bucket deduction
-- Table schema: (tenant_id INT PRIMARY KEY, tokens NUMERIC, max_tokens NUMERIC, refill_rate_per_sec NUMERIC, last_refilled_at TIMESTAMPTZ)
WITH updated_bucket AS (
    UPDATE rate_limit_buckets
    SET 
        tokens = CASE 
            -- If refilled tokens >= 1, deduct 1 token
            WHEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) >= 1.0
            THEN LEAST(max_tokens, tokens + (EXTRACT(EPOCH FROM (clock_timestamp() - last_refilled_at)) * refill_rate_per_sec)) - 1.0
            -- Otherwise leave current refilled tokens
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