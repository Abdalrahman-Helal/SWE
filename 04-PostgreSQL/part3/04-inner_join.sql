


-- inner join connects two tables based on a common column, and only returns rows where there is a match in both tables.

SELECT 
  users.name AS author_name,
  posts.title AS post_title,
  posts.status,
  posts.view
FROM posts
INNER JOIN users
  ON posts.user_id = users.id
WHERE posts.status = 'published'
ORDER BY posts.view DESC;

