-- null - missing/unknown value

-- you should not check null using
-- = null or 
-- != null,
-- instead use IS NULL or IS NOT NULL

-- SELECT name, description FROM products WHERE description IS NULL;
-- SELECT name, description FROM products WHERE description IS NOT NULL;

SELECT name, category, is_active, description FROM products WHERE is_active = true AND description IS NULL;