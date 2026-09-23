

-- foreign keys , is a columns pointing to another table's primary key, it is used to establish a relationship between two tables.

-- users.id -> parent key
-- posts.user_id -> foreign key

-- every post u will create will be associated with a user, so we need to create a foreign key relationship between posts and users table.


SELECT id, name FROM users;

SELECT id, user_id, title FROM posts;


