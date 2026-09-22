
INSERT INTO products (name, category, price, stock, is_active, sku, description)

VALUES (
  'Laptop stand 03',
  'electronics',
  '5000',
  23,
  TRUE,
  'ELEC-KEY-003',
  'laptop stand description'
);




SELECT * FROM products where SKU = 'ELEC-KEY-003';
