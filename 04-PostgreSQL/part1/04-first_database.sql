
DROP TABLE IF EXISTS basics.products_basic;

CREATE TABLE basics.products_basic(
  id SERIAL PRIMARY KEY,

  
  -- string data type with a maximum length of 100 characters
  name VARCHAR(100) NOT NULL,

  description TEXT,

  stock INTEGER DEFAULT 0,

  -- store larger numbers than INTEGER, up to 9 quintillion
  total_views BIGINT DEFAULT 0,

  -- NUMERIC is a data type for storing decimal numbers with a fixed precision and scale
  -- 10 is the total number of digits, and 2 is the number of digits after the decimal point , ex: 99.99
  price NUMERIC(10, 2),

  is_active BOOLEAN DEFAULT TRUE
);

-- Queries

INSERT INTO basics.products_basic
    (name, description, stock, total_views, price, is_active)
VALUES
  (
    'product1',
    'products desc',
    100,
    1200,
    2455.65,
    TRUE 
  ), 
  (
    'product2',
    'products desc',
    100,
    1200,
    2455.65,
    FALSE 
  ),
  (
    'product3',
    'products desc',
    100,
    1200,
    2455.65,
    TRUE 
  );



SELECT * FROM basics.products_basic;


SELECT id , name , price , is_active
FROM basics.products_basic
WHERE is_active