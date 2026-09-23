

-- sub queries are queries nested inside another query. They can be used in SELECT, INSERT, UPDATE, or DELETE statements. Subqueries can return a single value or a set of values.


-- one query inside another query 
-- runs the inner query first, then uses the result of the inner query in the outer query.


-- which posts are performing better than the average post? (posts with more views than the average post)


SELECT 
  title,
  view,
  status
FROM posts
WHERE view > (SELECT AVG(view) FROM posts)
ORDER BY view DESC;