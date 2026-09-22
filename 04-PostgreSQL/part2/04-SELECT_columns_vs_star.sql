

-- select * -> return all columns from the table
-- SELECT * FROM products;



-- select specific columns -> return only the specified columns from the table


-- SELECT name, category, price, stock FROM products;
SELECT price FROM products;


-- alias , AS creates an alias for a column or table, making it easier to reference in queries
SELECT price AS product_price FROM products;
