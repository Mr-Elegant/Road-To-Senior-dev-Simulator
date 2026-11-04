WITH claimed_jobs AS (
    SELECT id
    FROM outbox_events
    WHERE status = 'PENDING'
    ORDER BY id ASC
    LIMIT 5
    FOR UPDATE SKIP LOCKED
)
UPDATE outbox_events
SET 
    status = 'PROCESSING',
    processed_at = CURRENT_TIMESTAMP
FROM claimed_jobs
WHERE outbox_events.id = claimed_jobs.id
RETURNING outbox_events.id, outbox_events.payload, outbox_events.status;
