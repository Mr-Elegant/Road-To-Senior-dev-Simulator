import { SqlDataset } from '@/types/sqlTrack';

export const ecommerceDataset: SqlDataset = {
  id: 'ecommerce',
  name: 'OmniStore E-Commerce',
  tagline: 'High-Volume Global Retail Transaction Engine',
  description:
    'Real-world online retail relational schema modeling customers, product catalogs, multi-item orders, payment transactions, multi-warehouse inventory, and return refunds.',
  tables: [
    {
      name: 'customers',
      description: 'Registered retail buyers with location and contact metadata',
      sampleRowCount: 8,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'email', type: 'VARCHAR(120)' },
        { name: 'city', type: 'VARCHAR(60)' },
        { name: 'country', type: 'VARCHAR(60)' },
        { name: 'created_at', type: 'TIMESTAMP' },
      ],
    },
    {
      name: 'products',
      description: 'Catalog items with pricing, category tags, and active status',
      sampleRowCount: 10,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'sku', type: 'VARCHAR(30)' },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'category', type: 'VARCHAR(50)' },
        { name: 'price', type: 'DECIMAL(10,2)' },
        { name: 'cost_price', type: 'DECIMAL(10,2)' },
        { name: 'is_active', type: 'BOOLEAN' },
      ],
    },
    {
      name: 'orders',
      description: 'Customer purchase headers with lifecycle status and totals',
      sampleRowCount: 12,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'customer_id', type: 'INT', isForeignKey: true, references: 'customers.id' },
        { name: 'order_date', type: 'TIMESTAMP' },
        { name: 'status', type: 'VARCHAR(30)' }, // 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'
        { name: 'total_amount', type: 'DECIMAL(10,2)' },
      ],
    },
    {
      name: 'order_items',
      description: 'Line items linking orders to purchased quantities and prices',
      sampleRowCount: 20,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'order_id', type: 'INT', isForeignKey: true, references: 'orders.id' },
        { name: 'product_id', type: 'INT', isForeignKey: true, references: 'products.id' },
        { name: 'quantity', type: 'INT' },
        { name: 'unit_price', type: 'DECIMAL(10,2)' },
        { name: 'discount', type: 'DECIMAL(10,2)' },
      ],
    },
    {
      name: 'payments',
      description: 'Gateway payment attempts and transaction states',
      sampleRowCount: 12,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'order_id', type: 'INT', isForeignKey: true, references: 'orders.id' },
        { name: 'payment_method', type: 'VARCHAR(40)' }, // 'CREDIT_CARD', 'UPI', 'PAYPAL'
        { name: 'status', type: 'VARCHAR(20)' }, // 'SUCCESS', 'FAILED', 'REFUNDED'
        { name: 'amount', type: 'DECIMAL(10,2)' },
        { name: 'created_at', type: 'TIMESTAMP' },
      ],
    },
    {
      name: 'inventory',
      description: 'Warehouse on-hand quantities and active cart reservations',
      sampleRowCount: 10,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'product_id', type: 'INT', isForeignKey: true, references: 'products.id' },
        { name: 'warehouse_location', type: 'VARCHAR(50)' },
        { name: 'quantity_on_hand', type: 'INT' },
        { name: 'reserved_quantity', type: 'INT' },
      ],
    },
    {
      name: 'refunds',
      description: 'Processed returns and refunded values',
      sampleRowCount: 4,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true },
        { name: 'order_id', type: 'INT', isForeignKey: true, references: 'orders.id' },
        { name: 'payment_id', type: 'INT', isForeignKey: true, references: 'payments.id' },
        { name: 'refund_amount', type: 'DECIMAL(10,2)' },
        { name: 'reason', type: 'VARCHAR(100)' },
        { name: 'created_at', type: 'TIMESTAMP' },
      ],
    },
  ],
  schemaSql: `
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(120),
  city VARCHAR(60),
  country VARCHAR(60),
  created_at VARCHAR(30)
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  sku VARCHAR(30),
  name VARCHAR(100),
  category VARCHAR(50),
  price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  is_active BOOLEAN
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  order_date VARCHAR(30),
  status VARCHAR(30),
  total_amount DECIMAL(10,2)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  unit_price DECIMAL(10,2),
  discount DECIMAL(10,2)
);

CREATE TABLE payments (
  id INT PRIMARY KEY,
  order_id INT,
  payment_method VARCHAR(40),
  status VARCHAR(20),
  amount DECIMAL(10,2),
  created_at VARCHAR(30)
);

CREATE TABLE inventory (
  id INT PRIMARY KEY,
  product_id INT,
  warehouse_location VARCHAR(50),
  quantity_on_hand INT,
  reserved_quantity INT
);

CREATE TABLE refunds (
  id INT PRIMARY KEY,
  order_id INT,
  payment_id INT,
  refund_amount DECIMAL(10,2),
  reason VARCHAR(100),
  created_at VARCHAR(30)
);
  `.trim(),
  seedSql: `
INSERT INTO customers VALUES (1, 'Aarav Patel', 'aarav.patel@example.com', 'Bengaluru', 'India', '2024-01-10 10:00:00');
INSERT INTO customers VALUES (2, 'Sophia Miller', 'sophia.m@example.com', 'San Francisco', 'USA', '2024-01-15 14:30:00');
INSERT INTO customers VALUES (3, 'Carlos Rodriguez', 'carlos.r@example.com', 'Madrid', 'Spain', '2024-01-20 09:15:00');
INSERT INTO customers VALUES (4, 'Emma Watson', 'emma.w@example.com', 'London', 'UK', '2024-02-01 11:20:00');
INSERT INTO customers VALUES (5, 'Rohan Sharma', 'rohan.s@example.com', 'Mumbai', 'India', '2024-02-12 16:45:00');
INSERT INTO customers VALUES (6, 'Yuki Tanaka', 'yuki.t@example.com', 'Tokyo', 'Japan', '2024-02-25 12:00:00');
INSERT INTO customers VALUES (7, 'Mia Chen', 'mia.c@example.com', 'Singapore', 'Singapore', '2024-03-05 08:30:00');
INSERT INTO customers VALUES (8, 'Lucas Silva', 'lucas.s@example.com', 'Sao Paulo', 'Brazil', '2024-03-10 15:10:00');

INSERT INTO products VALUES (1, 'TECH-001', 'Noise-Cancelling Headphones', 'Electronics', 199.99, 95.00, true);
INSERT INTO products VALUES (2, 'TECH-002', 'Mechanical Wireless Keyboard', 'Electronics', 129.50, 60.00, true);
INSERT INTO products VALUES (3, 'TECH-003', 'Ultra-Wide 4K Gaming Monitor', 'Electronics', 549.00, 310.00, true);
INSERT INTO products VALUES (4, 'FASH-001', 'Merino Wool Pullover', 'Apparel', 89.00, 32.00, true);
INSERT INTO products VALUES (5, 'FASH-002', 'Waterproof Trail Running Shoes', 'Apparel', 135.00, 55.00, true);
INSERT INTO products VALUES (6, 'HOME-001', 'Smart Induction Espresso Machine', 'Home & Kitchen', 249.99, 120.00, true);
INSERT INTO products VALUES (7, 'HOME-002', 'Ergonomic Standing Desk Mat', 'Home & Kitchen', 49.95, 18.00, true);
INSERT INTO products VALUES (8, 'BOOK-001', 'Designing Data-Intensive Applications', 'Books', 45.00, 22.00, true);
INSERT INTO products VALUES (9, 'BOOK-002', 'Database Internals in Practice', 'Books', 52.00, 26.00, true);
INSERT INTO products VALUES (10, 'TECH-004', 'Discontinued USB Hub', 'Electronics', 25.00, 10.00, false);

INSERT INTO orders VALUES (101, 1, '2024-02-10 14:00:00', 'DELIVERED', 329.49);
INSERT INTO orders VALUES (102, 2, '2024-02-12 18:20:00', 'DELIVERED', 549.00);
INSERT INTO orders VALUES (103, 1, '2024-02-18 09:40:00', 'DELIVERED', 89.00);
INSERT INTO orders VALUES (104, 3, '2024-02-22 16:15:00', 'DELIVERED', 249.99);
INSERT INTO orders VALUES (105, 4, '2024-02-28 11:30:00', 'PAID', 97.00);
INSERT INTO orders VALUES (106, 5, '2024-03-01 13:05:00', 'DELIVERED', 264.50);
INSERT INTO orders VALUES (107, 2, '2024-03-04 20:10:00', 'PAID', 199.99);
INSERT INTO orders VALUES (108, 6, '2024-03-07 10:25:00', 'SHIPPED', 798.99);
INSERT INTO orders VALUES (109, 7, '2024-03-12 17:50:00', 'PENDING', 135.00);
INSERT INTO orders VALUES (110, 1, '2024-03-15 14:15:00', 'CANCELLED', 129.50);
INSERT INTO orders VALUES (111, 8, '2024-03-18 19:30:00', 'DELIVERED', 299.94);
INSERT INTO orders VALUES (112, 3, '2024-03-20 12:45:00', 'DELIVERED', 97.00);

INSERT INTO order_items VALUES (1, 101, 1, 1, 199.99, 0.00);
INSERT INTO order_items VALUES (2, 101, 2, 1, 129.50, 0.00);
INSERT INTO order_items VALUES (3, 102, 3, 1, 549.00, 0.00);
INSERT INTO order_items VALUES (4, 103, 4, 1, 89.00, 0.00);
INSERT INTO order_items VALUES (5, 104, 6, 1, 249.99, 0.00);
INSERT INTO order_items VALUES (6, 105, 8, 1, 45.00, 0.00);
INSERT INTO order_items VALUES (7, 105, 9, 1, 52.00, 0.00);
INSERT INTO order_items VALUES (8, 106, 2, 1, 129.50, 0.00);
INSERT INTO order_items VALUES (9, 106, 5, 1, 135.00, 0.00);
INSERT INTO order_items VALUES (10, 107, 1, 1, 199.99, 0.00);
INSERT INTO order_items VALUES (11, 108, 3, 1, 549.00, 0.00);
INSERT INTO order_items VALUES (12, 108, 6, 1, 249.99, 0.00);
INSERT INTO order_items VALUES (13, 109, 5, 1, 135.00, 0.00);
INSERT INTO order_items VALUES (14, 110, 2, 1, 129.50, 0.00);
INSERT INTO order_items VALUES (15, 111, 7, 2, 49.95, 0.00);
INSERT INTO order_items VALUES (16, 111, 1, 1, 199.99, 0.00);
INSERT INTO order_items VALUES (17, 112, 8, 1, 45.00, 0.00);
INSERT INTO order_items VALUES (18, 112, 9, 1, 52.00, 0.00);

INSERT INTO payments VALUES (1, 101, 'CREDIT_CARD', 'SUCCESS', 329.49, '2024-02-10 14:02:00');
INSERT INTO payments VALUES (2, 102, 'PAYPAL', 'SUCCESS', 549.00, '2024-02-12 18:22:00');
INSERT INTO payments VALUES (3, 103, 'UPI', 'SUCCESS', 89.00, '2024-02-18 09:41:00');
INSERT INTO payments VALUES (4, 104, 'CREDIT_CARD', 'SUCCESS', 249.99, '2024-02-22 16:17:00');
INSERT INTO payments VALUES (5, 105, 'CREDIT_CARD', 'SUCCESS', 97.00, '2024-02-28 11:32:00');
INSERT INTO payments VALUES (6, 106, 'UPI', 'SUCCESS', 264.50, '2024-03-01 13:06:00');
INSERT INTO payments VALUES (7, 107, 'PAYPAL', 'SUCCESS', 199.99, '2024-03-04 20:12:00');
INSERT INTO payments VALUES (8, 108, 'CREDIT_CARD', 'SUCCESS', 798.99, '2024-03-07 10:28:00');
INSERT INTO payments VALUES (9, 109, 'CREDIT_CARD', 'FAILED', 135.00, '2024-03-12 17:52:00');
INSERT INTO payments VALUES (10, 110, 'UPI', 'REFUNDED', 129.50, '2024-03-15 14:16:00');
INSERT INTO payments VALUES (11, 111, 'CREDIT_CARD', 'SUCCESS', 299.94, '2024-03-18 19:33:00');
INSERT INTO payments VALUES (12, 112, 'CREDIT_CARD', 'SUCCESS', 97.00, '2024-03-20 12:47:00');

INSERT INTO inventory VALUES (1, 1, 'Warehouse-East', 150, 5);
INSERT INTO inventory VALUES (2, 2, 'Warehouse-East', 80, 2);
INSERT INTO inventory VALUES (3, 3, 'Warehouse-West', 45, 1);
INSERT INTO inventory VALUES (4, 4, 'Warehouse-Central', 200, 0);
INSERT INTO inventory VALUES (5, 5, 'Warehouse-Central', 110, 3);
INSERT INTO inventory VALUES (6, 6, 'Warehouse-West', 60, 4);
INSERT INTO inventory VALUES (7, 7, 'Warehouse-East', 95, 0);
INSERT INTO inventory VALUES (8, 8, 'Warehouse-Central', 300, 1);
INSERT INTO inventory VALUES (9, 9, 'Warehouse-Central', 180, 0);
INSERT INTO inventory VALUES (10, 10, 'Warehouse-East', 0, 0);

INSERT INTO refunds VALUES (1, 110, 10, 129.50, 'Customer cancelled before fulfillment', '2024-03-15 14:20:00');
INSERT INTO refunds VALUES (2, 103, 3, 89.00, 'Size exchange requested', '2024-02-25 11:00:00');
  `.trim(),
};

