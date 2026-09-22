

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS products;


CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sku TEXT UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO products (name, category, price, stock, is_active, sku, description ) VALUES (
  'Wireless Mouse', 'Electronics', 25.99, 100, TRUE, 'WM-001', 'A high-quality wireless mouse with ergonomic design.'
),(
  'Bluetooth Headphones', 'Electronics', 59.99, 50, TRUE, 'BH-002', 'Noise-cancelling over-ear headphones with long battery life.'
),( 
  'Gaming Keyboard', 'Electronics', 89.99, 30, TRUE, 'GK-003', 'Mechanical keyboard with customizable RGB lighting and programmable keys.'
),( 
  'Smartphone Stand', 'Accessories', 15.49, 200, TRUE, 'SS-004', 'Adjustable stand for smartphones and tablets, perfect for video calls and watching content.'
),( 
  'USB-C Hub', 'Accessories', 39.99, 75, TRUE, 'UH-005', 'Multi-port USB-C hub with HDMI, USB-A, and SD card slots for laptops and tablets.'

);
SELECT * FROM products;