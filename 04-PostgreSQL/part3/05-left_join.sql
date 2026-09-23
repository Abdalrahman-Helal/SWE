

-- left join keeps all rows from the left table and only matching rows from the right table. If there is no match, the result is NULL on the right side.

-- post -> left table
-- comment -> right table

-- not every post has a comment, but every comment belongs to a post.

SELECT
  posts.title AS post_title,
  comments.body AS comment_body
FROM posts
LEFT JOIN comments
  ON posts.id = comments.post_id
ORDER BY posts.title;
