-- IN -> value must match one of the values in the list
-- NOT IN -> value must not match any of the values in the list
-- BETWEEN -> value must be within the range of two values


-- SELECT name, category, price FROM products WHERE category IN ('Electronics', 'Accessories');


-- SELECT name, category, price FROM products WHERE category NOT IN ('Electronics', 'Accessories');

-- SELECT name, category, price FROM products WHERE price BETWEEN 30 AND 80;

SELECT name, category, price FROM products WHERE price BETWEEN 30 AND 80 AND category IN ('Electronics');