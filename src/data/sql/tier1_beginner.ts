import { SqlQuestion } from '@/types/sqlTrack';

export const tier1BeginnerQuestions: SqlQuestion[] = [
  // 1. SQL Fundamentals
  {
    id: 'sql-t1-01',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 1,
    title: 'Basic Column Projection and Row Limiting',
    category: 'SQL Fundamentals',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'The inventory operations team needs a quick glance at available catalog items to verify stock naming and retail pricing.',
    questionStatement:
      'Write a query to retrieve the `name`, `category`, and `price` of all products from the `products` table, ordered alphabetically by `name`, limited to the first 5 records.',
    starterCode: '-- Select name, category, and price for the first 5 products\nSELECT\n  name,\n  category,\n  price\nFROM products\nORDER BY name ASC\nLIMIT 5;',
    sqlSolution: 'SELECT name, category, price FROM products ORDER BY name ASC LIMIT 5;',
    referenceAnswer:
      'The `SELECT` statement specifies the columns `name`, `category`, and `price`. `FROM products` targets the table. `ORDER BY name ASC` sorts results alphabetically by name, and `LIMIT 5` restricts the output to 5 rows.',
    expectedConcepts: ['SELECT clause', 'FROM clause', 'ORDER BY ASC', 'LIMIT clause'],
    hints: [
      'List the requested column names separated by commas.',
      'Use ORDER BY name ASC to sort alphabetically.',
      'Append LIMIT 5 at the end of the query.',
    ],
    followUp: {
      question: 'What happens if you omit the ORDER BY clause when using LIMIT in a relational database?',
      expectedAnswer:
        'Without an ORDER BY clause, SQL tables have no guaranteed order. The database engine may return any arbitrary 5 rows depending on storage layout or execution plan, making pagination non-deterministic.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: [
        'Selects only the three requested columns',
        'Sorts alphabetically by product name',
        'Restricts output to exactly 5 rows',
      ],
    },
    testCases: [
      {
        id: 'tc-t1-01',
        description: 'Verify first 5 products in alphabetical order',
        expectedRows: [
          { name: 'Database Internals in Practice', category: 'Books', price: 52.0 },
          { name: 'Designing Data-Intensive Applications', category: 'Books', price: 45.0 },
          { name: 'Discontinued USB Hub', category: 'Electronics', price: 25.0 },
          { name: 'Ergonomic Standing Desk Mat', category: 'Home & Kitchen', price: 49.95 },
          { name: 'Mechanical Wireless Keyboard', category: 'Electronics', price: 129.5 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-02',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 2,
    title: 'Filtering Active Catalog Products with WHERE',
    category: 'SQL Fundamentals',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Merchandising wants an active products list excluding discontinued or archived inventory.',
    questionStatement:
      'Write a query to retrieve the `sku`, `name`, and `price` of all products from `products` where `is_active` is true and `price` is greater than 100.00, sorted by `price` descending.',
    starterCode: '-- Find active products with price > 100\nSELECT\n  sku,\n  name,\n  price\nFROM products\nWHERE is_active = true AND price > 100\nORDER BY price DESC;',
    sqlSolution: 'SELECT sku, name, price FROM products WHERE is_active = true AND price > 100 ORDER BY price DESC;',
    referenceAnswer:
      'Combines boolean condition `is_active = true` and numerical comparison `price > 100` using the logical `AND` operator, sorting by `price DESC` to surface premium items first.',
    expectedConcepts: ['WHERE clause', 'Logical AND', 'Comparison operators', 'ORDER BY DESC'],
    hints: [
      'Use the AND operator to satisfy both conditions simultaneously.',
      'Sort using ORDER BY price DESC.',
    ],
    followUp: {
      question: 'How does SQL handle NULL values when evaluating a WHERE condition like price > 100?',
      expectedAnswer:
        'SQL uses three-valued logic (TRUE, FALSE, UNKNOWN). If price is NULL, price > 100 evaluates to UNKNOWN. The WHERE clause only accepts rows evaluating strictly to TRUE, so rows with NULL price are excluded.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: [
        'Correctly filters active items only',
        'Excludes items with price <= 100',
        'Orders results by price descending',
      ],
    },
    testCases: [
      {
        id: 'tc-t1-02',
        description: 'Verify active products priced above $100',
        expectedRows: [
          { sku: 'TECH-003', name: 'Ultra-Wide 4K Gaming Monitor', price: 549.0 },
          { sku: 'HOME-001', name: 'Smart Induction Espresso Machine', price: 249.99 },
          { sku: 'TECH-001', name: 'Noise-Cancelling Headphones', price: 199.99 },
          { sku: 'FASH-002', name: 'Waterproof Trail Running Shoes', price: 135.0 },
          { sku: 'TECH-002', name: 'Mechanical Wireless Keyboard', price: 129.5 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-03',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 3,
    title: 'Eliminating Duplicates with DISTINCT',
    category: 'SQL Fundamentals',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'The marketing team wants a unique list of all merchandise categories currently offered.',
    questionStatement:
      'Write a query to retrieve all distinct product `category` names from the `products` table, sorted alphabetically.',
    starterCode: '-- Select unique categories\nSELECT DISTINCT category\nFROM products\nORDER BY category ASC;',
    sqlSolution: 'SELECT DISTINCT category FROM products ORDER BY category ASC;',
    referenceAnswer:
      '`SELECT DISTINCT category` deduplicates recurring categories across the product catalog. `ORDER BY category ASC` provides a clean alphabetical directory.',
    expectedConcepts: ['DISTINCT keyword', 'Deduplication', 'ORDER BY'],
    hints: [
      'Place DISTINCT immediately after SELECT.',
      'Order by category alphabetically.',
    ],
    followUp: {
      question: 'What is the performance implication of applying DISTINCT on very large result sets?',
      expectedAnswer:
        'DISTINCT requires the database engine to sort the rows or build an in-memory hash set to identify duplicates. On millions of rows, this can cause spill-to-disk (work_mem exhaustion) if not indexed.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Applies DISTINCT correctly', 'Sorts alphabetically'],
    },
    testCases: [
      {
        id: 'tc-t1-03',
        description: 'Verify unique product categories',
        expectedRows: [
          { category: 'Apparel' },
          { category: 'Books' },
          { category: 'Electronics' },
          { category: 'Home & Kitchen' },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-04',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 4,
    title: 'Pattern Matching with LIKE and Wildcards',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Customer support needs to find all customers registered with an @example.com email address.',
    questionStatement:
      'Write a query to return the `id`, `name`, and `email` of all customers whose `email` ends with `@example.com`, ordered by `id` ascending.',
    starterCode: '-- Find customers with example.com emails\nSELECT id, name, email\nFROM customers\nWHERE email LIKE \'%@example.com\'\nORDER BY id ASC;',
    sqlSolution: 'SELECT id, name, email FROM customers WHERE email LIKE \'%@example.com\' ORDER BY id ASC;',
    referenceAnswer:
      '`LIKE \'%@example.com\'` matches any character sequence followed by `@example.com`. In standard SQL, `%` represents zero or more characters.',
    expectedConcepts: ['LIKE operator', 'Percent wildcard %', 'String filtering'],
    hints: ['The % wildcard matches zero or more characters before the string.'],
    followUp: {
      question: 'In PostgreSQL, what is the difference between LIKE and ILIKE?',
      expectedAnswer:
        'LIKE is case-sensitive, meaning \'abc\' LIKE \'%ABC\' evaluates to false. ILIKE is a PostgreSQL-specific extension that performs case-insensitive pattern matching.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Correct pattern match syntax', 'Preserves case matching', 'Ordered by id'],
    },
    testCases: [
      {
        id: 'tc-t1-04',
        description: 'Verify customers matching email domain wildcard',
        expectedRows: [
          { id: 1, name: 'Aarav Patel', email: 'aarav.patel@example.com' },
          { id: 2, name: 'Sophia Miller', email: 'sophia.m@example.com' },
          { id: 3, name: 'Carlos Rodriguez', email: 'carlos.r@example.com' },
          { id: 4, name: 'Emma Watson', email: 'emma.w@example.com' },
          { id: 5, name: 'Rohan Sharma', email: 'rohan.s@example.com' },
          { id: 6, name: 'Yuki Tanaka', email: 'yuki.t@example.com' },
          { id: 7, name: 'Mia Chen', email: 'mia.c@example.com' },
          { id: 8, name: 'Lucas Silva', email: 'lucas.s@example.com' },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-05',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 5,
    title: 'Range Filtering with BETWEEN and Date Comparison',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Finance auditors require all orders placed during the entire month of February 2024.',
    questionStatement:
      'Write a query to retrieve the `id`, `customer_id`, `order_date`, and `total_amount` for all orders placed between `2024-02-01 00:00:00` and `2024-02-29 23:59:59`, ordered by `order_date` ascending.',
    starterCode: '-- Filter orders in February 2024\nSELECT id, customer_id, order_date, total_amount\nFROM orders\nWHERE order_date >= \'2024-02-01\' AND order_date < \'2024-03-01\'\nORDER BY order_date ASC;',
    sqlSolution: 'SELECT id, customer_id, order_date, total_amount FROM orders WHERE order_date >= \'2024-02-01\' AND order_date < \'2024-03-01\' ORDER BY order_date ASC;',
    referenceAnswer:
      'Filtering timestamp ranges is best done using half-open intervals: `>= \'2024-02-01\'` and `< \'2024-03-01\'`. This cleanly captures all timestamp entries up to 23:59:59.999 without precision loss.',
    expectedConcepts: ['Date filtering', 'Half-open intervals', 'Logical comparison'],
    hints: ['A half-open interval >= start AND < next_month handles all times within the month.'],
    followUp: {
      question: 'Why is using BETWEEN with datetime values considered an anti-pattern in production queries?',
      expectedAnswer:
        'BETWEEN is inclusive on both ends. If the boundary is \'2024-02-28\', it defaults to \'2024-02-28 00:00:00\', excluding orders placed later that day. If using \'2024-02-28 23:59:59\', records with sub-second precision (e.g. 23:59:59.500) can be missed.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Correct February bounds', 'Chronological order'],
    },
    testCases: [
      {
        id: 'tc-t1-05',
        description: 'Verify February 2024 order list',
        expectedRows: [
          { id: 101, customer_id: 1, order_date: '2024-02-10 14:00:00', total_amount: 329.49 },
          { id: 102, customer_id: 2, order_date: '2024-02-12 18:20:00', total_amount: 549.0 },
          { id: 103, customer_id: 1, order_date: '2024-02-18 09:40:00', total_amount: 89.0 },
          { id: 104, customer_id: 3, order_date: '2024-02-22 16:15:00', total_amount: 249.99 },
          { id: 105, customer_id: 4, order_date: '2024-02-28 11:30:00', total_amount: 97.0 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-06',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 6,
    title: 'Membership Filtering with the IN Operator',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Warehouse logistics needs to see orders that require immediate physical shipping or delivery attention.',
    questionStatement:
      'Write a query to retrieve all orders with status in `(\'PAID\', \'SHIPPED\')`, displaying `id`, `status`, and `total_amount`, sorted by `id` ascending.',
    starterCode: '-- Filter orders with status IN (\'PAID\', \'SHIPPED\')\nSELECT id, status, total_amount\nFROM orders\nWHERE status IN (\'PAID\', \'SHIPPED\')\nORDER BY id ASC;',
    sqlSolution: 'SELECT id, status, total_amount FROM orders WHERE status IN (\'PAID\', \'SHIPPED\') ORDER BY id ASC;',
    referenceAnswer:
      '`WHERE status IN (\'PAID\', \'SHIPPED\')` concisely matches any row whose status matches either literal in the set, avoiding verbose `OR` chains.',
    expectedConcepts: ['IN operator', 'Set membership', 'Status lifecycle'],
    hints: ['The IN operator accepts a comma-separated list of literals in parentheses.'],
    followUp: {
      question: 'What is the danger of using NOT IN with a subquery containing NULL values?',
      expectedAnswer:
        'If any row in the subquery result is NULL, NOT IN evaluates to UNKNOWN for all rows, resulting in an empty set. NOT EXISTS or IN with IS NOT NULL should be used instead.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Includes PAID and SHIPPED', 'Excludes DELIVERED and PENDING'],
    },
    testCases: [
      {
        id: 'tc-t1-06',
        description: 'Verify orders in PAID or SHIPPED state',
        expectedRows: [
          { id: 105, status: 'PAID', total_amount: 97.0 },
          { id: 107, status: 'PAID', total_amount: 199.99 },
          { id: 108, status: 'SHIPPED', total_amount: 798.99 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-07',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 7,
    title: 'Handling Missing Data with IS NULL and IS NOT NULL',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'saas_analytics',
    realWorldScenario:
      'Finance accounts receivable needs to audit unpaid invoices requiring payment collection.',
    questionStatement:
      'Write a query from the `invoices` table to retrieve `id`, `organization_id`, `amount`, and `status` for all invoices where `paid_at IS NULL`, ordered by `amount` descending.',
    starterCode: '-- Find unpaid invoices\nSELECT id, organization_id, amount, status\nFROM invoices\nWHERE paid_at IS NULL\nORDER BY amount DESC;',
    sqlSolution: 'SELECT id, organization_id, amount, status FROM invoices WHERE paid_at IS NULL ORDER BY amount DESC;',
    referenceAnswer:
      'In SQL, NULL signifies unknown or absent data. Testing equality with `= NULL` always evaluates to UNKNOWN. `IS NULL` is the mandatory syntax to check for missing values.',
    expectedConcepts: ['IS NULL predicate', 'Three-valued logic', 'NULL comparison'],
    hints: ['Never use = NULL in SQL; always use IS NULL or IS NOT NULL.'],
    followUp: {
      question: 'Why does WHERE paid_at = NULL fail to return any rows?',
      expectedAnswer:
        'In SQL three-valued logic, NULL represents an unknown value. Comparing anything to unknown yields UNKNOWN, never TRUE. A WHERE clause requires a boolean TRUE to include the row.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Uses IS NULL syntax correctly', 'Orders by amount descending'],
    },
    testCases: [
      {
        id: 'tc-t1-07',
        description: 'Verify invoices with missing payment date',
        expectedRows: [
          { id: 9, organization_id: 104, amount: 49.0, status: 'OVERDUE' },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-08',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 8,
    title: 'Aggregating Totals with COUNT, SUM, and AVG',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'The CFO needs macro metrics on delivered orders: total order count, total gross revenue, and the average order value.',
    questionStatement:
      'Write a query on the `orders` table to calculate `total_orders` (count of rows), `gross_revenue` (sum of total_amount), and `avg_order_value` (average of total_amount rounded to 2 decimals) for orders with status `DELIVERED`.',
    starterCode: '-- Aggregate delivered orders\nSELECT\n  COUNT(*) AS total_orders,\n  SUM(total_amount) AS gross_revenue,\n  ROUND(AVG(total_amount), 2) AS avg_order_value\nFROM orders\nWHERE status = \'DELIVERED\';',
    sqlSolution: 'SELECT COUNT(*) AS total_orders, SUM(total_amount) AS gross_revenue, ROUND(AVG(total_amount), 2) AS avg_order_value FROM orders WHERE status = \'DELIVERED\';',
    referenceAnswer:
      '`COUNT(*)` tallies rows, `SUM(total_amount)` totals revenue, and `AVG(total_amount)` calculates the arithmetic mean for delivered orders.',
    expectedConcepts: ['COUNT(*)', 'SUM() aggregate', 'AVG() aggregate', 'ROUND() function', 'Column aliases AS'],
    hints: [
      'Use COUNT(*) to count all matching rows.',
      'Use SUM(total_amount) for revenue and AVG(total_amount) for average value.',
    ],
    followUp: {
      question: 'What is the difference between COUNT(*) and COUNT(column_name)?',
      expectedAnswer:
        'COUNT(*) counts all rows in the group regardless of contents, including rows where some columns are NULL. COUNT(column_name) counts only rows where the specified column is NOT NULL.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Applies correct aggregate functions', 'Filters for DELIVERED status', 'Aliases output columns cleanly'],
    },
    executionDialect: 'generic-sql',
    testCases: [
      {
        id: 'tc-t1-08',
        description: 'Verify aggregate metrics for delivered orders',
        expectedRows: [
          { total_orders: 7, gross_revenue: 1878.92, avg_order_value: 268.42 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-09',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 9,
    title: 'Grouping and Aggregating with GROUP BY',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Category managers need to analyze inventory depth by viewing product counts and average pricing per category.',
    questionStatement:
      'Write a query to group products by `category`, returning the `category`, `product_count` (number of products), and `avg_price` (average price rounded to 2 decimals), sorted by `product_count` descending.',
    starterCode: '-- Group products by category\nSELECT\n  category,\n  COUNT(*) AS product_count,\n  ROUND(AVG(price), 2) AS avg_price\nFROM products\nGROUP BY category\nORDER BY product_count DESC;',
    sqlSolution: 'SELECT category, COUNT(*) AS product_count, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category ORDER BY product_count DESC;',
    referenceAnswer:
      '`GROUP BY category` collapses rows sharing the same category into summary groups, allowing `COUNT(*)` and `AVG(price)` to be computed per category.',
    expectedConcepts: ['GROUP BY clause', 'Aggregate per group', 'ORDER BY aggregate alias'],
    hints: [
      'Every column in SELECT that is not an aggregate function must appear in the GROUP BY clause.',
    ],
    followUp: {
      question: 'Why will a query fail if you include an unaggregated column in SELECT that is not listed in GROUP BY?',
      expectedAnswer:
        'Relational semantics require each output cell to have a deterministic single value. If a group contains multiple rows with different values for an unaggregated column, the database cannot decide which value to display without an explicit aggregate.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Valid GROUP BY structure', 'Accurate per-category counts', 'Sorted by count descending'],
    },
    testCases: [
      {
        id: 'tc-t1-09',
        description: 'Verify product catalog breakdown by category',
        expectedRows: [
          { category: 'Electronics', product_count: 4, avg_price: 225.87 },
          { category: 'Apparel', product_count: 2, avg_price: 112.0 },
          { category: 'Home & Kitchen', product_count: 2, avg_price: 149.97 },
          { category: 'Books', product_count: 2, avg_price: 48.5 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-10',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 10,
    title: 'Filtering Grouped Aggregates with HAVING',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Marketing wants to identify VIP customers who have placed 2 or more orders.',
    questionStatement:
      'Write a query on the `orders` table grouping by `customer_id`, returning `customer_id` and `order_count` for all customers who have placed 2 or more orders, sorted by `order_count` descending.',
    starterCode: '-- Customers with 2 or more orders\nSELECT\n  customer_id,\n  COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) >= 2\nORDER BY order_count DESC;',
    sqlSolution: 'SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY order_count DESC;',
    referenceAnswer:
      '`HAVING COUNT(*) >= 2` filters groups after aggregation. `WHERE` cannot be used here because `WHERE` filters individual rows before grouping occurs.',
    expectedConcepts: ['HAVING clause', 'WHERE vs HAVING', 'Post-aggregation filtering'],
    hints: [
      'Use HAVING to filter aggregated values like COUNT(*).',
      'WHERE filters rows before GROUP BY; HAVING filters groups after.',
    ],
    followUp: {
      question: 'Explain the exact query execution order between WHERE, GROUP BY, and HAVING.',
      expectedAnswer:
        'The database engine executes: 1. FROM/JOIN to assemble source tables -> 2. WHERE to filter individual rows -> 3. GROUP BY to aggregate into buckets -> 4. HAVING to filter aggregated buckets -> 5. SELECT to project columns -> 6. ORDER BY -> 7. LIMIT.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Correct HAVING filter', 'Excludes customers with only 1 order', 'Sorted by order count'],
    },
    testCases: [
      {
        id: 'tc-t1-10',
        description: 'Verify repeat buyers with 2+ orders',
        expectedRows: [
          { customer_id: 1, order_count: 3 },
          { customer_id: 2, order_count: 2 },
          { customer_id: 3, order_count: 2 },
        ],
      },
    ],
  },
  // 3. Joins and Relationships
  {
    id: 'sql-t1-11',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 11,
    title: 'Basic INNER JOIN Across Two Relational Tables',
    category: 'Joins and Relationships',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'The shipping department needs to print packing manifests with customer names and order details.',
    questionStatement:
      'Write a query joining `orders` and `customers` to return `orders.id` as `order_id`, `customers.name` as `customer_name`, `orders.order_date`, and `orders.total_amount`, sorted by `orders.id` ascending.',
    starterCode: '-- Inner join orders and customers\nSELECT\n  o.id AS order_id,\n  c.name AS customer_name,\n  o.order_date,\n  o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nORDER BY o.id ASC;',
    sqlSolution: 'SELECT o.id AS order_id, c.name AS customer_name, o.order_date, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.id ASC;',
    referenceAnswer:
      '`JOIN customers c ON o.customer_id = c.id` performs an INNER JOIN connecting primary key `customers.id` with foreign key `orders.customer_id`. Only matching pairs are included.',
    expectedConcepts: ['INNER JOIN', 'Table aliases (o, c)', 'ON join predicate', 'Primary/Foreign key matching'],
    hints: [
      'Use table aliases like "orders o" and "customers c" for brevity.',
      'Specify the join condition using ON o.customer_id = c.id.',
    ],
    followUp: {
      question: 'What happens in an INNER JOIN if an order has a customer_id that does not exist in the customers table?',
      expectedAnswer:
        'In an INNER JOIN, the row is discarded because the ON predicate evaluates to false or unknown. To preserve orders with unlinked or NULL customer IDs, a LEFT JOIN is required.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper INNER JOIN condition', 'Aliases mapped cleanly', 'Orders matches ascending by id'],
    },
    testCases: [
      {
        id: 'tc-t1-11',
        description: 'Verify orders joined with customer names',
        expectedRows: [
          { order_id: 101, customer_name: 'Aarav Patel', order_date: '2024-02-10 14:00:00', total_amount: 329.49 },
          { order_id: 102, customer_name: 'Sophia Miller', order_date: '2024-02-12 18:20:00', total_amount: 549.0 },
          { order_id: 103, customer_name: 'Aarav Patel', order_date: '2024-02-18 09:40:00', total_amount: 89.0 },
          { order_id: 104, customer_name: 'Carlos Rodriguez', order_date: '2024-02-22 16:15:00', total_amount: 249.99 },
          { order_id: 105, customer_name: 'Emma Watson', order_date: '2024-02-28 11:30:00', total_amount: 97.0 },
          { order_id: 106, customer_name: 'Rohan Sharma', order_date: '2024-03-01 13:05:00', total_amount: 264.5 },
          { order_id: 107, customer_name: 'Sophia Miller', order_date: '2024-03-04 20:10:00', total_amount: 199.99 },
          { order_id: 108, customer_name: 'Yuki Tanaka', order_date: '2024-03-07 10:25:00', total_amount: 798.99 },
          { order_id: 109, customer_name: 'Mia Chen', order_date: '2024-03-12 17:50:00', total_amount: 135.0 },
          { order_id: 110, customer_name: 'Aarav Patel', order_date: '2024-03-15 14:15:00', total_amount: 129.5 },
          { order_id: 111, customer_name: 'Lucas Silva', order_date: '2024-03-18 19:30:00', total_amount: 299.94 },
          { order_id: 112, customer_name: 'Carlos Rodriguez', order_date: '2024-03-20 12:45:00', total_amount: 97.0 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-12',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 12,
    title: 'Finding Inactive Records with LEFT JOIN and IS NULL',
    category: 'Joins and Relationships',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Growth marketing wants to run a re-engagement campaign targeting registered customers who have never placed an order.',
    questionStatement:
      'Write a query using a `LEFT JOIN` between `customers` and `orders` to find all customers who have zero recorded orders. Return `customers.id`, `customers.name`, and `customers.email`, sorted by `customers.id` ascending.',
    starterCode: '-- Find customers with zero orders\nSELECT\n  c.id,\n  c.name,\n  c.email\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL\nORDER BY c.id ASC;',
    sqlSolution: 'SELECT c.id, c.name, c.email FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL ORDER BY c.id ASC;',
    referenceAnswer:
      '`LEFT JOIN` preserves all rows from the left table (`customers`). When a customer has no matching row in `orders`, the order columns populate with `NULL`. Filtering by `WHERE o.id IS NULL` isolates customers with no orders (Anti-Join pattern).',
    expectedConcepts: ['LEFT OUTER JOIN', 'Anti-Join pattern', 'NULL checking on foreign table'],
    hints: [
      'Join customers on the left with orders on the right.',
      'Filter where the order ID is NULL.',
    ],
    followUp: {
      question: 'How does an anti-join with LEFT JOIN ... IS NULL compare with NOT EXISTS in PostgreSQL?',
      expectedAnswer:
        'Modern query planners often optimize both into identical Hash Anti-Join plans. However, NOT EXISTS is generally preferred for readability and avoids unintended column evaluation.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Correct LEFT JOIN structure', 'Filters with o.id IS NULL', 'Returns empty array if all ordered'],
    },
    testCases: [
      {
        id: 'tc-t1-12',
        description: 'Verify customers with no orders (all 8 customers in test seed have orders, so returns 0 rows)',
        expectedRows: [],
      },
    ],
  },
  {
    id: 'sql-t1-13',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 13,
    title: 'Multi-Table Join: Order Items with Products and Customers',
    category: 'Joins and Relationships',
    questionType: 'executable',
    datasetId: 'ecommerce',
    realWorldScenario:
      'Customer support needs a consolidated view of line items purchased by customer "Aarav Patel".',
    questionStatement:
      'Write a query joining `orders`, `customers`, `order_items`, and `products` to list all products bought by `Aarav Patel`. Return `order_id`, `product_name` (as `name`), `quantity`, and `unit_price`, sorted by `order_id` ascending.',
    starterCode: '-- Multi-table join for Aarav Patel purchases\nSELECT\n  o.id AS order_id,\n  p.name AS product_name,\n  oi.quantity,\n  oi.unit_price\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id\nWHERE c.name = \'Aarav Patel\'\nORDER BY o.id ASC, p.name ASC;',
    sqlSolution: 'SELECT o.id AS order_id, p.name AS product_name, oi.quantity, oi.unit_price FROM orders o JOIN customers c ON o.customer_id = c.id JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE c.name = \'Aarav Patel\' ORDER BY o.id ASC, p.name ASC;',
    referenceAnswer:
      'Chains multiple `JOIN` clauses along foreign key paths: `customers` -> `orders` -> `order_items` -> `products`, filtered by `c.name = \'Aarav Patel\'`.',
    expectedConcepts: ['Chained relational joins', 'Entity-relationship traversal', 'Foreign key paths'],
    hints: [
      'Join orders to customers, then order_items to orders, then products to order_items.',
      'Filter where customer name is Aarav Patel.',
    ],
    followUp: {
      question: 'What is a Cartesian Product (Cross Join) and how does it happen accidentally in multi-table queries?',
      expectedAnswer:
        'A Cartesian product occurs when tables are combined without an ON join condition (or with comma syntax without a WHERE filter). The database multiplies every row in table A by every row in table B (N × M), causing severe performance degradation.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Proper 4-table join chain', 'Filters specifically for Aarav Patel', 'Accurate line-item details'],
    },
    testCases: [
      {
        id: 'tc-t1-13',
        description: 'Verify items purchased across Aarav Patel orders',
        expectedRows: [
          { order_id: 101, product_name: 'Mechanical Wireless Keyboard', quantity: 1, unit_price: 129.5 },
          { order_id: 101, product_name: 'Noise-Cancelling Headphones', quantity: 1, unit_price: 199.99 },
          { order_id: 103, product_name: 'Merino Wool Pullover', quantity: 1, unit_price: 89.0 },
          { order_id: 110, product_name: 'Mechanical Wireless Keyboard', quantity: 1, unit_price: 129.5 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-14',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 14,
    title: 'Loan Approval Rates and Risk Categorization',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'loan_management',
    realWorldScenario:
      'Risk managers at ApexFin NBFC need a summary of loan application statuses grouped by purpose.',
    questionStatement:
      'Write a query on `loan_applications` grouping by `purpose`, returning the `purpose`, `total_applications` (count of rows), and `total_amount_requested` (sum of requested_amount), ordered by `total_amount_requested` descending.',
    starterCode: '-- Group loan applications by purpose\nSELECT\n  purpose,\n  COUNT(*) AS total_applications,\n  SUM(requested_amount) AS total_amount_requested\nFROM loan_applications\nGROUP BY purpose\nORDER BY total_amount_requested DESC;',
    sqlSolution: 'SELECT purpose, COUNT(*) AS total_applications, SUM(requested_amount) AS total_amount_requested FROM loan_applications GROUP BY purpose ORDER BY total_amount_requested DESC;',
    referenceAnswer:
      'Summarizes loan volume and capital demand by grouping on `purpose` and aggregating with `COUNT(*)` and `SUM(requested_amount)`.',
    expectedConcepts: ['GROUP BY categorization', 'SUM financial totals', 'NBFC credit analytics'],
    hints: ['Group by purpose and sum the requested_amount column.'],
    followUp: {
      question: 'Why should financial figures always use numeric/decimal types rather than float/double in SQL?',
      expectedAnswer:
        'Floating-point types (FLOAT/REAL) use binary approximations (IEEE 754) that cause rounding errors (e.g., 0.1 + 0.2 = 0.30000000000000004). Financial ledgers require arbitrary-precision fixed-point types (NUMERIC/DECIMAL) to guarantee exact balance calculations.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Accurate group totals', 'Sorted by requested amount descending'],
    },
    testCases: [
      {
        id: 'tc-t1-14',
        description: 'Verify loan applications aggregated by purpose',
        expectedRows: [
          { purpose: 'HOME_RENOVATION', total_applications: 2, total_amount_requested: 1300000.0 },
          { purpose: 'BUSINESS', total_applications: 1, total_amount_requested: 1200000.0 },
          { purpose: 'PERSONAL', total_applications: 3, total_amount_requested: 950000.0 },
          { purpose: 'AUTO', total_applications: 2, total_amount_requested: 550000.0 },
        ],
      },
    ],
  },
  {
    id: 'sql-t1-15',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 15,
    title: 'Conditional Aggregation with CASE WHEN',
    category: 'Filtering, Sorting, and Aggregation',
    questionType: 'executable',
    datasetId: 'loan_management',
    realWorldScenario:
      'Credit risk officers need to count how many loans are in good standing versus overdue across EMI installments.',
    questionStatement:
      'Write a query on `emi_schedule` to calculate the total count of installments (`total_emis`), count of paid installments (`paid_count`), and count of overdue installments (`overdue_count`) using `CASE WHEN`.',
    starterCode: '-- Conditional aggregation on EMI installments\nSELECT\n  COUNT(*) AS total_emis,\n  SUM(CASE WHEN status = \'PAID\' THEN 1 ELSE 0 END) AS paid_count,\n  SUM(CASE WHEN status = \'OVERDUE\' THEN 1 ELSE 0 END) AS overdue_count\nFROM emi_schedule;',
    sqlSolution: 'SELECT COUNT(*) AS total_emis, SUM(CASE WHEN status = \'PAID\' THEN 1 ELSE 0 END) AS paid_count, SUM(CASE WHEN status = \'OVERDUE\' THEN 1 ELSE 0 END) AS overdue_count FROM emi_schedule;',
    referenceAnswer:
      '`SUM(CASE WHEN condition THEN 1 ELSE 0 END)` or `COUNT(CASE WHEN condition THEN 1 END)` conditionally accumulates counts without needing multiple queries.',
    expectedConcepts: ['CASE WHEN statement', 'Conditional aggregation', 'Pivot logic'],
    hints: ['In a CASE statement, evaluate WHEN status = \'PAID\' THEN 1 ELSE 0 END, and wrap with SUM.'],
    followUp: {
      question: 'How does PostgreSQL\'s native FILTER (WHERE condition) clause simplify conditional aggregation?',
      expectedAnswer:
        'PostgreSQL supports standard SQL:2003 aggregate filters: COUNT(*) FILTER (WHERE status = \'PAID\'). This is cleaner, faster, and avoids the verbose CASE WHEN expression.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Correct CASE WHEN structure', 'Accurate paid and overdue tallies'],
    },
    testCases: [
      {
        id: 'tc-t1-15',
        description: 'Verify conditional EMI status breakdown',
        expectedRows: [
          { total_emis: 17, paid_count: 12, overdue_count: 3 },
        ],
      },
    ],
  },
  // Conceptual & Fundamentals Questions (16 - 30)
  {
    id: 'sql-t1-16',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 16,
    title: 'Relational Database Keys: Primary Keys vs. Foreign Keys',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'During an engineering onboarding session, an associate engineer asks why foreign keys are defined in the schema instead of managing relations purely in application code.',
    questionStatement:
      'Explain the core differences between a Primary Key and a Foreign Key. What database guarantees do they enforce, and what is Referential Integrity?',
    referenceAnswer:
      'A Primary Key uniquely identifies each row in a table. It must contain unique, non-null values (enforcing entity integrity). A Foreign Key is a column (or set of columns) in one table that references the Primary Key of another table. It enforces Referential Integrity: the database engine guarantees that a child row cannot reference a non-existent parent row, preventing orphaned data. The database also governs cascading behaviors on delete or update (e.g. ON DELETE CASCADE or ON DELETE RESTRICT).',
    expectedConcepts: [
      'Primary Key uniqueness and NOT NULL constraint',
      'Foreign Key child-to-parent reference',
      'Referential Integrity',
      'Prevention of orphaned records',
    ],
    hints: [
      'Contrast uniqueness within a table versus links across tables.',
      'Explain what happens if someone tries to delete a parent record that has children.',
    ],
    followUp: {
      question: 'What is the risk of disabling foreign key constraints in high-throughput microservices?',
      expectedAnswer:
        'Disabling foreign keys risks data corruption and orphaned records if network drops or bugs occur between microservice writes. While it reduces write overhead, the burden of maintaining referential integrity shifts entirely to application code.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines PK constraints', 'Defines FK constraints', 'Explains Referential Integrity'],
    },
  },
  {
    id: 'sql-t1-17',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 17,
    title: 'First Normal Form (1NF) Fundamentals',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'A legacy customer table stores phone numbers as a comma-separated string: "555-1234, 555-5678".',
    questionStatement:
      'What rule does this design violate in relational database normalization? Explain First Normal Form (1NF) and how to refactor this design.',
    referenceAnswer:
      'This violates First Normal Form (1NF). 1NF requires: 1. Every column must contain atomic (indivisible) values—no repeating groups, arrays, or comma-delimited strings. 2. Each record must have a unique identifier (Primary Key). To refactor: Create a dedicated child table `customer_phones (id, customer_id, phone_number, phone_type)`, establishing a 1-to-many relationship where each phone number occupies its own row with a foreign key referencing `customers.id`.',
    expectedConcepts: [
      'Atomic values',
      'No repeating groups or comma-separated lists',
      '1-to-many child table refactoring',
    ],
    hints: [
      'Think about how hard it is to search for a specific phone number in a comma-separated string.',
      'How would you enforce phone number formatting or indexing?',
    ],
    followUp: {
      question: 'When might storing non-atomic data like a JSON array be acceptable in modern PostgreSQL?',
      expectedAnswer:
        'PostgreSQL JSONB is acceptable for semi-structured data, dynamic third-party payloads, or sparse attributes that vary widely per row and do not require relational foreign key constraints.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains atomicity in 1NF', 'Identifies the problem with comma-separated strings', 'Provides clean child-table schema'],
    },
  },
  {
    id: 'sql-t1-18',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 18,
    title: 'Second Normal Form (2NF) and Composite Keys',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'An order items table has a composite primary key (order_id, product_id). It also stores product_name and product_category in the same row.',
    questionStatement:
      'Why does storing product_name in this composite-key table violate Second Normal Form (2NF)? Explain 2NF and partial dependencies.',
    referenceAnswer:
      'Second Normal Form (2NF) requires a table to be in 1NF and have no partial dependencies: every non-key column must depend on the WHOLE primary key, not just a part of it. In `order_items (order_id, product_id, quantity, product_name)`, `product_name` depends only on `product_id`, not on `order_id`. Storing it here introduces update anomalies: if a product is renamed, every past order item must be updated. The solution is normalizing product metadata into a separate `products` table.',
    expectedConcepts: [
      'Must be in 1NF',
      'No partial dependencies',
      'Non-key attributes must depend on the whole composite primary key',
      'Update and deletion anomalies',
    ],
    hints: ['Ask yourself: Does product_name change when order_id changes?'],
    followUp: {
      question: 'Why do data warehouses deliberately violate 2NF and 3NF through denormalization?',
      expectedAnswer:
        'Data warehouses use star/snowflake schemas with denormalized dimensional tables to eliminate expensive multi-table joins during analytical aggregation queries, trading storage redundancy for read speed.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines 2NF', 'Explains partial dependency', 'Identifies anomalies'],
    },
  },
  {
    id: 'sql-t1-19',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 19,
    title: 'Third Normal Form (3NF) and Transitive Dependencies',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'An employee table contains (emp_id, emp_name, dept_id, dept_manager_name).',
    questionStatement:
      'Explain why storing dept_manager_name violates Third Normal Form (3NF). What is a transitive dependency?',
    referenceAnswer:
      'A table is in 3NF if it is in 2NF and contains no transitive dependencies: non-key attributes must depend directly on the primary key, and nothing else (the classic rule: "Every attribute must depend on the key, the whole key, and nothing but the key, so help me Codd"). Here, `emp_id -> dept_id` and `dept_id -> dept_manager_name`. Thus, `dept_manager_name` depends on `emp_id` transitively via `dept_id`. If the department manager changes, multiple employee rows must be modified. Normalizing into a `departments` table eliminates the anomaly.',
    expectedConcepts: [
      'Must be in 2NF',
      'No transitive dependencies',
      'Non-key column depending on another non-key column',
      'Normalization into departments table',
    ],
    hints: ['Who does the manager belong to: the employee directly, or the department?'],
    followUp: {
      question: 'What is Boyce-Codd Normal Form (BCNF) and when does it diverge from 3NF?',
      expectedAnswer:
        'BCNF is a stricter version of 3NF addressing tables with multiple overlapping composite candidate keys. In BCNF, every determinant (attribute on which another attribute depends) must be a superkey.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines 3NF', 'Explains transitive dependency', 'Provides resolution'],
    },
  },
  {
    id: 'sql-t1-20',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 20,
    title: 'SQL Data Types: VARCHAR, CHAR, and TEXT in PostgreSQL',
    category: 'PostgreSQL Data Types',
    questionType: 'conceptual',
    realWorldScenario:
      'A developer is designing a table and is unsure whether to use CHAR(50), VARCHAR(50), or TEXT for storing user bios.',
    questionStatement:
      'Compare CHAR(n), VARCHAR(n), and TEXT in PostgreSQL. Are there performance differences between VARCHAR and TEXT in PostgreSQL?',
    referenceAnswer:
      '1. CHAR(n) is fixed-length, right-padded with spaces to length n. It wastes storage and requires trim operations. 2. VARCHAR(n) is variable-length with a maximum length check of n characters. 3. TEXT is variable-length with unlimited storage (up to 1GB). In PostgreSQL, there is ZERO performance difference between VARCHAR and TEXT. Under the hood, both use the exact same `varlena` storage structure. The only difference is that VARCHAR(n) incurs a slight CPU check to enforce length limit n.',
    expectedConcepts: [
      'Fixed-length vs variable-length',
      'Space-padding in CHAR',
      'PostgreSQL varlena storage equality between VARCHAR and TEXT',
    ],
    hints: ['In PostgreSQL, does VARCHAR without a length limit differ from TEXT?'],
    followUp: {
      question: 'Why should CHAR(n) be avoided in almost all modern PostgreSQL schemas?',
      expectedAnswer:
        'CHAR(n) pads trailing spaces which must be stripped in comparisons, causes unexpected string length behaviors, and provides zero performance or storage benefits over VARCHAR or TEXT in PostgreSQL.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Compares the three types', 'Explains PostgreSQL internal storage equality', 'Mentions length check overhead'],
    },
  },
  {
    id: 'sql-t1-21',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 21,
    title: 'Date and Time Types: TIMESTAMP vs. TIMESTAMPTZ',
    category: 'PostgreSQL Data Types',
    questionType: 'conceptual',
    realWorldScenario:
      'An e-commerce store operates across New York, London, and Tokyo. Order timestamps are becoming desynchronized during daylight saving transitions.',
    questionStatement:
      'What is the difference between TIMESTAMP (without time zone) and TIMESTAMPTZ (with time zone) in PostgreSQL? Which should you use for audit and transaction records?',
    referenceAnswer:
      'In PostgreSQL, TIMESTAMPTZ is the gold standard for transaction records. TIMESTAMPTZ does NOT store a time zone string; rather, it converts any input time to UTC and stores it as an 8-byte UTC integer. When queried, it automatically converts UTC to the client session\'s configured time zone. In contrast, TIMESTAMP (without time zone) blindly stores the literal digits provided without context, leading to catastrophic timezone offsets and DST errors in distributed systems.',
    expectedConcepts: [
      'TIMESTAMPTZ converts to and stores UTC internally',
      'Client session timezone conversion',
      'TIMESTAMP without time zone lacks timezone awareness',
      'Production best practice for audit logs',
    ],
    hints: ['Does TIMESTAMPTZ store a timezone name or convert to UTC?'],
    followUp: {
      question: 'How do you set the session time zone in PostgreSQL for testing?',
      expectedAnswer:
        'Execute SET TIME ZONE \'UTC\'; or SET TIME ZONE \'America/New_York\'; which alters display formatting for TIMESTAMPTZ columns in the current session.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Accurately explains UTC storage in TIMESTAMPTZ', 'Explains pitfalls of TIMESTAMP without time zone', 'Recommends TIMESTAMPTZ for production'],
    },
  },
  {
    id: 'sql-t1-22',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 22,
    title: 'ACID Properties in Relational Databases',
    category: 'Transactions and ACID',
    questionType: 'conceptual',
    realWorldScenario:
      'A user is transferring $100 from Account A to Account B. A power outage occurs after Account A is debited but before Account B is credited.',
    questionStatement:
      'Explain the ACID properties (Atomicity, Consistency, Isolation, Durability) in relational databases. How does ACID protect the bank transfer scenario?',
    referenceAnswer:
      'ACID guarantees database reliability: 1. Atomicity: All operations in a transaction succeed or all roll back ("all-or-nothing"). The transfer rollback prevents money from disappearing. 2. Consistency: Transactions transition the database from one valid state to another, respecting all constraints (e.g. non-negative balance). 3. Isolation: Concurrent transactions execute without interfering with one another. 4. Durability: Once committed, changes survive crashes or power failures (persisted to Write-Ahead Log / disk).',
    expectedConcepts: [
      'Atomicity (All or nothing)',
      'Consistency (Constraints preserved)',
      'Isolation (Concurrency control)',
      'Durability (Persistence via WAL)',
    ],
    hints: ['Map each letter of ACID to how the money transfer is handled.'],
    followUp: {
      question: 'Which PostgreSQL mechanism guarantees Durability before dirty buffers are written to data files?',
      expectedAnswer:
        'The Write-Ahead Log (WAL). PostgreSQL writes transaction changes sequentially to the WAL and flushes it to disk (fsync) before reporting success to the client.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Accurately defines all 4 letters', 'Applies directly to bank transfer failure scenario'],
    },
  },
  {
    id: 'sql-t1-23',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 23,
    title: 'Transactions with BEGIN, COMMIT, and ROLLBACK',
    category: 'Transactions and ACID',
    questionType: 'conceptual',
    realWorldScenario:
      'An order checkout process must deduct inventory and create an order simultaneously.',
    questionStatement:
      'Write the SQL structure for a transaction that updates inventory and inserts an order. What happens if an error occurs halfway through?',
    referenceAnswer:
      '```sql\nBEGIN;\nUPDATE inventory SET quantity_on_hand = quantity_on_hand - 1 WHERE product_id = 1;\nINSERT INTO orders (id, customer_id, total_amount) VALUES (113, 2, 199.99);\nCOMMIT;\n```\nIf an error occurs (such as a constraint failure or connection loss), the application issues `ROLLBACK;` (or the database automatically aborts the transaction). Any partial updates made since `BEGIN` are undone, leaving the database in its original clean state.',
    expectedConcepts: [
      'BEGIN / START TRANSACTION',
      'COMMIT commits changes atomically',
      'ROLLBACK restores previous state',
    ],
    hints: ['Wrap multi-statement writes inside BEGIN and COMMIT blocks.'],
    followUp: {
      question: 'In PostgreSQL, what happens if a command fails inside a transaction block?',
      expectedAnswer:
        'PostgreSQL marks the entire transaction as aborted. Any subsequent SQL commands in the block return "ERROR: current transaction is aborted, commands ignored until end of transaction block", until ROLLBACK (or rollback to savepoint) is issued.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Provides valid transaction SQL syntax', 'Explains rollback behavior'],
    },
  },
  {
    id: 'sql-t1-24',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 24,
    title: 'B-Tree Indexing Fundamentals',
    category: 'Indexes and Query Planning',
    questionType: 'conceptual',
    realWorldScenario:
      'A query `SELECT * FROM users WHERE email = \'test@example.com\';` is taking 800ms on a table with 2 million users.',
    questionStatement:
      'Explain what a sequential scan (table scan) is, how a B-Tree index accelerates search from O(N) to O(log N), and the write overhead of indexes.',
    referenceAnswer:
      'Without an index, the database performs a sequential scan (Seq Scan), reading every block from disk and checking all 2M rows (O(N) complexity). A B-Tree index creates a balanced hierarchical tree of sorted values and block pointers. Finding a value requires traversing from root to leaf in O(log N) steps (typically 3–4 I/O reads). The trade-off: every INSERT, UPDATE, and DELETE must also update the B-Tree structure and write to disk, adding write latency and consuming storage.',
    expectedConcepts: [
      'Sequential Scan O(N)',
      'B-Tree hierarchical lookup O(log N)',
      'Pointer to disk tuple (TID)',
      'Write overhead on INSERT/UPDATE/DELETE',
    ],
    hints: ['Compare looking up a phone book sequentially vs binary search index.'],
    followUp: {
      question: 'Why does creating an index on a boolean column (e.g. is_active) often provide little to no benefit?',
      expectedAnswer:
        'Low selectivity. When a column has only two values (true/false) and one value accounts for 50%+ of rows, the planner finds it cheaper to scan the table sequentially than jumping between the index and data pages.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains Seq Scan vs Index Scan', 'Mentions O(log N) tree traversal', 'Mentions write overhead'],
    },
  },
  {
    id: 'sql-t1-25',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 25,
    title: 'Database Constraints: NOT NULL, UNIQUE, and CHECK',
    category: 'Database Design and Normalization',
    questionType: 'conceptual',
    realWorldScenario:
      'A loan management table needs to ensure that interest rates are always positive and PAN card numbers are never duplicated.',
    questionStatement:
      'Describe the role of NOT NULL, UNIQUE, and CHECK constraints in PostgreSQL. Provide an example table DDL showcasing all three.',
    referenceAnswer:
      '```sql\nCREATE TABLE loan_products (\n  id SERIAL PRIMARY KEY,\n  product_code VARCHAR(20) NOT NULL UNIQUE,\n  interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate > 0 AND interest_rate < 50),\n  min_credit_score INT CHECK (min_credit_score >= 300 AND min_credit_score <= 900)\n);\n```\n- `NOT NULL` prevents missing values.\n- `UNIQUE` prevents duplicates (PostgreSQL creates an underlying B-Tree index to enforce uniqueness).\n- `CHECK` enforces arbitrary boolean domain rules on column values.',
    expectedConcepts: [
      'NOT NULL data integrity',
      'UNIQUE constraint and implicit B-Tree',
      'CHECK constraint boolean expression',
    ],
    hints: ['CHECK constraints validate conditions before writing the row.'],
    followUp: {
      question: 'How do UNIQUE constraints handle NULL values in standard SQL vs PostgreSQL?',
      expectedAnswer:
        'In SQL standard and PostgreSQL by default, NULL != NULL. Thus, multiple rows with NULL in a UNIQUE column are permitted. PostgreSQL 15 introduced UNIQUE NULLS NOT DISTINCT to treat NULLs as equal duplicates.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines NOT NULL, UNIQUE, CHECK', 'Provides clear DDL example'],
    },
  },
  {
    id: 'sql-t1-26',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 26,
    title: 'SQL Injection Prevention: Parameterized Queries vs String Concatenation',
    category: 'Database Security and Permissions',
    questionType: 'conceptual',
    realWorldScenario:
      'A junior developer writes: `const query = "SELECT * FROM users WHERE email = \'" + req.body.email + "\'";`',
    questionStatement:
      'Why is this code vulnerable to SQL Injection? What payload could an attacker submit, and how do Parameterized Queries (Prepared Statements) prevent this?',
    referenceAnswer:
      'String concatenation mixes untrusted user input directly with SQL command syntax. An attacker can submit: `\' OR \'1\'=\'1\' --`. The query becomes `SELECT * FROM users WHERE email = \'\' OR \'1\'=\'1\' --\';`, bypassing authentication and leaking all rows. Parameterized queries (e.g. `SELECT * FROM users WHERE email = $1;`) send the query structure and parameters in separate protocol messages. The database engine treats `$1` strictly as literal data, making it syntactically impossible for input to alter query execution structure.',
    expectedConcepts: [
      'SQL Injection vulnerability through string concatenation',
      'Attack payload demonstration',
      'Separation of code and data in Prepared Statements ($1 / ?)',
    ],
    hints: ['Show how an attacker closes the quote and injects boolean tautology.'],
    followUp: {
      question: 'Can ORMs like Prisma or TypeORM still be vulnerable to SQL injection?',
      expectedAnswer:
        'Yes, if developers bypass the ORM\'s query builder and use raw unparameterized query methods like prisma.$queryRawUnsafe(`SELECT ... ${userInput}`).',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains injection mechanism', 'Demonstrates sample attack', 'Explains parameterization solution'],
    },
  },
  {
    id: 'sql-t1-27',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 27,
    title: 'Understanding Database Views',
    category: 'SQL Fundamentals',
    questionType: 'conceptual',
    realWorldScenario:
      'Reporting analysts frequently write a complex 5-table join to calculate customer order totals.',
    questionStatement:
      'What is a database VIEW in SQL? What advantages does it offer for abstraction and security, and does a standard VIEW consume storage?',
    referenceAnswer:
      'A VIEW is a saved named query (`CREATE VIEW customer_order_summary AS SELECT ...`). 1. It acts as a virtual table: querying the view executes the underlying query on the fly. 2. A standard view does NOT store data on disk and consumes zero row storage. 3. Advantages: Encapsulates complex joins into a clean interface; acts as a security boundary by exposing only allowed columns/rows to specific roles without granting direct table access.',
    expectedConcepts: [
      'Virtual table definition',
      'Zero storage overhead for standard views',
      'Security boundary and simplification of complex joins',
    ],
    hints: ['Contrast a view with a physical table.'],
    followUp: {
      question: 'What is the difference between a standard VIEW and a MATERIALIZED VIEW in PostgreSQL?',
      expectedAnswer:
        'A standard view executes its query dynamically on every call and stores no data. A MATERIALIZED VIEW executes the query once and physically writes the result set to disk, enabling fast reads on expensive aggregations. It must be updated periodically with REFRESH MATERIALIZED VIEW.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines VIEW correctly', 'Notes zero data storage', 'Explains security/abstraction benefits'],
    },
  },
  {
    id: 'sql-t1-28',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 28,
    title: 'PostgreSQL Boolean Logic: COALESCE and NULLIF',
    category: 'SQL Fundamentals',
    questionType: 'conceptual',
    realWorldScenario:
      'An invoice PDF generator displays "null" or blanks when a customer does not have a registered billing contact name.',
    questionStatement:
      'Explain how the `COALESCE` function works in SQL. Provide an example showing how to replace NULL values with a default fallback string.',
    referenceAnswer:
      '`COALESCE(arg1, arg2, ... argN)` evaluates its arguments in order and returns the first non-null value. If all arguments are null, it returns null.\nExample:\n```sql\nSELECT id, COALESCE(billing_contact, name, \'Valued Customer\') AS contact_display\nFROM customers;\n```\nIf `billing_contact` is null, it checks `name`; if `name` is also null, it returns `\'Valued Customer\'`.',
    expectedConcepts: [
      'COALESCE returns first non-null argument',
      'Short-circuit evaluation',
      'Default fallback presentation',
    ],
    hints: ['COALESCE takes multiple arguments and stops at the first non-null.'],
    followUp: {
      question: 'What does the NULLIF(a, b) function do and how is it used to prevent division by zero?',
      expectedAnswer:
        'NULLIF(a, b) returns NULL if a = b; otherwise it returns a. To prevent division by zero: total / NULLIF(count, 0). If count is 0, NULLIF returns NULL, and any number divided by NULL safely returns NULL instead of throwing a runtime error.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains COALESCE behavior', 'Provides clear code example'],
    },
  },
  {
    id: 'sql-t1-29',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 29,
    title: 'Row Insertion and Returning Generated IDs with RETURNING',
    category: 'PostgreSQL Data Types',
    questionType: 'conceptual',
    realWorldScenario:
      'An Express.js API creates a new customer and immediately needs the newly generated auto-incrementing ID to create an initial order.',
    questionStatement:
      'How does the PostgreSQL-specific `RETURNING` clause work with `INSERT`, `UPDATE`, and `DELETE`? Why is it superior to executing a secondary `SELECT LASTVAL()` query?',
    referenceAnswer:
      '```sql\nINSERT INTO customers (name, email) VALUES (\'John Doe\', \'john@example.com\')\nRETURNING id, created_at;\n```\nThe `RETURNING` clause instructs PostgreSQL to return the modified or inserted row values directly in the response of the write command. Advantages over `SELECT LASTVAL()`: 1. Eliminates an extra network round-trip. 2. Completely concurrency-safe—guaranteed to return the ID generated by THAT specific statement, preventing race conditions under high concurrent traffic.',
    expectedConcepts: [
      'RETURNING clause syntax',
      'Eliminates extra network round-trip',
      'Concurrency safety over LASTVAL()',
    ],
    hints: ['Append RETURNING id at the end of an INSERT statement.'],
    followUp: {
      question: 'Can RETURNING be used with UPDATE and DELETE statements in PostgreSQL?',
      expectedAnswer:
        'Yes. UPDATE ... RETURNING returns the newly modified rows, and DELETE ... RETURNING returns the deleted rows, which is useful for audit logging or optimistic UI updates without extra queries.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Explains RETURNING syntax', 'Explains concurrency benefit', 'Shows practical usage'],
    },
  },
  {
    id: 'sql-t1-30',
    tier: 'tier-1',
    difficultyLabel: 'Beginner',
    order: 30,
    title: 'Composite and Foreign Key Indexing Basics',
    category: 'Indexes and Query Planning',
    questionType: 'conceptual',
    realWorldScenario:
      'A query filters on both tenant organization and event creation date: `WHERE organization_id = 101 AND created_at >= \'2024-03-01\'`.',
    questionStatement:
      'What is a Composite Index (Multi-Column Index)? In what order should columns be placed in a composite index for this query?',
    referenceAnswer:
      'A Composite Index is a single B-Tree index built on two or more columns (`CREATE INDEX idx_events_org_date ON events (organization_id, created_at);`). Column order matters: the index is sorted primarily by the first column, and secondarily by the second column. The best practice rule: place equality columns first (`organization_id`), followed by range/inequality columns (`created_at`). This allows PostgreSQL to jump directly to the organization\'s slice of the tree and scan only the date range.',
    expectedConcepts: [
      'Composite index concept',
      'Column ordering rule (Equality first, range second)',
      'Leftmost prefix matching',
    ],
    hints: ['Think about telephone directory sorted by Last Name, then First Name.'],
    followUp: {
      question: 'Can the index ON events (organization_id, created_at) be used by a query filtering ONLY on created_at?',
      expectedAnswer:
        'Generally no (or only via an inefficient Index Skip Scan). B-Trees require the leftmost prefix. Searching only on created_at without organization_id is like searching a phone book by first name without knowing the last name.',
    },
    rubric: {
      correctnessWeight: 40,
      semanticRelationalWeight: 30,
      performanceWeight: 15,
      edgeCaseWeight: 15,
      criteria: ['Defines composite index', 'Correctly places equality column first', 'Explains B-Tree traversal rationale'],
    },
  },
];

export const TIER1_BEGINNER_QUESTIONS = tier1BeginnerQuestions;
