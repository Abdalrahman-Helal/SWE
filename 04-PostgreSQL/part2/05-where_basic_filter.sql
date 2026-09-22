-- /products?category=Electronics

-- SELECT name, category, price FROM products where category = 'Electronics';  


-- find products where the price > 1000 
-- SELECT name, price FROM products where price > 1000;

-- find products which are not active
SELECT name, is_active FROM products where is_active = FALSE;