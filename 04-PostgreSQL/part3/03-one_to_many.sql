-- one to many means one record in a table can be associated with many records in another table. For example, one user can have many posts, but each post belongs to only one user.

-- one parent rows can have many child rows, but each child row can have only one parent row.

-- user - parent table
-- post - child table

-- post.user_id -> user.id (foreign key) 

-- users.id -> is the original user id, and posts.user_id -> is the foreign key that points to the original user id.



-- show all posts with their author name, post title and post status.
SELECT 
  users.name AS author_name,
  posts.title AS post_title,
  posts.status AS post_status
FROM users
INNER JOIN posts
  ON users.id = posts.user_id;