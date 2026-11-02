SELECT type, amount, created_at FROM transactions WHERE type = 'DISBURSEMENT' UNION ALL SELECT type, amount, created_at FROM transactions WHERE type = 'EMI_REPAYMENT' ORDER BY created_at ASC;
