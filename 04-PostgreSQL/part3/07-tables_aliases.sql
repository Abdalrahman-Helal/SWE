

-- alaises is going to make our queries more readable and easier to read.


-- posts.title 
-- I want to write like this p.title 


-- users.name insteald of writing users.name, I want to write u.name


SELECT 
  p.title AS post_title,
  p.status,
  p.view,
  u.name AS author_name,
  c.body AS comment_body
FROM posts AS p 
INNER JOIN users AS u
  ON p.user_id = u.id
LEFT JOIN comments AS c
  ON p.id = c.post_id
ORDER BY p.view DESC;
