

-- count unique values
-- use DISTINCT in the COUNT function to count unique values in a column.

-- how many unique posts are connects to each tag?
SELECT 
  t.name AS tag_name,
  COUNT(DISTINCT pt.post_id) AS total_unique_posts
FROM tags AS t
LEFT JOIN post_tags AS pt
  ON t.id = pt.tag_id
LEFT JOIN posts AS p
  ON pt.post_id = p.id
GROUP BY t.id, t.name 
ORDER BY total_unique_posts DESC;