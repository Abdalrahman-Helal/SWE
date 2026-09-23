

-- transactions

-- multiple SQL statements run as one safe unit 

-- placing an order 
-- reduce stock of the product 
-- creating payment records
-- transfering money from one account to another
-- creating user records with related profile data  


BEGIN;

  UPDATE posts 
  SET status = 'published' 
  WHERE title = 'Indexes for beginners'
      AND status = 'draft';

UPDATE posts
  SET view = view + 50
  WHERE title = 'Indexes for beginners';


SELECT 
  title,
  status,
  view
FROM posts
WHERE title = 'Indexes for beginners';

COMMIT;