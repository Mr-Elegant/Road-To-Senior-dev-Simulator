SELECT 
    id,
    loan_id,
    payment_date,
    amount,
    AVG(amount) OVER (
        PARTITION BY loan_id 
        ORDER BY payment_date, id 
        ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
    ) AS physical_2row_avg,
    SUM(amount) OVER (
        PARTITION BY loan_id 
        ORDER BY amount
        RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS range_accum_sum
FROM repayments
ORDER BY loan_id, payment_date;
