CREATE TABLE customers (
  id INT PRIMARY KEY,
  full_name VARCHAR(100),
  credit_score INT,
  monthly_income DECIMAL(12,2),
  pan_number VARCHAR(20),
  kyc_status VARCHAR(20)
);

CREATE TABLE loan_applications (
  id INT PRIMARY KEY,
  customer_id INT,
  requested_amount DECIMAL(12,2),
  tenure_months INT,
  purpose VARCHAR(50),
  status VARCHAR(20),
  applied_at VARCHAR(30)
);

CREATE TABLE loans (
  id INT PRIMARY KEY,
  application_id INT,
  customer_id INT,
  principal_amount DECIMAL(12,2),
  interest_rate DECIMAL(5,2),
  start_date VARCHAR(30),
  maturity_date VARCHAR(30),
  status VARCHAR(20)
);

CREATE TABLE emi_schedule (
  id INT PRIMARY KEY,
  loan_id INT,
  installment_number INT,
  due_date VARCHAR(30),
  principal_due DECIMAL(10,2),
  interest_due DECIMAL(10,2),
  total_due DECIMAL(10,2),
  status VARCHAR(20)
);

CREATE TABLE repayments (
  id INT PRIMARY KEY,
  loan_id INT,
  emi_id INT,
  amount_paid DECIMAL(10,2),
  payment_date VARCHAR(30),
  payment_mode VARCHAR(30),
  reference_number VARCHAR(50)
);

CREATE TABLE transactions (
  id INT PRIMARY KEY,
  loan_id INT,
  type VARCHAR(30),
  amount DECIMAL(12,2),
  balance_after DECIMAL(12,2),
  created_at VARCHAR(30)
);
