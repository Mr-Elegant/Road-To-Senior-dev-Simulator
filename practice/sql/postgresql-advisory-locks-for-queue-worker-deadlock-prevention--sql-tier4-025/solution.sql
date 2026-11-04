-- Concurrency-safe payment capture with transaction advisory lock
-- Parameters: customer_id = 42, refund_amount = 50.00
BEGIN;

-- 1. Acquire transaction-level advisory lock on customer ID to serialize customer operations
SELECT pg_advisory_xact_lock(42);

-- 2. Safely deduct balance without risk of deadlocks with other transactions
UPDATE customers
SET balance = balance - 50.00
WHERE id = 42
RETURNING id, balance;

COMMIT;