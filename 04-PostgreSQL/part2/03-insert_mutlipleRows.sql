
INSERT INTO products (name, category, price, stock, sku, description ) VALUES (
  'Laptop stand 05' , 'Electronics', 100, 45, 'ELEC-LAP-100' , 'laptop stand description 05'),
  (
  'Laptop stand 06' , 'Electronics', 100, 45, 'ELEC-LAP-101' , 'laptop stand description 06'),
  (
  'Laptop stand 07' , 'Electronics', 100, 45, 'ELEC-LAP-102' , 'laptop stand description 07');


  SELECT name , category , price , stock , sku from products where sku IN ('ELEC-LAP-100' , 'ELEC-LAP-101' , 'ELEC-LAP-102');
