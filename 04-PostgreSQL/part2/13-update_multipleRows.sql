SELECT name, category, price, is_active FROM products WHERE category = 'Electronics';
UPDATE products SET price = ROUND(price * 1.10, 2) WHERE category = 'Electronics';
SELECT name, category, price, is_active FROM products WHERE category = 'Electronics';


UPDATE products SET is_active = FALSE WHERE stock = 0;

SELECT name, category, price, is_active FROM products WHERE is_active = FALSE;
