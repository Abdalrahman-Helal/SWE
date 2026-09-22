

-- AND -> every condition must be true
-- OR -> at least one condition must be true
-- NOT -> negate the condition


-- product where it is electornics and the price > 60
-- SELECT name, category, price FROM products where category = 'Electronics' AND price > 60; 

-- product where it is electornics or  furniture
-- SELECT name, category, price FROM products where category = 'Electronics' OR category = 'Accessories';

-- SELECT name, category, price FROM products where NOT category = 'Electronics';

SELECT name, category, price, stock FROM products 
WHERE(category = 'Electronics' OR category = 'Accessories') AND stock > 0;

SELECT name, price ,stock , is_active FROM products WHERE is_active = TRUE AND (price < 50 OR stock >= 80 );
