SELECT 
    id,
    loan_id,
    payment_date,
    amount,
    -- 2-row moving average (current row and 1 preceding physical row)
    AVG(amount) OVER (
        PARTITION BY loan_id 
        ORDER BY payment_date, id 
        ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
    ) AS physical_2row_avg,
    -- Rolling sum over identical dates
    SUM(amount) OVER (
        PARTITION BY loan_id 
        ORDER BY amount
        RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS range_accum_sum
FROM repayments
ORDER BY loan_id, payment_date;