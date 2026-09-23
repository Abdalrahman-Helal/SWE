# INNER JOIN + WHERE + ORDER BY

## Query

```sql
SELECT 
  users.name AS author_name,
  posts.title AS post_title,
  posts.status,
  posts.view
FROM posts
INNER JOIN users
  ON posts.user_id = users.id
WHERE posts.status = 'published'
ORDER BY posts.view DESC;
```

## What does it do?

Gets **published posts**, along with the **author's name**, and sorts them from **most views to least views**.

---

## Breakdown

### 1. SELECT

```sql
SELECT 
  users.name AS author_name,
  posts.title AS post_title,
  posts.status,
  posts.view
```

Choose the columns we want to see.

* `users.name AS author_name` → author's name
* `posts.title AS post_title` → post title
* `posts.status` → post status
* `posts.view` → number of views

`AS` creates a **column alias** for the result.

---

### 2. FROM

```sql
FROM posts
```

Start with the `posts` table.

---

### 3. INNER JOIN

```sql
INNER JOIN users
  ON posts.user_id = users.id
```

Connect `posts` with `users`.

The relationship is:

```text
users.id
   ↑
   │
posts.user_id
```

`ON` tells PostgreSQL **how the two tables are related**.

`INNER JOIN` returns only posts that have a matching user.

---

### 4. WHERE

```sql
WHERE posts.status = 'published'
```

Filter the rows.

Only posts where:

```text
status = 'published'
```

will appear.

---

### 5. ORDER BY

```sql
ORDER BY posts.view DESC;
```

Sort the result by `view`.

* `ASC` → smallest → largest
* `DESC` → largest → smallest

So `DESC` gives us the **most viewed posts first**.

---

## Mental Model

Think of the query as:

```text
posts
  ↓
JOIN users
  ↓
match posts.user_id = users.id
  ↓
keep only published posts
  ↓
sort by views (highest first)
  ↓
return selected columns
```

## Key Pattern

```sql
SELECT columns
FROM table1
INNER JOIN table2
  ON relationship
WHERE condition
ORDER BY column DESC;
```
