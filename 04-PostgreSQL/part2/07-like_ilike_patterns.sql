

-- like and ilike patterns

-- like is case sensitive
-- ilike is case insensitive
-- % means any number of characters
-- _ means a single character

-- SELECT name, price FROM products WHERE name LIKE 'Wireless%'; 



-- Desk , desk , DESK 

SELECT name, price , category FROM products WHERE category ILIKE 'electronics%' OR category ILIKE 'accessories%';