

INSERT INTO products (name, category, price, stock, is_active, sku, description)
VALUES (
  'temp product to be deleted',
  'electronics',
  '345.45',
  45,
  TRUE,
  'ELEC-KEY-013',
  'temp product desc'
);

SELECT name, category, sku FROM products WHERE sku = 'ELEC-KEY-013';

DELETE FROM products WHERE sku = 'ELEC-KEY-013';

SELECT name, category, sku FROM products WHERE sku = 'ELEC-KEY-013';