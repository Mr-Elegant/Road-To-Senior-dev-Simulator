WITH duplicates_in_chunk AS (
    SELECT id
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY order_id, transaction_ref 
                ORDER BY id ASC
            ) AS rn
        FROM payments
        WHERE id BETWEEN 1 AND 5000
    ) ranked
    WHERE rn > 1
)
DELETE FROM payments
WHERE id IN (SELECT id FROM duplicates_in_chunk)
RETURNING id;
