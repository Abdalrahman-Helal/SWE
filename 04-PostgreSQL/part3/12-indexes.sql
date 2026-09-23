

-- indexes helps postgres to find the data faster. It is similar to the index of a book. 

-- SELECT -> speed up the data retrieval process.



SELECT 
  id,
  title,
  status
FROM posts
WHERE status = 'published';

-- idx_posts_status
-- idx -> index
-- posts -> table name
-- status -> column name

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);


SELECT 
  title,
  status,
  view
FROM posts
WHERE status = 'published'
ORDER BY view DESC;


-- Composite index is an index that is created on multiple columns of a table. It can be used to speed up queries that filter on multiple columns.


-- Composite Index
CREATE INDEX IF NOT EXISTS idx_posts_status_view ON posts(status, view);



SELECT 
  title,
  status,
  view
FROM posts
WHERE user_id = (SELECT id FROM users WHERE name = 'Ananya');

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

