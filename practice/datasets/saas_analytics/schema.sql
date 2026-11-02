CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(120),
  organization_id INT,
  role VARCHAR(30),
  last_login_at VARCHAR(30),
  created_at VARCHAR(30)
);

CREATE TABLE subscriptions (
  id INT PRIMARY KEY,
  organization_id INT,
  plan_name VARCHAR(40),
  monthly_price DECIMAL(10,2),
  status VARCHAR(20),
  start_date VARCHAR(30),
  current_period_end VARCHAR(30)
);

CREATE TABLE events (
  id INT PRIMARY KEY,
  user_id INT,
  organization_id INT,
  event_name VARCHAR(60),
  page_url VARCHAR(120),
  created_at VARCHAR(30)
);

CREATE TABLE invoices (
  id INT PRIMARY KEY,
  subscription_id INT,
  organization_id INT,
  amount DECIMAL(10,2),
  status VARCHAR(20),
  billing_date VARCHAR(30),
  paid_at VARCHAR(30)
);

CREATE TABLE audit_logs (
  id INT PRIMARY KEY,
  user_id INT,
  action VARCHAR(60),
  resource_type VARCHAR(40),
  resource_id VARCHAR(40),
  ip_address VARCHAR(50),
  created_at VARCHAR(30)
);
