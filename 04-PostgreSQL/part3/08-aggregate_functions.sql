

-- aggregate functions calculate a single value from a set of values.

-- COUNT() counts the number of rows in a set.
-- SUM() adds up the values in a set.
-- AVG() calculates the average of the values in a set.
-- MIN() returns the minimum value in a set.
-- MAX() returns the maximum value in a set.


-- admin dashboard , repots , analyticcs , admin panels

SELECT 
  COUNT(*) AS total_posts,
  COUNT(*) FILTER (WHERE status = 'published') AS total_published_posts,
  COUNT(*) FILTER (WHERE status = 'draft') AS total_draft_posts,
  SUM(view) AS total_views,
  AVG(view) AS average_views_per_post,
  MIN(view) AS minimum_views,
  MAX(view) AS maximum_views
FROM posts
