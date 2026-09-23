# LEFT JOIN

## Query

```sql
SELECT
  posts.title AS post_title,
  comments.body AS comment_body
FROM posts
LEFT JOIN comments
  ON posts.id = comments.post_id
ORDER BY posts.title;
```

## What does it do?

Gets **all posts**, along with their comments if they have any.

If a post has **no comment**, `comment_body` will be `NULL`.

---

## Main Idea

```text
posts → LEFT table
comments → RIGHT table
```

`LEFT JOIN` keeps **all rows from the left table**.

```text
posts
  │
  ├── has comment → comment data
  │
  └── no comment  → NULL
```

---

## Breakdown

### 1. SELECT

```sql
SELECT
  posts.title AS post_title,
  comments.body AS comment_body
```

Choose what we want to see:

* `posts.title` → post title
* `comments.body` → comment content

---

### 2. FROM

```sql
FROM posts
```

`posts` is the **left table**.

---

### 3. LEFT JOIN

```sql
LEFT JOIN comments
  ON posts.id = comments.post_id
```

Connect each post with its comments.

The relationship is:

```text
posts.id
   ↑
   │
comments.post_id
```

`LEFT JOIN` means:

> Keep every post, even if it has no matching comment.

---

### 4. ORDER BY

```sql
ORDER BY posts.title;
```

Sort the result by the post title.

By default:

```text
ASC → A → Z
```

---

## Example

Suppose we have:

```text
posts
----------------
Post A
Post B
Post C
```

And only Post A and Post C have comments.

Result:

```text
post_title    | comment_body
--------------+----------------
Post A        | Very clear!
Post B        | NULL
Post C        | Great post!
```

**Post B still appears** because we used `LEFT JOIN`.

---

## INNER JOIN vs LEFT JOIN

```text
INNER JOIN
→ only rows that have a match

LEFT JOIN
→ all rows from the left table
→ matching rows from the right table
→ NULL when there is no match
```

### Mental Model

```text
posts
  ↓
LEFT JOIN comments
  ↓
keep ALL posts
  ↓
attach comments when available
  ↓
NULL if no comment
```

## Key Pattern

```sql
SELECT columns
FROM left_table
LEFT JOIN right_table
  ON relationship;
```
