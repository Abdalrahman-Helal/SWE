

-- many to many means that one record in a table can be associated with many records in another table, and vice versa. For example, one post can have many tags, and one tag can be associated with many posts.

-- one past can have multiple tags
-- one tag can be associated with multiple posts

-- posts.id === post_tags.post_id (foreign key)
-- tags.id === post_tags.tag_id (foreign key)


-- show me every post with it's tag

SELECT 
  posts.title AS post_title,
  tags.name AS tag_name
from posts
INNER JOIN post_tags
  ON posts.id = post_tags.post_id
INNER JOIN tags
  ON post_tags.tag_id = tags.id
ORDER BY posts.title, tags.name;