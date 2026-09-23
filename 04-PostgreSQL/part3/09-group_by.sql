

-- group by creats group of rows that have the same values in specified columns into summary rows, like "find the number of customers in each country".


-- WHERE -> filters rows before grouping them.
-- HAVING -> filters groups after grouping them.


-- find authors who have returned at least 2 posts with the number of posts they have returned.

SELECT 
  u.name AS author_name,
  COUNT(p.id) AS total_posts,
  SUM(p.view) AS total_views
FROM users AS u
LEFT JOIN posts as p
  ON u.id = p.user_id
GROUP BY u.id, u.name
HAVING COUNT(p.id) = 1
ORDER BY total_posts DESC;

