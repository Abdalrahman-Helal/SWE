
SELECT name, price, stock, sku FROM products WHERE sku = 'ELEC-KEY-003';

UPDATE products SET price = 7000, stock = 30 WHERE sku = 'ELEC-KEY-003';
SELECT name, price, stock, sku FROM products WHERE sku = 'ELEC-KEY-003';