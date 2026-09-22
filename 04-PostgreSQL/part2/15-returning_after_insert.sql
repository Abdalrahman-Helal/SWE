-- returning usually used after an insert statement to return the inserted row(s)


-- INSERT INTO products (name, category, price, stock, sku, description)
-- VALUES (
--   'webcam camera',
--   'electronics',
--   456.67, 
--   56,
--   'ELEC-WEB-009',
--   'webcam description') RETURNING id, name, category, price, stock, sku, description, is_active , created_at;




-- UPDATE products SET stock = stock + 11 where sku = 'ELEC-WEB-009' RETURNING id, name, stock;

DELETE FROM products where sku = 'ELEC-WEB-009' RETURNING id, name, sku;

SELECT name , sku FROM products where sku = 'ELEC-WEB-009';