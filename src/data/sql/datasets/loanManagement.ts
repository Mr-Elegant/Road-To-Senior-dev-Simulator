import { SqlDataset } from '@/types/sqlTrack';

export const loanManagementDataset: SqlDataset = {
  id: 'loan_management',
  name: 'ApexFin NBFC Credit & Loans',
  tagline: 'Enterprise Financial Lending, Repayment Ledger & Risk Risk Engine',
  description:
    'Core banking relational model handling loan origination, risk scores, amortized EMI repayment schedules, debt recovery collections, and ledger transactions.',
  tables: [
    {
      name: 'customers',
      description: 'Borrower KYC records with credit scores and documented monthly income',
      sampleRowCount: 8,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'full_name', type: 'VARCHAR(100)' },
        { name: 'credit_score', type: 'INT' },
        { name: 'monthly_income', type: 'DECIMAL(12,2)' },
        { name: 'pan_number', type: 'VARCHAR(20)' },
        { name: 'kyc_status', type: 'VARCHAR(20)' }, // 'VERIFIED', 'PENDING', 'REJECTED'
      ],
    },
    {
      name: 'loan_applications',
      description: 'Submitted loan requests undergoing automated risk assessment',
      sampleRowCount: 10,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'customer_id', type: 'INT', isForeignKey: true, references: 'customers.id' },
        { name: 'requested_amount', type: 'DECIMAL(12,2)' },
        { name: 'tenure_months', type: 'INT' },
        { name: 'purpose', type: 'VARCHAR(50)' }, // 'PERSONAL', 'BUSINESS', 'AUTO', 'HOME_RENOVATION'
        { name: 'status', type: 'VARCHAR(20)' }, // 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'
        { name: 'applied_at', type: 'VARCHAR(30)' },
      ],
    },
    {
      name: 'loans',
      description: 'Disbursed active credit agreements with principal and interest terms',
      sampleRowCount: 6,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'application_id', type: 'INT', isForeignKey: true, references: 'loan_applications.id' },
        { name: 'customer_id', type: 'INT', isForeignKey: true, references: 'customers.id' },
        { name: 'principal_amount', type: 'DECIMAL(12,2)' },
        { name: 'interest_rate', type: 'DECIMAL(5,2)' }, // Annual interest %
        { name: 'start_date', type: 'VARCHAR(30)' },
        { name: 'maturity_date', type: 'VARCHAR(30)' },
        { name: 'status', type: 'VARCHAR(20)' }, // 'ACTIVE', 'CLOSED', 'DEFAULTED'
      ],
    },
    {
      name: 'emi_schedule',
      description: 'Amortization calendar with scheduled monthly principal & interest obligations',
      sampleRowCount: 18,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'loan_id', type: 'INT', isForeignKey: true, references: 'loans.id' },
        { name: 'installment_number', type: 'INT' },
        { name: 'due_date', type: 'VARCHAR(30)' },
        { name: 'principal_due', type: 'DECIMAL(10,2)' },
        { name: 'interest_due', type: 'DECIMAL(10,2)' },
        { name: 'total_due', type: 'DECIMAL(10,2)' },
        { name: 'status', type: 'VARCHAR(20)' }, // 'PAID', 'PENDING', 'OVERDUE'
      ],
    },
    {
      name: 'repayments',
      description: 'Recorded payment installments credited towards active loans',
      sampleRowCount: 12,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'loan_id', type: 'INT', isForeignKey: true, references: 'loans.id' },
        { name: 'emi_id', type: 'INT', isForeignKey: true, references: 'emi_schedule.id' },
        { name: 'amount_paid', type: 'DECIMAL(10,2)' },
        { name: 'payment_date', type: 'VARCHAR(30)' },
        { name: 'payment_mode', type: 'VARCHAR(30)' }, // 'ACH', 'NEFT', 'UPI', 'AUTO_DEBIT'
        { name: 'reference_number', type: 'VARCHAR(50)' },
      ],
    },
    {
      name: 'transactions',
      description: 'Double-entry ledger journal recording balance drawdowns and credits',
      sampleRowCount: 12,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'loan_id', type: 'INT', isForeignKey: true, references: 'loans.id' },
        { name: 'type', type: 'VARCHAR(30)' }, // 'DISBURSEMENT', 'EMI_REPAYMENT', 'PENALTY_FEE'
        { name: 'amount', type: 'DECIMAL(12,2)' },
        { name: 'balance_after', type: 'DECIMAL(12,2)' },
        { name: 'created_at', type: 'VARCHAR(30)' },
      ],
    },
  ],
  schemaSql: `
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
  `.trim(),
  seedSql: `
INSERT INTO customers VALUES (1, 'Rajesh Kannan', 785, 120000.00, 'ABCDE1234F', 'VERIFIED');
INSERT INTO customers VALUES (2, 'Priya Nair', 720, 85000.00, 'BCDEF2345G', 'VERIFIED');
INSERT INTO customers VALUES (3, 'Ankit Verma', 640, 50000.00, 'CDEFG3456H', 'VERIFIED');
INSERT INTO customers VALUES (4, 'Sunita Rao', 810, 210000.00, 'DEFGH4567I', 'VERIFIED');
INSERT INTO customers VALUES (5, 'Vikram Mehta', 590, 42000.00, 'EFGHI5678J', 'PENDING');
INSERT INTO customers VALUES (6, 'Kavita Joshi', 740, 95000.00, 'FGHIJ6789K', 'VERIFIED');
INSERT INTO customers VALUES (7, 'Deepak Chopra', 680, 68000.00, 'GHIJK7890L', 'VERIFIED');
INSERT INTO customers VALUES (8, 'Simran Kaur', 795, 160000.00, 'HIJKL8901M', 'VERIFIED');

INSERT INTO loan_applications VALUES (201, 1, 500000.00, 24, 'HOME_RENOVATION', 'APPROVED', '2023-11-01 10:15:00');
INSERT INTO loan_applications VALUES (202, 2, 300000.00, 12, 'PERSONAL', 'APPROVED', '2023-11-15 14:00:00');
INSERT INTO loan_applications VALUES (203, 3, 200000.00, 24, 'AUTO', 'APPROVED', '2023-12-01 11:30:00');
INSERT INTO loan_applications VALUES (204, 4, 1200000.00, 36, 'BUSINESS', 'APPROVED', '2023-12-10 16:20:00');
INSERT INTO loan_applications VALUES (205, 5, 250000.00, 18, 'PERSONAL', 'REJECTED', '2024-01-05 09:45:00');
INSERT INTO loan_applications VALUES (206, 6, 400000.00, 24, 'PERSONAL', 'APPROVED', '2024-01-15 12:10:00');
INSERT INTO loan_applications VALUES (207, 7, 350000.00, 24, 'AUTO', 'APPROVED', '2024-02-01 15:40:00');
INSERT INTO loan_applications VALUES (208, 8, 800000.00, 36, 'HOME_RENOVATION', 'UNDER_REVIEW', '2024-03-01 10:00:00');

INSERT INTO loans VALUES (301, 201, 1, 500000.00, 11.50, '2023-11-05', '2025-11-05', 'ACTIVE');
INSERT INTO loans VALUES (302, 202, 2, 300000.00, 12.00, '2023-11-20', '2024-11-20', 'ACTIVE');
INSERT INTO loans VALUES (303, 203, 3, 200000.00, 13.50, '2023-12-05', '2025-12-05', 'ACTIVE');
INSERT INTO loans VALUES (304, 204, 4, 1200000.00, 10.50, '2023-12-15', '2026-12-15', 'ACTIVE');
INSERT INTO loans VALUES (305, 206, 6, 400000.00, 11.00, '2024-01-20', '2026-01-20', 'ACTIVE');
INSERT INTO loans VALUES (306, 207, 7, 350000.00, 12.50, '2024-02-05', '2026-02-05', 'ACTIVE');

INSERT INTO emi_schedule VALUES (401, 301, 1, '2023-12-05', 18600.00, 4791.67, 23391.67, 'PAID');
INSERT INTO emi_schedule VALUES (402, 301, 2, '2024-01-05', 18778.00, 4613.67, 23391.67, 'PAID');
INSERT INTO emi_schedule VALUES (403, 301, 3, '2024-02-05', 18958.00, 4433.67, 23391.67, 'PAID');
INSERT INTO emi_schedule VALUES (404, 301, 4, '2024-03-05', 19139.00, 4252.67, 23391.67, 'PENDING');
INSERT INTO emi_schedule VALUES (405, 302, 1, '2023-12-20', 23600.00, 3000.00, 26600.00, 'PAID');
INSERT INTO emi_schedule VALUES (406, 302, 2, '2024-01-20', 23836.00, 2764.00, 26600.00, 'PAID');
INSERT INTO emi_schedule VALUES (407, 302, 3, '2024-02-20', 24074.00, 2526.00, 26600.00, 'PAID');
INSERT INTO emi_schedule VALUES (408, 302, 4, '2024-03-20', 24315.00, 2285.00, 26600.00, 'OVERDUE');
INSERT INTO emi_schedule VALUES (409, 303, 1, '2024-01-05', 7300.00, 2250.00, 9550.00, 'PAID');
INSERT INTO emi_schedule VALUES (410, 303, 2, '2024-02-05', 7382.00, 2168.00, 9550.00, 'OVERDUE');
INSERT INTO emi_schedule VALUES (411, 303, 3, '2024-03-05', 7465.00, 2085.00, 9550.00, 'OVERDUE');
INSERT INTO emi_schedule VALUES (412, 304, 1, '2024-01-15', 30000.00, 9000.00, 39000.00, 'PAID');
INSERT INTO emi_schedule VALUES (413, 304, 2, '2024-02-15', 30262.00, 8738.00, 39000.00, 'PAID');
INSERT INTO emi_schedule VALUES (414, 304, 3, '2024-03-15', 30527.00, 8473.00, 39000.00, 'PAID');
INSERT INTO emi_schedule VALUES (415, 305, 1, '2024-02-20', 14950.00, 3666.67, 18616.67, 'PAID');
INSERT INTO emi_schedule VALUES (416, 305, 2, '2024-03-20', 15087.00, 3529.67, 18616.67, 'PENDING');
INSERT INTO emi_schedule VALUES (417, 306, 1, '2024-03-05', 12900.00, 3645.83, 16545.83, 'PAID');

INSERT INTO repayments VALUES (501, 301, 401, 23391.67, '2023-12-04 10:30:00', 'AUTO_DEBIT', 'TXN-90812');
INSERT INTO repayments VALUES (502, 301, 402, 23391.67, '2024-01-04 11:15:00', 'AUTO_DEBIT', 'TXN-91244');
INSERT INTO repayments VALUES (503, 301, 403, 23391.67, '2024-02-04 09:20:00', 'AUTO_DEBIT', 'TXN-91890');
INSERT INTO repayments VALUES (504, 302, 405, 26600.00, '2023-12-19 14:10:00', 'NEFT', 'TXN-87421');
INSERT INTO repayments VALUES (505, 302, 406, 26600.00, '2024-01-19 16:05:00', 'UPI', 'TXN-88102');
INSERT INTO repayments VALUES (506, 302, 407, 26600.00, '2024-02-20 18:30:00', 'UPI', 'TXN-89311');
INSERT INTO repayments VALUES (507, 303, 409, 9550.00, '2024-01-05 15:45:00', 'AUTO_DEBIT', 'TXN-76120');
INSERT INTO repayments VALUES (508, 304, 412, 39000.00, '2024-01-15 12:00:00', 'ACH', 'TXN-65001');
INSERT INTO repayments VALUES (509, 304, 413, 39000.00, '2024-02-15 13:30:00', 'ACH', 'TXN-65421');
INSERT INTO repayments VALUES (510, 304, 414, 39000.00, '2024-03-15 10:15:00', 'ACH', 'TXN-65990');
INSERT INTO repayments VALUES (511, 305, 415, 18616.67, '2024-02-20 17:00:00', 'AUTO_DEBIT', 'TXN-54129');
INSERT INTO repayments VALUES (512, 306, 417, 16545.83, '2024-03-05 11:45:00', 'AUTO_DEBIT', 'TXN-43102');

INSERT INTO transactions VALUES (601, 301, 'DISBURSEMENT', 500000.00, 500000.00, '2023-11-05 10:00:00');
INSERT INTO transactions VALUES (602, 301, 'EMI_REPAYMENT', 18600.00, 481400.00, '2023-12-04 10:30:00');
INSERT INTO transactions VALUES (603, 301, 'EMI_REPAYMENT', 18778.00, 462622.00, '2024-01-04 11:15:00');
INSERT INTO transactions VALUES (604, 301, 'EMI_REPAYMENT', 18958.00, 443664.00, '2024-02-04 09:20:00');
INSERT INTO transactions VALUES (605, 302, 'DISBURSEMENT', 300000.00, 300000.00, '2023-11-20 14:00:00');
INSERT INTO transactions VALUES (606, 302, 'EMI_REPAYMENT', 23600.00, 276400.00, '2023-12-19 14:10:00');
INSERT INTO transactions VALUES (607, 303, 'DISBURSEMENT', 200000.00, 200000.00, '2023-12-05 11:00:00');
INSERT INTO transactions VALUES (608, 303, 'PENALTY_FEE', 500.00, 200500.00, '2024-02-10 00:00:00');
  `.trim(),
};

