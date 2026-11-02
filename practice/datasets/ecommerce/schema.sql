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
