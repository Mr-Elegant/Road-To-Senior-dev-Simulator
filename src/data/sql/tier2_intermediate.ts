import { SqlQuestion } from '@/types/sqlTrack';

export const tier2IntermediateQuestions: SqlQuestion[] = [
  // 1. Subqueries & CTEs
  {
    id: 'sql-t2-01',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 1,
    title: 'Filtering Above-Average Values with Scalar Subqueries',
    category: 'Subqueries and CTEs',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Merchandising analysts want to identify high-value products priced above the overall average catalog price.',
    questionStatement:
      'Write a query on `products` to find all products whose `price` is strictly greater than the average price of all active products (`is_active = true`). Return `id`, `name`, `category`, and `price`, ordered by `price` descending.',
    starterCode: '-- Products priced above active average\nSELECT\n  id,\n  name,\n  category,\n  price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products WHERE is_active = true)\nORDER BY price DESC;',
    sqlSolution: 'SELECT id, name, category, price FROM products WHERE price > (SELECT AVG(price) FROM products WHERE is_active = true) ORDER BY price DESC;',
    referenceAnswer:
      'The scalar subquery `(SELECT AVG(price) FROM products WHERE is_active = true)` returns a single float value (~$170.82). The outer query evaluates each product against this threshold in the WHERE clause.',
    expectedConcepts: ['Scalar subquery', 'Nested aggregation', 'Dynamic threshold filtering'],
    hints: [
      'Write a subquery in parentheses that computes AVG(price) for active products.',
      'Compare price > (subquery) in the outer WHERE clause.',
    ],
    followUp: {
      question: 'How does a scalar subquery differ from a correlated subquery in terms of execution?',
      expectedAnswer:
        'A scalar subquery is independent and executed once by the database engine, with its single value cached and reused. A correlated subquery references values from the outer query row-by-row and must be re-evaluated for each candidate row (unless converted by the planner to a join).',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Valid scalar subquery syntax', 'Filters active items in average', 'Sorts by price descending'],
    },
    testCases: [
      {
        id: 'tc-t2-01',
        description: 'Verify products priced above average active price ($170.82)',
        expectedRows: [
          { id: 3, name: 'Ultra-Wide 4K Gaming Monitor', category: 'Electronics', price: 549.0 },
          { id: 6, name: 'Smart Induction Espresso Machine', category: 'Home & Kitchen', price: 249.99 },
          { id: 1, name: 'Noise-Cancelling Headphones', category: 'Electronics', price: 199.99 },
        ],
      },
    ],
  },
  {
    id: 'sql-t2-02',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 2,
    title: 'Correlated Subquery with EXISTS',
    category: 'Subqueries and CTEs',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'The support operations team wants a list of customers who have at least one refunded order.',
    questionStatement:
      'Write a query using `EXISTS` to find all customers from `customers` who have at least one order with a corresponding record in the `refunds` table. Return `customers.id`, `customers.name`, and `customers.city`, sorted by `id` ascending.',
    starterCode: '-- Customers with at least one refund using EXISTS\nSELECT\n  c.id,\n  c.name,\n  c.city\nFROM customers c\nWHERE EXISTS (\n  SELECT 1\n  FROM orders o\n  JOIN refunds r ON o.id = r.order_id\n  WHERE o.customer_id = c.id\n)\nORDER BY c.id ASC;',
    sqlSolution: 'SELECT c.id, c.name, c.city FROM customers c WHERE EXISTS (SELECT 1 FROM orders o JOIN refunds r ON o.id = r.order_id WHERE o.customer_id = c.id) ORDER BY c.id ASC;',
    referenceAnswer:
      '`WHERE EXISTS (...)` tests whether the correlated subquery returns at least one row. The moment a matching refund is found for `o.customer_id = c.id`, the database short-circuits and emits the customer row, avoiding duplicates that a simple JOIN might introduce.',
    expectedConcepts: ['EXISTS operator', 'Correlated subquery', 'Semi-join semantics', 'Short-circuit evaluation'],
    hints: [
      'Correlate the subquery to the outer table using WHERE o.customer_id = c.id.',
      'EXISTS only checks for the existence of rows, so SELECT 1 is standard convention.',
    ],
    followUp: {
      question: 'Why is SELECT 1 inside an EXISTS subquery standard practice instead of SELECT * or column names?',
      expectedAnswer:
        'EXISTS only cares if any row matches; it completely ignores the SELECT list columns. Writing SELECT 1 signals to engineers and the parser that no column values are being fetched, making the intent clear.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper EXISTS predicate', 'Correlated customer_id', 'Deduplicated customer output'],
    },
    testCases: [
      {
        id: 'tc-t2-02',
        description: 'Verify customers with recorded refunds (Customer 1 had order 110 refunded)',
        expectedRows: [
          { id: 1, name: 'Aarav Patel', city: 'Bengaluru' },
        ],
      },
    ],
  },
  {
    id: 'sql-t2-03',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 3,
    title: 'Common Table Expressions (CTEs) for Multi-Step Aggregations',
    category: 'Subqueries and CTEs',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Executive leadership requires a customer spending tiers report: aggregate total spend per customer first, then filter for customers whose lifetime spend exceeds $300.',
    questionStatement:
      'Write a query using a `WITH` clause (CTE) named `customer_spending` that aggregates `customer_id` and `total_spent` (sum of `total_amount` for orders with status `\'DELIVERED\'`). In the main query, join with `customers` to return `customers.name`, `customer_spending.total_spent`, ordered by `total_spent` descending.',
    starterCode: '-- Multi-step aggregation using CTE\nWITH customer_spending AS (\n  SELECT\n    customer_id,\n    SUM(total_amount) AS total_spent\n  FROM orders\n  WHERE status = \'DELIVERED\'\n  GROUP BY customer_id\n)\nSELECT\n  c.name,\n  cs.total_spent\nFROM customer_spending cs\nJOIN customers c ON cs.customer_id = c.id\nWHERE cs.total_spent > 300\nORDER BY cs.total_spent DESC;',
    sqlSolution: 'WITH customer_spending AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders WHERE status = \'DELIVERED\' GROUP BY customer_id) SELECT c.name, cs.total_spent FROM customer_spending cs JOIN customers c ON cs.customer_id = c.id WHERE cs.total_spent > 300 ORDER BY cs.total_spent DESC;',
    referenceAnswer:
      'The CTE `customer_spending` creates a named temporary result set holding total delivered spend per customer. The outer query cleanly joins this with `customers` and filters for spend over $300, avoiding nested subquery clutter.',
    expectedConcepts: ['WITH clause (CTE)', 'Readability in multi-stage transformations', 'Aggregation before joining'],
    hints: [
      'Define the CTE with WITH customer_spending AS (...)',
      'Select from the CTE and join with customers on customer_id.',
    ],
    followUp: {
      question: 'In PostgreSQL 12+, how does the planner handle CTE optimization with the MATERIALIZED vs NOT MATERIALIZED keywords?',
      expectedAnswer:
        'Prior to PG12, all CTEs were optimization barriers (always materialized to memory/disk). PostgreSQL 12+ defaults to inlining (NOT MATERIALIZED) single-reference CTEs like subqueries, allowing index pushes. Specifying WITH ... AS MATERIALIZED forces an independent execution barrier.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper WITH clause', 'Filters DELIVERED orders only', 'Correct spend threshold filter (> 300)'],
    },
    testCases: [
      {
        id: 'tc-t2-03',
        description: 'Verify high-spend customers via CTE',
        expectedRows: [
          { name: 'Sophia Miller', total_spent: 549.0 },
          { name: 'Aarav Patel', total_spent: 418.49 },
          { name: 'Carlos Rodriguez', total_spent: 346.99 },
        ],
      },
    ],
  },
  // 2. Window Functions
  {
    id: 'sql-t2-04',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 4,
    title: 'Ranking Products Within Categories Using DENSE_RANK()',
    category: 'Window Functions',
    questionType: 'executable',
    executionDialect: 'postgresql',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Merchandising wants to display product rank within each category from most expensive to least expensive.',
    questionStatement:
      'Write a query to rank products within each `category` based on `price` descending. Return `category`, `name`, `price`, and `category_price_rank` using `DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC)`. Order final results by `category` ascending, then `category_price_rank` ascending.',
    starterCode: '-- Rank products per category with DENSE_RANK\nSELECT\n  category,\n  name,\n  price,\n  DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS category_price_rank\nFROM products\nORDER BY category ASC, category_price_rank ASC;',
    sqlSolution: 'SELECT category, name, price, DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS category_price_rank FROM products ORDER BY category ASC, category_price_rank ASC;',
    referenceAnswer:
      '`DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC)` groups calculations by category and assigns ranks without skipping numbers when prices tie.',
    expectedConcepts: [
      'Window function OVER() clause',
      'PARTITION BY window grouping',
      'DENSE_RANK vs RANK vs ROW_NUMBER',
    ],
    hints: [
      'Use DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC).',
      'Order the final query by category ASC, category_price_rank ASC.',
    ],
    followUp: {
      question: 'What is the exact behavioral difference between ROW_NUMBER(), RANK(), and DENSE_RANK() on tied values (e.g., $100, $100, $80)?',
      expectedAnswer:
        'For tied values $100, $100, $80: ROW_NUMBER assigns distinct arbitrary ranks (1, 2, 3); RANK assigns tied ranks and skips subsequent values (1, 1, 3); DENSE_RANK assigns tied ranks without gaps (1, 1, 2).',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper window specification', 'Partitions by category', 'Correct sort order'],
    },
    testCases: [
      {
        id: 'tc-t2-04',
        description: 'Verify category-based pricing ranks',
        expectedRows: [
          { category: 'Apparel', name: 'Waterproof Trail Running Shoes', price: 135.0, category_price_rank: 1 },
          { category: 'Apparel', name: 'Merino Wool Pullover', price: 89.0, category_price_rank: 2 },
          { category: 'Books', name: 'Database Internals in Practice', price: 52.0, category_price_rank: 1 },
          { category: 'Books', name: 'Designing Data-Intensive Applications', price: 45.0, category_price_rank: 2 },
          { category: 'Electronics', name: 'Ultra-Wide 4K Gaming Monitor', price: 549.0, category_price_rank: 1 },
          { category: 'Electronics', name: 'Noise-Cancelling Headphones', price: 199.99, category_price_rank: 2 },
          { category: 'Electronics', name: 'Mechanical Wireless Keyboard', price: 129.5, category_price_rank: 3 },
          { category: 'Electronics', name: 'Discontinued USB Hub', price: 25.0, category_price_rank: 4 },
          { category: 'Home & Kitchen', name: 'Smart Induction Espresso Machine', price: 249.99, category_price_rank: 1 },
          { category: 'Home & Kitchen', name: 'Ergonomic Standing Desk Mat', price: 49.95, category_price_rank: 2 },
        ],
      },
    ],
  },
  {
    id: 'sql-t2-05',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 5,
    title: 'Calculating Running Totals with Cumulative Window Aggregation',
    category: 'Window Functions',
    questionType: 'executable',
    executionDialect: 'postgresql',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Finance needs to track cumulative daily revenue progression for delivered orders throughout February and March 2024.',
    questionStatement:
      'Write a query on `orders` for status `\'DELIVERED\'` returning `id`, `order_date`, `total_amount`, and `running_total` (the cumulative sum of `total_amount` ordered by `order_date` ascending).',
    starterCode: '-- Calculate cumulative running revenue\nSELECT\n  id,\n  order_date,\n  total_amount,\n  SUM(total_amount) OVER (ORDER BY order_date ASC) AS running_total\nFROM orders\nWHERE status = \'DELIVERED\'\nORDER BY order_date ASC;',
    sqlSolution: 'SELECT id, order_date, total_amount, SUM(total_amount) OVER (ORDER BY order_date ASC) AS running_total FROM orders WHERE status = \'DELIVERED\' ORDER BY order_date ASC;',
    referenceAnswer:
      '`SUM(total_amount) OVER (ORDER BY order_date ASC)` computes an unbounded cumulative sum from the first row up to the current row, defaulting to the frame `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.',
    expectedConcepts: [
      'Cumulative window sum',
      'Implicit frame default (RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
      'Chronological financial running totals',
    ],
    hints: [
      'Use SUM(total_amount) OVER (ORDER BY order_date ASC).',
      'Filter WHERE status = \'DELIVERED\'.',
    ],
    followUp: {
      question: 'What happens if two orders have the exact same order_date in SUM(...) OVER (ORDER BY order_date)?',
      expectedAnswer:
        'Because the default frame is RANGE (not ROWS), all peer rows sharing the identical timestamp are evaluated together. Both rows will display the same running total including both orders. To force step-by-step accumulation, specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper cumulative SUM() OVER', 'Filters delivered orders', 'Ascending chronological order'],
    },
    testCases: [
      {
        id: 'tc-t2-05',
        description: 'Verify cumulative delivered revenue running total',
        expectedRows: [
          { id: 101, order_date: '2024-02-10 14:00:00', total_amount: 329.49, running_total: 329.49 },
          { id: 102, order_date: '2024-02-12 18:20:00', total_amount: 549.0, running_total: 878.49 },
          { id: 103, order_date: '2024-02-18 09:40:00', total_amount: 89.0, running_total: 967.49 },
          { id: 104, order_date: '2024-02-22 16:15:00', total_amount: 249.99, running_total: 1217.48 },
          { id: 106, order_date: '2024-03-01 13:05:00', total_amount: 264.5, running_total: 1481.98 },
          { id: 111, order_date: '2024-03-18 19:30:00', total_amount: 299.94, running_total: 1781.92 },
          { id: 112, order_date: '2024-03-20 12:45:00', total_amount: 97.0, running_total: 1878.92 },
        ],
      },
    ],
  },
  {
    id: 'sql-t2-06',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 6,
    title: 'Prior Period Comparison with LAG()',
    category: 'Window Functions',
    questionType: 'executable',
    executionDialect: 'postgresql',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'Finance needs to calculate invoice-over-invoice growth and detect any billing discrepancies for organization 101.',
    questionStatement:
      'Write a query on `invoices` for `organization_id = 101` returning `id`, `billing_date`, `amount`, and `prev_amount` (the amount of the immediately prior invoice using `LAG()`). Order results by `billing_date` ascending.',
    starterCode: '-- Calculate prior invoice amount with LAG\nSELECT\n  id,\n  billing_date,\n  amount,\n  LAG(amount, 1) OVER (ORDER BY billing_date ASC) AS prev_amount\nFROM invoices\nWHERE organization_id = 101\nORDER BY billing_date ASC;',
    sqlSolution: 'SELECT id, billing_date, amount, LAG(amount, 1) OVER (ORDER BY billing_date ASC) AS prev_amount FROM invoices WHERE organization_id = 101 ORDER BY billing_date ASC;',
    referenceAnswer:
      '`LAG(amount, 1) OVER (ORDER BY billing_date ASC)` fetches the value of `amount` from 1 row prior in the sorted window. For the first row, it cleanly evaluates to `NULL`.',
    expectedConcepts: ['LAG() window function', 'Offset navigation', 'First-row NULL handling'],
    hints: ['LAG(column, offset) looks backward in the sorted window.'],
    followUp: {
      question: 'How do you provide a default fallback value if LAG() encounters the first row (instead of NULL)?',
      expectedAnswer:
        'LAG accepts an optional third argument: LAG(amount, 1, 0.00). If the preceding row does not exist, it returns 0.00 instead of NULL.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper LAG usage', 'Correctly filters organization 101', 'First invoice has NULL prev_amount'],
    },
    testCases: [
      {
        id: 'tc-t2-06',
        description: 'Verify prior invoice amounts for organization 101',
        expectedRows: [
          { id: 1, billing_date: '2024-01-01', amount: 999.0, prev_amount: null },
          { id: 2, billing_date: '2024-02-01', amount: 999.0, prev_amount: 999.0 },
          { id: 3, billing_date: '2024-03-01', amount: 999.0, prev_amount: 999.0 },
        ],
      },
    ],
  },
  {
    id: 'sql-t2-07',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 7,
    title: 'Top N Records Per Group Pattern',
    category: 'Window Functions',
    questionType: 'executable',
    executionDialect: 'postgresql',
    datasetId: 'ecommerce',
    realWorldScenario:
      'The homepage needs to show the top 1 highest-priced product for every category.',
    questionStatement:
      'Write a query using a CTE and `ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC)` to retrieve only the #1 most expensive product in each category. Return `category`, `name`, and `price`, ordered by `category` ascending.',
    starterCode: '-- Top 1 most expensive product per category\nWITH ranked_products AS (\n  SELECT\n    category,\n    name,\n    price,\n    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn\n  FROM products\n)\nSELECT\n  category,\n  name,\n  price\nFROM ranked_products\nWHERE rn = 1\nORDER BY category ASC;',
    sqlSolution: 'WITH ranked_products AS (SELECT category, name, price, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn FROM products) SELECT category, name, price FROM ranked_products WHERE rn = 1 ORDER BY category ASC;',
    referenceAnswer:
      'Window functions cannot be placed directly in a WHERE clause because they evaluate after WHERE filtering. Wrapping in a CTE allows the outer query to filter `WHERE rn = 1`, solving the classic Top-N-per-group challenge.',
    expectedConcepts: [
      'Top-N per group pattern',
      'ROW_NUMBER() window partitioning',
      'CTE wrapping to filter window output',
    ],
    hints: [
      'You cannot put WHERE ROW_NUMBER() = 1 in the same query.',
      'Wrap the query in a CTE or subquery, then filter WHERE rn = 1.',
    ],
    followUp: {
      question: 'In PostgreSQL 13+, how does the planner optimize queries with QUALIFY in other dialects vs CTEs in PostgreSQL?',
      expectedAnswer:
        'Dialects like Snowflake and Teradata support a QUALIFY clause to filter window results without a subquery. PostgreSQL does not yet have a QUALIFY keyword, making the CTE / subquery approach standard.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper CTE and ROW_NUMBER', 'Filters exactly rn = 1', 'Returns exactly one product per category'],
    },
    testCases: [
      {
        id: 'tc-t2-07',
        description: 'Verify single top-priced product per category',
        expectedRows: [
          { category: 'Apparel', name: 'Waterproof Trail Running Shoes', price: 135.0 },
          { category: 'Books', name: 'Database Internals in Practice', price: 52.0 },
          { category: 'Electronics', name: 'Ultra-Wide 4K Gaming Monitor', price: 549.0 },
          { category: 'Home & Kitchen', name: 'Smart Induction Espresso Machine', price: 249.99 },
        ],
      },
    ],
  },
  // 3. Joins & Set Operations
  {
    id: 'sql-t2-08',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 8,
    title: 'FULL OUTER JOIN for Data Reconciliation',
    category: 'Joins and Relationships',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Finance and inventory auditing teams need to reconcile orders and payments to identify orders without payments and orphan payments without orders.',
    questionStatement:
      'Write a query using a `FULL OUTER JOIN` between `orders` and `payments` on `orders.id = payments.order_id`. Return `orders.id` as `order_id`, `payments.id` as `payment_id`, `orders.total_amount`, and `payments.amount` as `payment_amount`, ordered by `order_id` ascending, `payment_id` ascending.',
    starterCode: '-- Reconcile orders and payments with FULL OUTER JOIN\nSELECT\n  o.id AS order_id,\n  p.id AS payment_id,\n  o.total_amount,\n  p.amount AS payment_amount\nFROM orders o\nFULL OUTER JOIN payments p ON o.id = p.order_id\nORDER BY o.id ASC, p.id ASC;',
    sqlSolution: 'SELECT o.id AS order_id, p.id AS payment_id, o.total_amount, p.amount AS payment_amount FROM orders o FULL OUTER JOIN payments p ON o.id = p.order_id ORDER BY o.id ASC, p.id ASC;',
    referenceAnswer:
      '`FULL OUTER JOIN` produces the complete union of matched rows, unmatched left rows (orders without payments), and unmatched right rows (payments without orders), filling missing values with NULLs.',
    expectedConcepts: ['FULL OUTER JOIN', 'Reconciliation audit pattern', 'Bilateral outer join semantics'],
    hints: ['FULL OUTER JOIN keeps rows from both tables even when there is no match.'],
    followUp: {
      question: 'Under what conditions will an order appear with payment_id = NULL in this query?',
      expectedAnswer:
        'When an order has been created but no payment row has been recorded in the payments table (e.g., an in-flight cart or cash-on-delivery pending settlement).',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper FULL OUTER JOIN', 'Aliases order_id and payment_id', 'Preserves unmatched rows'],
    },
    testCases: [
      {
        id: 'tc-t2-08',
        description: 'Verify bilateral reconciliation of orders and payment attempts',
        expectedRows: [
          { order_id: 101, payment_id: 1, total_amount: 329.49, payment_amount: 329.49 },
          { order_id: 102, payment_id: 2, total_amount: 549.0, payment_amount: 549.0 },
          { order_id: 103, payment_id: 3, total_amount: 89.0, payment_amount: 89.0 },
          { order_id: 104, payment_id: 4, total_amount: 249.99, payment_amount: 249.99 },
          { order_id: 105, payment_id: 5, total_amount: 97.0, payment_amount: 97.0 },
          { order_id: 106, payment_id: 6, total_amount: 264.5, payment_amount: 264.5 },
          { order_id: 107, payment_id: 7, total_amount: 199.99, payment_amount: 199.99 },
          { order_id: 108, payment_id: 8, total_amount: 798.99, payment_amount: 798.99 },
          { order_id: 109, payment_id: 9, total_amount: 135.0, payment_amount: 135.0 },
          { order_id: 110, payment_id: 10, total_amount: 129.5, payment_amount: 129.5 },
          { order_id: 111, payment_id: 11, total_amount: 299.94, payment_amount: 299.94 },
          { order_id: 112, payment_id: 12, total_amount: 97.0, payment_amount: 97.0 },
        ],
      },
    ],
  },
  {
    id: 'sql-t2-09',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 9,
    title: 'Combining Result Sets with UNION and UNION ALL',
    category: 'SQL Fundamentals',
    questionType: 'executable',
    datasetId: 'loan_management',
    realWorldScenario:
      'The audit team needs a consolidated feed of credit activity: both loan disbursements and EMI repayments in a single chronological stream.',
    questionStatement:
      'Write a query combining `type`, `amount`, and `created_at` from `transactions` where `type = \'DISBURSEMENT\'` with transactions where `type = \'EMI_REPAYMENT\'` using `UNION ALL`. Order the combined results by `created_at` ascending.',
    starterCode: '-- Consolidated stream with UNION ALL\nSELECT type, amount, created_at\nFROM transactions\nWHERE type = \'DISBURSEMENT\'\nUNION ALL\nSELECT type, amount, created_at\nFROM transactions\nWHERE type = \'EMI_REPAYMENT\'\nORDER BY created_at ASC;',
    sqlSolution: 'SELECT type, amount, created_at FROM transactions WHERE type = \'DISBURSEMENT\' UNION ALL SELECT type, amount, created_at FROM transactions WHERE type = \'EMI_REPAYMENT\' ORDER BY created_at ASC;',
    referenceAnswer:
      '`UNION ALL` concatenates the two result sets directly without incurring the performance cost of deduplication. `ORDER BY` placed at the very end sorts the unified stream.',
    expectedConcepts: [
      'UNION ALL operator',
      'Performance difference: UNION vs UNION ALL',
      'Result set schema compatibility',
    ],
    hints: [
      'Both SELECT statements must have identical numbers of columns and compatible types.',
      'Place the ORDER BY clause after the second SELECT statement.',
    ],
    followUp: {
      question: 'Why should UNION ALL be preferred over UNION unless deduplication is explicitly required?',
      expectedAnswer:
        'UNION forces the database to sort the combined dataset and perform a deduplication pass (similar to DISTINCT). UNION ALL performs zero sorting, appending buffers directly, which is significantly faster and lower on memory.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper UNION ALL syntax', 'Matching column types', 'Chronological sorting'],
    },
    testCases: [
      {
        id: 'tc-t2-09',
        description: 'Verify unified transaction activity stream',
        expectedRows: [
          { type: 'DISBURSEMENT', amount: 500000.0, created_at: '2023-11-05 10:00:00' },
          { type: 'DISBURSEMENT', amount: 300000.0, created_at: '2023-11-20 14:00:00' },
          { type: 'EMI_REPAYMENT', amount: 18600.0, created_at: '2023-12-04 10:30:00' },
          { type: 'DISBURSEMENT', amount: 200000.0, created_at: '2023-12-05 11:00:00' },
          { type: 'EMI_REPAYMENT', amount: 23600.0, created_at: '2023-12-19 14:10:00' },
          { type: 'EMI_REPAYMENT', amount: 18778.0, created_at: '2024-01-04 11:15:00' },
          { type: 'EMI_REPAYMENT', amount: 18958.0, created_at: '2024-02-04 09:20:00' },
        ],
      },
    ],
  },
  {
    id: 'sql-t2-10',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 10,
    title: 'Self-Joins for Hierarchical and Comparative Analysis',
    category: 'Joins and Relationships',
    questionType: 'conceptual',
    realWorldScenario:
      'An organizational chart table `employees (id, name, manager_id)` stores both workers and their direct managers in the same table.',
    questionStatement:
      'What is a Self-Join? Write a query showing how to retrieve each employee\'s name along with their manager\'s name. Why must a LEFT JOIN be used if top executives have no manager?',
    referenceAnswer:
      '```sql\nSELECT\n  e.name AS employee_name,\n  m.name AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n```\nA Self-Join joins a table to itself using two distinct table aliases (`e` for employee, `m` for manager). A `LEFT JOIN` is essential because the CEO or top executives have `manager_id IS NULL`. An `INNER JOIN` would drop the CEO from the report.',
    expectedConcepts: [
      'Self-join with table aliases',
      'Hierarchical adjacency list pattern',
      'LEFT JOIN necessity for root nodes (NULL manager_id)',
    ],
    hints: ['Alias the table twice: once as employee, once as manager.'],
    followUp: {
      question: 'How do you query arbitrary-depth organizational hierarchies (e.g. employee -> manager -> VP -> CEO) in PostgreSQL?',
      expectedAnswer:
        'Using a Recursive Common Table Expression (WITH RECURSIVE org_tree AS ...), which defines an anchor member for root nodes and a recursive member joining the CTE back to the employees table until termination.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines self-join', 'Provides correct SQL syntax', 'Explains why LEFT JOIN preserves root executives'],
    },
  },
  // Conceptual & Intermediate Architecture (11 - 30)
  {
    id: 'sql-t2-11',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 11,
    title: 'Surrogate Keys vs. Natural Keys',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'A team is debating whether to use Social Security Number (SSN) / PAN as the primary key for customer records, or an auto-incrementing integer / UUID.',
    questionStatement:
      'Compare Natural Keys with Surrogate Keys. What are the operational and security risks of using real-world identifiers as primary keys?',
    referenceAnswer:
      'A Natural Key is a real-world attribute that is already unique (e.g. SSN, email, PAN). A Surrogate Key is a database-generated synthetic identifier with no business meaning (e.g. BIGSERIAL, UUIDv4). Risks of Natural Keys: 1. Business rules change (e.g. government re-issues numbers or allows updates; updating a PK cascade-updates millions of foreign keys). 2. Security and compliance (SSNs leaked in URLs, foreign key logs, or API responses). 3. Performance (wide string natural keys bloat secondary B-Tree indexes). Best practice: Use a surrogate key as PK, and place a UNIQUE constraint on the natural key.',
    expectedConcepts: [
      'Natural key vs Surrogate key definition',
      'Cascading update vulnerability of natural keys',
      'PII exposure risks in foreign key relationships',
      'Index storage bloat of string keys',
    ],
    hints: ['What happens if a user legally changes their email address or government ID?'],
    followUp: {
      question: 'When is a Natural Key appropriate in database modeling?',
      expectedAnswer:
        'Natural keys are appropriate for immutable reference tables with universally standardized codes that never change, such as ISO 3166 country codes (e.g. \'US\', \'GB\', \'IN\') or ISO 4217 currency codes (\'USD\', \'EUR\').',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Compares both key types', 'Explains cascading update risk', 'Identifies PII security risk'],
    },
  },
  {
    id: 'sql-t2-12',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 12,
    title: 'UUIDv4 vs. BIGINT / ULID for Primary Keys',
    category: 'PostgreSQL Data Types',
    questionType: 'conceptual',
    realWorldScenario:
      'A microservices application generates customer IDs on the client side before writing to PostgreSQL, but database writes slow down significantly after reaching 50 million rows.',
    questionStatement:
      'Why does random UUIDv4 cause severe B-Tree index fragmentation and write degradation at scale? How do sequential identifiers (BIGINT, UUIDv7, ULID) solve this?',
    referenceAnswer:
      'UUIDv4 generates purely random 128-bit numbers. Because values are random, new inserts do not append to the end of the B-Tree; they land randomly across all leaf pages. Once the index exceeds RAM (`shared_buffers`), almost every insert requires loading a different page from disk, causing random disk I/O, cache thrashing, and page splits (leaf fragmentation). Sequential identifiers (BIGINT IDENTITY, UUIDv7, or ULID) are time-ordered: new inserts append monotonically to the rightmost leaf pages, keeping write operations localized to hot memory buffers.',
    expectedConcepts: [
      'UUIDv4 random distribution',
      'B-Tree page splits and cache thrashing',
      'Monotonic time-ordered keys (UUIDv7/ULID/BIGINT)',
      'Index memory footprint',
    ],
    hints: ['Think about what happens to a sorted B-Tree when inserts arrive in totally random order.'],
    followUp: {
      question: 'What is the risk of using auto-incrementing BIGINT identifiers in public-facing web URLs?',
      expectedAnswer:
        'Enumeration attacks (Insecure Direct Object References - IDOR). Attackers can iterate through ids (/api/orders/1, /api/orders/2) to harvest data or estimate company order volume.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains B-Tree random insertion penalty', 'Mentions page splits and memory thrashing', 'Explains time-ordered keys'],
    },
  },
  {
    id: 'sql-t2-13',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 13,
    title: 'Foreign Key Cascade Behaviors: CASCADE, SET NULL, and RESTRICT',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'An e-commerce system is designing rules for what happens when a customer account is deleted: what should happen to their past orders and invoices?',
    questionStatement:
      'Compare `ON DELETE CASCADE`, `ON DELETE SET NULL`, and `ON DELETE RESTRICT` (NO ACTION). What are the business and legal implications of each in e-commerce and financial ledgers?',
    referenceAnswer:
      '1. `ON DELETE CASCADE`: Deleting the parent automatically deletes all child rows. In financial systems, using CASCADE on orders when a customer is deleted is illegal (destroys audit logs, tax invoices, and accounting balance). 2. `ON DELETE SET NULL`: Sets the foreign key column in child rows to NULL while preserving the rows. Useful if order history must be retained without customer identity. 3. `ON DELETE RESTRICT` / `NO ACTION`: Aborts the delete operation with a foreign key violation error if child rows exist. In financial ledgers, RESTRICT is best practice: parent customer records must be soft-deleted (`is_archived = true`), never physically deleted.',
    expectedConcepts: [
      'ON DELETE CASCADE consequences',
      'ON DELETE SET NULL preservation',
      'ON DELETE RESTRICT audit protection',
      'Soft-delete patterns for compliance',
    ],
    hints: ['Can you legally delete past invoices if a user deletes their account?'],
    followUp: {
      question: 'What is the difference between RESTRICT and NO ACTION in PostgreSQL?',
      expectedAnswer:
        'RESTRICT enforces the constraint immediately. NO ACTION permits deferred constraints (DEFERRABLE INITIALLY DEFERRED), checking the constraint only at the very end of the transaction, allowing intermediate statements to resolve the relationship.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Accurately describes all 3 behaviors', 'Applies to financial audit compliance', 'Recommends RESTRICT / soft-delete'],
    },
  },
  {
    id: 'sql-t2-14',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 14,
    title: 'The Transactional Outbox Pattern in Relational Databases',
    category: 'Transactions and ACID',
    questionType: 'conceptual',
    realWorldScenario:
      'An order checkout service must save an order in PostgreSQL and publish an event to Apache Kafka. If Kafka is temporarily down, the database write succeeds but the message is lost.',
    questionStatement:
      'What is the Dual-Write Problem? How does the Transactional Outbox Pattern use relational database ACID transactions to guarantee reliable event delivery?',
    referenceAnswer:
      'The Dual-Write Problem occurs when an application writes to two independent systems (e.g. PostgreSQL and Kafka) without distributed transactions; one can fail while the other succeeds, causing desynchronization. Solution: The Transactional Outbox Pattern.\n1. Add an `outbox` table in PostgreSQL.\n2. In a single local ACID transaction, insert the order into `orders` AND insert the event payload into `outbox`.\n3. An asynchronous message relay (or Change-Data-Capture / Debezium) polls the `outbox` table and publishes events to Kafka with at-least-once delivery guarantees.\n4. Once acknowledged by Kafka, the outbox record is marked published or deleted.',
    expectedConcepts: [
      'Dual-Write problem and distributed failure',
      'Outbox table in same local transaction',
      'Atomicity guarantees message persistence',
      'CDC (Change Data Capture) or Polling relay',
    ],
    hints: ['How can you use PostgreSQL\'s own transaction to record both the data and the message intent?'],
    followUp: {
      question: 'What is the trade-off of polling the outbox table vs using PostgreSQL logical decoding (Debezium)?',
      expectedAnswer:
        'Polling executes frequent SELECT/UPDATE queries that add database load and table bloat. Logical decoding reads changes directly from the PostgreSQL Write-Ahead Log (WAL) with zero query overhead and millisecond latency.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines Dual-Write problem', 'Explains outbox table role in local transaction', 'Explains relay mechanism'],
    },
  },
  {
    id: 'sql-t2-15',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 15,
    title: 'Database Normalization vs. Denormalization Trade-offs',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'An e-commerce order checkout endpoint calculates total order price by joining orders, order_items, discounts, and tax tables on every single page load.',
    questionStatement:
      'Explain when denormalization (such as storing `total_amount` directly on the `orders` header) is justified. What risks does denormalization introduce, and how are they mitigated?',
    referenceAnswer:
      'Denormalization intentionally adds redundant data to eliminate expensive joins and aggregations on hot read paths. Storing `total_amount` on `orders` is justified because historical invoice totals are immutable (they must capture price at the exact moment of purchase, even if product prices change later). Risks: Update anomalies and data divergence if redundant values fall out of sync. Mitigations: 1. Use database triggers or strict application service layers to synchronize redundant fields. 2. Treat denormalized historical financial fields as append-only snapshots.',
    expectedConcepts: [
      'Read performance vs write complexity trade-off',
      'Historical price immutability argument',
      'Risk of data divergence / update anomaly',
      'Trigger-based or service-layer synchronization',
    ],
    hints: ['If a product price changes tomorrow, should yesterday\'s order total change?'],
    followUp: {
      question: 'What is a Generated Column in PostgreSQL and how does it support safe denormalization?',
      expectedAnswer:
        'PostgreSQL supports GENERATED ALWAYS AS (expression) STORED. The database engine automatically computes and stores the derived column on insert/update, guaranteeing that the denormalized value is mathematically impossible to fall out of sync.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Identifies read vs write trade-off', 'Explains historical point-in-time snapshot necessity', 'Identifies divergence risks'],
    },
  },
  {
    id: 'sql-t2-16',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 16,
    title: 'Partial Indexes in PostgreSQL',
    category: 'Indexes and Query Planning',
    questionType: 'conceptual',
    realWorldScenario:
      'A job queue table has 10 million completed jobs and 500 pending jobs. Workers frequently run: `SELECT * FROM jobs WHERE status = \'PENDING\' ORDER BY priority DESC;`',
    questionStatement:
      'What is a Partial Index in PostgreSQL? Write the DDL to index only pending jobs. Why is this superior to a full table index?',
    referenceAnswer:
      '```sql\nCREATE INDEX idx_jobs_pending ON jobs (priority DESC) WHERE status = \'PENDING\';\n```\nA Partial Index includes an index filter predicate (`WHERE condition`). Only rows satisfying the predicate are included in the B-Tree. Advantages:\n1. Storage: The index contains only 500 entries instead of 10,000,000, reducing index size by 99.9%.\n2. Memory: Fits easily in RAM (`shared_buffers`).\n3. Write performance: Inserts and updates to completed jobs never touch or dirty this index.',
    expectedConcepts: [
      'Partial index with WHERE clause',
      'Drastic reduction in index size and disk footprint',
      'Zero write overhead for non-matching rows',
      'Cache efficiency in shared_buffers',
    ],
    hints: ['Add a WHERE clause directly to CREATE INDEX.'],
    followUp: {
      question: 'Will PostgreSQL use this partial index if a query executes: SELECT * FROM jobs WHERE status = \'COMPLETED\'?',
      expectedAnswer:
        'No. The index only contains rows where status = \'PENDING\'. Queries filtering on other statuses or without the status predicate cannot use this index and will perform a sequential scan.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Valid partial index DDL', 'Explains storage & memory reduction', 'Explains write overhead reduction'],
    },
  },
  {
    id: 'sql-t2-17',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 17,
    title: 'Expression / Functional Indexes in PostgreSQL',
    category: 'Indexes and Query Planning',
    questionType: 'conceptual',
    realWorldScenario:
      'Users are searching for emails case-insensitively: `WHERE LOWER(email) = \'alex@example.com\'`. Even though a B-Tree index exists on `email`, PostgreSQL executes a slow Sequential Scan.',
    questionStatement:
      'Why does wrapping a column in a function like `LOWER(email)` invalidate a standard B-Tree index? How does an Expression Index solve this problem?',
    referenceAnswer:
      'A standard B-Tree index on `email` stores raw, un-transformed email strings sorted in binary character order. When a query executes `LOWER(email)`, the database engine cannot assume that the lowercase transform maps monotonically to the sorted tree, forcing a Sequential Scan to compute `LOWER()` on every row. An Expression Index (`CREATE INDEX idx_users_lower_email ON users (LOWER(email));`) pre-computes and stores the lowercase value in the B-Tree, allowing instant O(log N) lookups.',
    expectedConcepts: [
      'Function wrapping prevents standard B-Tree index usage',
      'Expression index DDL syntax: CREATE INDEX ... ON table (FUNCTION(column))',
      'Pre-computation of function outputs in the index',
    ],
    hints: ['The index stores raw values, but the query tests computed values.'],
    followUp: {
      question: 'What requirement must a function satisfy to be used in a PostgreSQL expression index?',
      expectedAnswer:
        'The function must be IMMUTABLE—it must always return the exact same output given the same input arguments (e.g. LOWER() is immutable; NOW() or RANDOM() are volatile and prohibited).',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains why standard index is bypassed', 'Provides correct expression index syntax', 'Mentions immutability requirement'],
    },
  },
  {
    id: 'sql-t2-18',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 18,
    title: 'PostgreSQL JSONB vs JSON Storage and Operators',
    category: 'JSONB and PostgreSQL-specific features',
    questionType: 'conceptual',
    realWorldScenario:
      'An analytics logging platform stores heterogeneous event payloads and needs to decide between PostgreSQL\'s `JSON` and `JSONB` data types.',
    questionStatement:
      'What are the internal differences between `JSON` and `JSONB` in PostgreSQL? Which operators are used to extract text versus JSON objects?',
    referenceAnswer:
      '1. `JSON` stores an exact textual copy of the input string. It preserves whitespace, indentation, and key order, but must re-parse the raw text on every query. Does not support GIN indexing. 2. `JSONB` decomposes and stores data in a parsed binary format. Whitespace and duplicate keys are discarded, but queries are significantly faster and support GIN indexing.\nExtraction Operators:\n- `->` extracts a JSON object or array element (returns jsonb).\n- `->>` extracts an element as plain `TEXT`.\nExample: `data->\'user\'->>\'email\'`.',
    expectedConcepts: [
      'JSON textual representation vs JSONB decomposed binary format',
      'Re-parsing overhead of JSON',
      'GIN indexing capability of JSONB',
      '-> (jsonb) vs ->> (text) operators',
    ],
    hints: ['The "B" in JSONB stands for Binary.'],
    followUp: {
      question: 'What does the JSONB containment operator (@>) do?',
      expectedAnswer:
        'The containment operator (@>) checks whether the left JSONB value contains the right JSONB structure (e.g. data @> \'{"role": "ADMIN"}\'). It can be accelerated using GIN indexes for fast key/value searches.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Contrasts text vs binary storage', 'Identifies GIN index advantage', 'Correctly differentiates -> from ->>'],
    },
  },
  {
    id: 'sql-t2-19',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 19,
    title: 'PostgreSQL GIN (Generalized Inverted) Indexes on JSONB',
    category: 'JSONB and PostgreSQL-specific features',
    questionType: 'conceptual',
    realWorldScenario:
      'An audit log query `SELECT * FROM audit_logs WHERE properties @> \'{"ip_country": "DE"}\';` takes 4 seconds on 5 million records.',
    questionStatement:
      'Why is a standard B-Tree index incapable of accelerating arbitrary JSONB key/value searches? How does a GIN index work on JSONB columns?',
    referenceAnswer:
      'B-Tree indexes sort entire values in scalar sequence. In a JSONB document with dynamic keys and nested objects, there is no scalar ordering that allows looking up internal key-value pairs. A Generalized Inverted Index (GIN) breaks down the JSONB document into individual key-value tokens (paths and scalar values). The GIN index stores an inverted list: for each token, it lists all table row IDs (TIDs) containing that token. Searching for `{"ip_country": "DE"}` performs an instant set intersection of matching row IDs.',
    expectedConcepts: [
      'Inverted index structure',
      'Tokens mapping to row ID posting lists',
      'Acceleration of containment operator (@>)',
      'Write overhead of GIN indexes',
    ],
    hints: ['Think of GIN like an index at the back of a textbook mapping terms to page numbers.'],
    followUp: {
      question: 'What is the difference between jsonb_ops and jsonb_path_ops operator classes for GIN indexes?',
      expectedAnswer:
        'jsonb_ops (default) indexes both keys and values separately, supporting ?, ?|, and @> operators. jsonb_path_ops hashes entire paths (e.g. hash("a.b.c")), creating much smaller and faster indexes, but only supports the @> containment operator.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains inverted index concept', 'Explains posting lists / TIDs', 'Explains containment acceleration'],
    },
  },
  {
    id: 'sql-t2-20',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 20,
    title: 'PostgreSQL Read Committed vs. Repeatable Read Isolation Levels',
    category: 'Isolation Levels and MVCC',
    questionType: 'conceptual',
    realWorldScenario:
      'An analytical report queries customer balances at 10:00 AM, then executes a second query at 10:01 AM inside the same transaction. The second query returns different numbers because other users made payments in the interim.',
    questionStatement:
      'Explain why this Non-Repeatable Read anomaly occurs under PostgreSQL\'s default `Read Committed` isolation level. How does `Repeatable Read` prevent this using snapshot isolation?',
    referenceAnswer:
      'Under `Read Committed` (PostgreSQL default), each SQL statement inside a transaction sees a fresh snapshot of all data committed before THAT statement began. If a concurrent transaction commits changes between query 1 and query 2, query 2 sees the new data (Non-Repeatable Read). Under `Repeatable Read`, PostgreSQL captures a single transaction snapshot when the FIRST statement in the transaction executes. All subsequent queries throughout the transaction see that exact same snapshot, guaranteeing consistent reads regardless of concurrent commits.',
    expectedConcepts: [
      'Read Committed statement-level snapshot',
      'Repeatable Read transaction-level snapshot',
      'Non-repeatable read anomaly definition',
      'MVCC snapshot isolation',
    ],
    hints: ['Does a transaction see commits that happened after the transaction started, or after each statement started?'],
    followUp: {
      question: 'What happens in Repeatable Read if transaction T1 tries to UPDATE a row that was updated and committed by transaction T2 after T1\'s snapshot was taken?',
      expectedAnswer:
        'PostgreSQL raises a serialization failure: "ERROR: could not serialize access due to concurrent update". Transaction T1 must abort and retry from the beginning.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Differentiates statement snapshot from transaction snapshot', 'Defines non-repeatable read', 'Explains snapshot isolation'],
    },
  },
  {
    id: 'sql-t2-21',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 21,
    title: 'Row-Level Locking with SELECT FOR UPDATE',
    category: 'Locks and Deadlocks',
    questionType: 'conceptual',
    realWorldScenario:
      'Two concurrent requests read an account balance ($100), check that it is >= $80, and both proceed to debit $80 simultaneously, causing the balance to go negative (-$60).',
    questionStatement:
      'Explain this Check-Then-Act race condition. How does `SELECT ... FOR UPDATE` prevent it, and what row-level locks does it acquire?',
    referenceAnswer:
      'The Check-Then-Act anomaly occurs when two transactions read the same initial state concurrently. Since neither holds a lock, both read $100 and both pass the balance check. To prevent this, Transaction 1 executes:\n```sql\nSELECT balance FROM accounts WHERE id = 1 FOR UPDATE;\n```\n`FOR UPDATE` places an Exclusive Row-Level Lock (`RowExclusiveLock` / `XMAX` marking). When Transaction 2 attempts `SELECT ... FOR UPDATE` on row 1, it blocks until Transaction 1 commits or rolls back. Once unblocked, Transaction 2 re-reads the updated balance ($20), fails the balance check, and aborts safely.',
    expectedConcepts: [
      'Check-then-act race condition',
      'Pessimistic locking with FOR UPDATE',
      'Lock contention and blocking until commit',
      'Preventing negative balance overselling',
    ],
    hints: ['FOR UPDATE locks the specific rows matched by the query.'],
    followUp: {
      question: 'What does SELECT ... FOR UPDATE SKIP LOCKED do, and why is it used in high-throughput task queues?',
      expectedAnswer:
        'SKIP LOCKED instructs PostgreSQL to bypass any rows currently locked by concurrent transactions and return the next unlocked rows immediately. This allows multiple background workers to consume jobs from a queue table concurrently without blocking each other.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains check-then-act anomaly', 'Shows SELECT FOR UPDATE syntax', 'Explains blocking and commit release'],
    },
  },
  {
    id: 'sql-t2-22',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 22,
    title: 'Optimistic Locking with Version Columns',
    category: 'Transactions and ACID',
    questionType: 'conceptual',
    realWorldScenario:
      'An enterprise CRM system has users editing customer profile pages in browser tabs for minutes at a time. Holding a database lock for minutes with SELECT FOR UPDATE would exhaust connections and freeze the database.',
    questionStatement:
      'What is Optimistic Concurrency Control (OCC)? How does a version number or updated_at column implement optimistic locking in application SQL?',
    referenceAnswer:
      'Optimistic Locking assumes conflicts are rare and holds NO database locks during user think time. 1. Add a `version INT DEFAULT 1` column to the table. 2. When the user loads the edit form, fetch `id`, `name`, and `version` (e.g. version = 3). 3. When submitting changes, execute:\n```sql\nUPDATE customers\nSET name = \'New Name\', version = version + 1\nWHERE id = 101 AND version = 3;\n```\n4. Check the database row count affected. If affected rows = 1, the update succeeded. If affected rows = 0, another user updated the record in the meantime; the application rejects the write and prompts the user to refresh and merge changes.',
    expectedConcepts: [
      'Optimistic vs Pessimistic locking',
      'Zero database lock holding during user think time',
      'Version column comparison in WHERE clause',
      'Affected rows verification (0 = conflict)',
    ],
    hints: ['Check the version in the WHERE clause and increment it in SET.'],
    followUp: {
      question: 'Compare Optimistic Locking and Pessimistic Locking in terms of suitability for high-conflict vs low-conflict workloads.',
      expectedAnswer:
        'Pessimistic locking (SELECT FOR UPDATE) is best for high-conflict, short-duration transactions (e.g. flash-sale tickets, bank transfers). Optimistic locking is best for low-conflict or long-duration human workflows (e.g. web forms, CMS articles).',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines Optimistic Locking', 'Shows SQL with version column', 'Explains affected rows check'],
    },
  },
  {
    id: 'sql-t2-23',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 23,
    title: 'Understanding PostgreSQL MVCC: Tuple Headers and xmin / xmax',
    category: 'Isolation Levels and MVCC',
    questionType: 'conceptual',
    realWorldScenario:
      'A software engineer asks how PostgreSQL allows readers to read data without locking out concurrent writers.',
    questionStatement:
      'What is Multi-Version Concurrency Control (MVCC) in PostgreSQL? Explain how every row tuple uses hidden system columns `xmin` and `xmax` to determine visibility.',
    referenceAnswer:
      'MVCC ensures that "readers never block writers, and writers never block readers". Instead of overwriting row data in-place on UPDATE, PostgreSQL writes a brand-new row version (tuple). Every tuple has hidden header metadata:\n- `xmin`: The transaction ID that inserted this tuple.\n- `xmax`: The transaction ID that deleted or updated this tuple (0 if active).\nWhen a query runs, PostgreSQL compares its transaction snapshot against each tuple\'s `xmin` and `xmax`. If `xmin` is committed before the snapshot and `xmax` is either uncommitted or created after the snapshot, the tuple is visible to that reader.',
    expectedConcepts: [
      'Multi-Version Concurrency Control (MVCC)',
      'Readers do not block writers, writers do not block readers',
      'xmin (creation transaction ID)',
      'xmax (deletion/update transaction ID)',
      'Tuple visibility determination',
    ],
    hints: ['Think of UPDATE as inserting a new row and setting xmax on the old row.'],
    followUp: {
      question: 'What happens to dead row versions (tuples where xmax is committed and expired) over time?',
      expectedAnswer:
        'Dead tuples remain on disk and cause table bloat until PostgreSQL\'s VACUUM (or autovacuum) process scans the table, reclaims the dead space, and updates the Free Space Map (FSM).',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines MVCC principle', 'Explains xmin and xmax roles', 'Explains snapshot comparison'],
    },
  },
  {
    id: 'sql-t2-24',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 24,
    title: 'PostgreSQL Autovacuum and Table Bloat',
    category: 'Isolation Levels and MVCC',
    questionType: 'conceptual',
    realWorldScenario:
      'A high-frequency orders table receives 500,000 updates daily. Over two months, disk usage doubled even though the active row count remained constant at 1 million rows.',
    questionStatement:
      'What causes Table Bloat in PostgreSQL? Explain what the VACUUM process does, and why VACUUM FULL should be used with extreme caution.',
    referenceAnswer:
      'Because of MVCC, UPDATE statements do not modify rows in-place; they mark the old tuple dead (`xmax` set) and append a new tuple. If dead tuples accumulate faster than autovacuum cleans them, disk pages become bloated with dead rows.\n`VACUUM` (standard) scans pages, marks dead space as reusable for future inserts in the Free Space Map, and does NOT lock the table against reads/writes. It does not return disk space to the OS.\n`VACUUM FULL` rewrites the entire table into a brand-new file on disk, compacting all pages. CAUTION: It acquires an `ACCESS EXCLUSIVE` lock, completely blocking all reads and writes for the duration, which can take hours and cause total application downtime.',
    expectedConcepts: [
      'Dead tuple accumulation from UPDATE/DELETE',
      'Standard VACUUM reclaims space internally without blocking',
      'VACUUM FULL acquires ACCESS EXCLUSIVE lock and rewrites file',
      'Table bloat impact on memory cache and sequential scans',
    ],
    hints: ['Standard VACUUM is online; VACUUM FULL is an exclusive lock rewrite.'],
    followUp: {
      question: 'What open-source tool allows rebuilding a bloated PostgreSQL table online without taking an exclusive lock?',
      expectedAnswer:
        'pg_repack. It creates an auxiliary table, copies data, tracks concurrent changes via triggers, and swaps the tables with a momentary lock, returning space to the OS with zero downtime.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains dead tuples and bloat cause', 'Differentiates VACUUM from VACUUM FULL', 'Identifies ACCESS EXCLUSIVE lock downtime risk'],
    },
  },
  {
    id: 'sql-t2-25',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 25,
    title: 'Keyset Pagination vs. OFFSET Pagination',
    category: 'Query Optimization',
    questionType: 'conceptual',
    realWorldScenario:
      'A mobile app user scrolls through infinite search results: `SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 500000;`. The API response time degrades from 15ms on page 1 to 4.2 seconds on page 25,000.',
    questionStatement:
      'Why does OFFSET pagination degrade linearly with high offsets? How does Keyset Pagination (Cursor Pagination) solve this with O(1) performance?',
    referenceAnswer:
      '`OFFSET 500000 LIMIT 20` requires the database engine to physically read and process 500,020 rows, discard the first 500,000, and return only the last 20. This burns CPU and I/O (O(N) cost).\nKeyset Pagination uses the previous page\'s last row values as a cursor:\n```sql\nSELECT * FROM orders\nWHERE (created_at, id) < (\'2024-03-01 10:00:00\', 98412)\nORDER BY created_at DESC, id DESC\nLIMIT 20;\n```\nBecause `(created_at, id)` is indexed in a B-Tree, PostgreSQL jumps directly to the cursor position in O(log N) time and scans exactly 20 rows. Query execution remains 15ms whether on page 1 or page 100,000.',
    expectedConcepts: [
      'OFFSET linear degradation O(N)',
      'Keyset / Cursor pagination pattern',
      'B-Tree direct traversal O(log N)',
      'Consistent response time regardless of page depth',
    ],
    hints: ['Use the last seen date and ID in a WHERE clause instead of OFFSET.'],
    followUp: {
      question: 'What is the main user experience limitation of Keyset Pagination compared to OFFSET pagination?',
      expectedAnswer:
        'Keyset pagination does not allow jumping directly to an arbitrary page (e.g. "Jump to Page 47") or displaying total page count, making it ideal for infinite scroll but less suitable for traditional numeric pagination bars.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains why OFFSET reads and discards rows', 'Demonstrates keyset SQL query', 'Explains B-Tree index traversal'],
    },
  },
  {
    id: 'sql-t2-26',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 26,
    title: 'Database Deadlocks: Causes and Prevention',
    category: 'Locks and Deadlocks',
    questionType: 'conceptual',
    realWorldScenario:
      'In a peer-to-peer payment app, User A transfers $50 to User B at the exact same millisecond that User B transfers $30 to User A. The application server logs: `ERROR: deadlock detected`.',
    questionStatement:
      'What causes a database Deadlock? How does PostgreSQL detect and break deadlocks? What is the golden rule for preventing them in application code?',
    referenceAnswer:
      'A Deadlock occurs when two or more transactions hold locks that the other needs, creating a circular wait condition:\n- T1 locks Account A and waits for Account B.\n- T2 locks Account B and waits for Account A.\nNeither transaction can proceed. PostgreSQL runs a background deadlock detector (triggered after `deadlock_timeout`, default 1s). It analyzes the lock dependency graph, detects the cycle, and forcibly aborts one transaction with `ERROR: deadlock detected` so the other can finish.\nGolden Prevention Rule: Always acquire locks in a globally consistent order (e.g. sort account IDs ascending in application code: lock `LEAST(acc_a, acc_b)` first, then `GREATEST(acc_a, acc_b)`).',
    expectedConcepts: [
      'Circular lock dependency',
      'deadlock_timeout and dependency cycle detection',
      'Automatic transaction abort and rollback',
      'Consistent resource locking order (canonical ordering)',
    ],
    hints: ['If both transactions always lock account IDs in numerical order, can a cycle form?'],
    followUp: {
      question: 'How should an application handle a deadlock error when it receives one from the database?',
      expectedAnswer:
        'The application must catch the 40P01 deadlock exception, roll back the failed transaction, wait for a short randomized jitter delay, and automatically retry the transaction from the beginning.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains circular wait', 'Explains PostgreSQL deadlock_timeout detection', 'Provides canonical ordering solution'],
    },
  },
  {
    id: 'sql-t2-27',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 27,
    title: 'PostgreSQL Read Replicas and Replication Lag',
    category: 'Backup, Recovery, and Replication',
    questionType: 'conceptual',
    realWorldScenario:
      'A user updates their shipping address on an e-commerce site, clicks save, and is redirected to their profile page. The profile page still displays their old address. A refresh 2 seconds later shows the new address.',
    questionStatement:
      'What is Replication Lag in primary-replica database architectures? What read-after-write consistency problem did this user experience, and how is it resolved?',
    referenceAnswer:
      'Most PostgreSQL replication is asynchronous: writes commit immediately on the Primary node, and WAL records stream asynchronously to Read Replicas. Replication Lag is the delay (milliseconds to seconds) before the replica applies those WAL changes.\nThe user experienced a Read-After-Write Consistency failure: the update was written to the Primary, but the redirect read was routed to a lagging Read Replica.\nSolutions:\n1. Sticky routing: Route reads from recently-modified sessions to the Primary for 5–10 seconds.\n2. LSN tracking: The primary returns its current Log Sequence Number (LSN); the read query waits on the replica until it replays up to that LSN.\n3. Route user-profile editing views strictly to the Primary.',
    expectedConcepts: [
      'Asynchronous replication delay',
      'Read-after-write consistency failure',
      'Read replica routing architecture',
      'Session-level sticky primary routing',
    ],
    hints: ['The write went to the Primary, but which server did the next read come from?'],
    followUp: {
      question: 'Why not use Synchronous Replication for all read replicas to eliminate lag completely?',
      expectedAnswer:
        'Synchronous replication forces every write transaction to block and wait until the slowest replica acknowledges receipt. A network blip or replica crash will freeze all writes on the primary database.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains asynchronous replication lag', 'Diagnoses read-after-write inconsistency', 'Provides concrete mitigation architectures'],
    },
  },
  {
    id: 'sql-t2-28',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 28,
    title: 'SQL Upsert Patterns: INSERT ... ON CONFLICT DO UPDATE',
    category: 'SQL Fundamentals',
    questionType: 'conceptual',
    realWorldScenario:
      'A telemetry service aggregates daily page views per user. If the record for today does not exist, insert it with count = 1; if it already exists, increment the existing count by 1.',
    questionStatement:
      'Write the PostgreSQL `INSERT ... ON CONFLICT` statement to achieve this atomic upsert. Why is this superior to executing `SELECT` followed by `INSERT` or `UPDATE` in application code?',
    referenceAnswer:
      '```sql\nINSERT INTO user_daily_views (user_id, view_date, view_count)\nVALUES (101, \'2024-03-20\', 1)\nON CONFLICT (user_id, view_date)\nDO UPDATE SET view_count = user_daily_views.view_count + EXCLUDED.view_count;\n```\nWhy it is superior: A `SELECT` followed by `INSERT/UPDATE` in application code has an inherent race condition (Check-Then-Act). Two concurrent requests will both see no row and both attempt `INSERT`, causing a duplicate key violation. `ON CONFLICT` is an atomic, in-engine operation that handles concurrency safely at the row level.',
    expectedConcepts: [
      'ON CONFLICT target column specification',
      'EXCLUDED pseudo-record',
      'Atomic upsert concurrency guarantee',
      'Check-then-act race prevention',
    ],
    hints: ['Use the EXCLUDED keyword to access the values that were proposed for insertion.'],
    followUp: {
      question: 'What is required on the target columns (user_id, view_date) for ON CONFLICT to work?',
      expectedAnswer:
        'A unique constraint or unique index must exist on the conflict target columns (user_id, view_date). Without a unique constraint, PostgreSQL throws an error because it cannot identify a conflict boundary.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Accurate ON CONFLICT DO UPDATE syntax', 'Uses EXCLUDED properly', 'Explains concurrency race condition'],
    },
  },
  {
    id: 'sql-t2-29',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 29,
    title: 'Soft Deletes vs. Hard Deletes: Architecture and Query Traps',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'An engineering team implements soft deletes by adding `is_deleted BOOLEAN DEFAULT false` to every table.',
    questionStatement:
      'What are the advantages of soft deletes? What query traps, index bloat, and UNIQUE constraint complications do soft deletes introduce?',
    referenceAnswer:
      'Advantages: Accidental deletion recovery, historical audit retention, referential integrity preservation.\nQuery Traps & Complications:\n1. Developer trap: Every query, join, and count across the codebase must remember `WHERE is_deleted = false`. Forgetting this leaks deleted users or inflates financial totals.\n2. UNIQUE constraint break: If `email` has a UNIQUE constraint and a user deletes their account, they cannot re-register with that email unless a partial unique index is used: `CREATE UNIQUE INDEX idx_users_active_email ON users (email) WHERE is_deleted = false;`.\n3. Index bloat: Indexes continue indexing dead rows unless partial indexes are used.',
    expectedConcepts: [
      'Soft delete definition and audit advantages',
      'Leaked deleted records in un-filtered queries',
      'Unique constraint collisions upon re-registration',
      'Partial unique index resolution',
    ],
    hints: ['What happens if a user soft-deletes their account and later tries to register again with the same email?'],
    followUp: {
      question: 'What is a cleaner alternative to soft delete columns for tables that must maintain strict relational constraints?',
      expectedAnswer:
        'Move deleted records to a dedicated archive table (e.g. users_archive) using a DELETE ... RETURNING trigger. The active table remains small, fast, and unpolluted with deleted flags, and standard UNIQUE constraints work naturally.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains soft delete benefits', 'Identifies unique constraint break', 'Provides partial unique index solution'],
    },
  },
  {
    id: 'sql-t2-30',
    tier: 'tier-2',
    difficultyLabel: 'Intermediate',
    order: 30,
    title: 'Materialized Views and Concurrent Refresh in PostgreSQL',
    category: 'Query Optimization',
    questionType: 'conceptual',
    realWorldScenario:
      'An executive dashboard takes 25 seconds to generate monthly financial summary charts across 40 million transactions.',
    questionStatement:
      'What is a Materialized View in PostgreSQL? How does `REFRESH MATERIALIZED VIEW CONCURRENTLY` work, and what unique index is required?',
    referenceAnswer:
      'A Materialized View physically caches the result set of an expensive query on disk as a table-like object (`CREATE MATERIALIZED VIEW monthly_financial_summary AS ...`). Reading from it takes 2ms instead of 25 seconds.\nA standard `REFRESH MATERIALIZED VIEW` takes an exclusive read lock on the view, blocking all dashboard queries while it recomputes.\n`REFRESH MATERIALIZED VIEW CONCURRENTLY` allows concurrent reads while refreshing! It computes the new data into a temporary table, diffs it against the old view, and applies updates in place. REQUIREMENT: A unique index must exist on the materialized view (`CREATE UNIQUE INDEX ON monthly_financial_summary (year, month);`) to allow row-by-row diffing.',
    expectedConcepts: [
      'Materialized View disk persistence',
      'Sub-millisecond analytical reads',
      'REFRESH MATERIALIZED VIEW CONCURRENTLY non-blocking operation',
      'Mandatory unique index requirement for concurrent refresh',
    ],
    hints: ['Why does CONCURRENTLY need a unique index to know which rows changed?'],
    followUp: {
      question: 'What is the downside of REFRESH MATERIALIZED VIEW CONCURRENTLY compared to a standard refresh?',
      expectedAnswer:
        'It takes longer to execute and uses more CPU/WAL because it must perform a full relational diff and apply updates individually rather than bulk-replacing the file.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines Materialized View', 'Explains non-blocking concurrent refresh', 'States mandatory unique index requirement'],
    },
  },
];

export const TIER2_INTERMEDIATE_QUESTIONS = tier2IntermediateQuestions;
