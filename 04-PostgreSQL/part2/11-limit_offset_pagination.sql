

-- limits -> how many rows to return
-- offset -> how many rows to skip

-- SELECT name, price FROM products ORDER BY name ASC LIMIT 5;
SELECT name, price FROM products ORDER BY name ASC LIMIT 5 OFFSET 0;
SELECT name, price FROM products ORDER BY name ASC LIMIT 5 OFFSET 5;


-- {page - 1 } * limit 
-- page 1 -> offset = 0
-- page 2 -> offset = 5
-- page 3 -> offset = 10 , (3 - 1) * 5 = 10