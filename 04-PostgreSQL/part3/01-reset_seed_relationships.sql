

CREATE EXTENSION IF NOT EXISTS pgcrypto;


DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id),

  title TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),

  view INT NOT NULL DEFAULT 0 CHECK (view >= 0)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  post_id UUID NOT NULL REFERENCES posts(id),

  body TEXT NOT NULL
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL UNIQUE
);

CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id),

  tag_id UUID NOT NULL REFERENCES tags(id),

  PRIMARY KEY (post_id, tag_id)
);



INSERT INTO users (name) VALUES
  ('Ananya'),
  ('Rahul'),
  ('Charlie');


INSERT INTO posts (user_id, title, status, view) 
SELECT id, 'PostGreSQL joins explained' , 'published', 100 FROM users WHERE name = 'Ananya';

INSERT INTO posts (user_id, title, status, view)
SELECT id, 'Indexes for beginners', 'draft', 40 FROM users WHERE name = 'Ananya';


INSERT INTO posts (user_id, title, status, view)
SELECT id, 'Backend APIs with postgres', 'published', 180 FROM  users WHERE name = 'Rahul';


INSERT INTO comments (post_id, body)
SELECT id , 'Very clear explaintion' FROM posts WHERE title = 'PostGreSQL joins explained';

INSERT INTO comments (post_id, body)
SELECT id , 'Please add more examples' FROM posts WHERE title = 'Backend APIs with postgres';


INSERT INTO tags (name) VALUES
  ('sql'),
  ('backend');



INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t WHERE p.title = 'PostGreSQL joins explained' AND t.name = 'sql';


INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t WHERE p.title = 'Indexes for beginners' AND t.name = 'sql';


INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t WHERE p.title = 'Backend APIs with postgres' AND t.name = 'backend';



SELECT 'Part 3 reduced database reset and sample data inserted successfully' AS message;

SELECT * FROM post_tags;
