# PostgreSQL — NULL vs Empty String vs Zero

This section explains an important concept in SQL:

* `NULL`
* Empty String `''`
* Zero `0`

They represent **different things** and must be queried differently.

---

# 1. NULL

`NULL` means:

> The value is unknown, missing, or not provided.

Example:

```sql
INSERT INTO basics.value_exmaples (nickname, bio, score)
VALUES (NULL, 'learning PostgreSQL', 10);
```

Here:

```text
nickname → NULL
```

means:

> We don't have a nickname value.

It does **not** mean:

```text
""
```

and it does **not** mean:

```text
0
```

---

# 2. Empty String

An empty string is:

```sql
''
```

It means:

> A known string value that contains zero characters.

Example:

```sql
INSERT INTO basics.value_exmaples (nickname, bio, score)
VALUES ('', 'empty nickname', 20);
```

Here:

```text
nickname → ''
```

The nickname is known to be an empty string.

### Important difference

```text
NULL
→ No value / unknown / missing

''
→ A value exists, but it contains no characters
```

Think:

```text
NULL = "I don't know the value"

'' = "I know the value; it's empty"
```

---

# 3. Zero

`0` is a real numerical value.

Example:

```sql
INSERT INTO basics.value_exmaples (nickname, bio, score)
VALUES ('helal', '', 0);
```

Here:

```text
score → 0
```

means:

> The score is actually zero.

It does NOT mean:

```text
NULL
```

---

# 4. The Three Values Compared

| Value  | Meaning                           |
| ------ | --------------------------------- |
| `NULL` | Missing / unknown value           |
| `''`   | Known string with zero characters |
| `0`    | Actual numerical value zero       |

Example:

```text
nickname = NULL
```

→ We don't know/have the nickname.

```text
nickname = ''
```

→ The nickname is explicitly an empty string.

```text
score = 0
```

→ The score is actually zero.

---

# 5. How to Check for NULL

You **cannot** normally use:

```sql
WHERE nickname = NULL
```

This is incorrect for checking NULL.

Instead use:

```sql
WHERE nickname IS NULL
```

Example:

```sql
SELECT *
FROM basics.value_exmaples
WHERE nickname IS NULL;
```

Meaning:

> Return rows where `nickname` has no value.

---

# 6. How to Check NOT NULL

Use:

```sql
WHERE nickname IS NOT NULL
```

Example:

```sql
SELECT *
FROM basics.value_exmaples
WHERE nickname IS NOT NULL;
```

Meaning:

> Return rows where `nickname` contains a value.

Notice that this includes an empty string:

```text
''
```

because `''` is **not NULL**.

For example:

```text
nickname
--------
NULL       ← excluded
''         ← included
helal      ← included
john       ← included
```

---

# 7. Why `= NULL` Doesn't Work

This is one of the most important SQL concepts.

Don't write:

```sql
WHERE nickname = NULL;
```

Use:

```sql
WHERE nickname IS NULL;
```

The reason is that `NULL` represents an unknown/missing value.

SQL uses special logic for comparisons involving NULL.

For example:

```sql
NULL = NULL
```

does not produce normal `TRUE`.

Therefore SQL provides:

```sql
IS NULL
IS NOT NULL
```

for NULL checks.

### Remember

```text
NULL      → IS NULL
NOT NULL  → IS NOT NULL
```

---

# 8. Checking Empty String

An empty string is a normal string value, so use `=`:

```sql
WHERE nickname = ''
```

Example:

```sql
SELECT *
FROM basics.value_exmaples
WHERE nickname = '';
```

This means:

> Return rows where nickname is an empty string.

Do NOT use:

```sql
WHERE nickname IS NULL
```

because `NULL` and `''` are different.

---

# 9. Checking Zero

Zero is also a normal value, so use `=`:

```sql
WHERE score = 0
```

Example:

```sql
SELECT *
FROM basics.value_exmaples
WHERE score = 0;
```

This means:

> Return rows where score is exactly zero.

---

# 10. Our Example

The inserted data is conceptually:

```text
id | nickname | bio                 | score
----------------------------------------------
1  | NULL     | learning PostgreSQL | 10
2  | ''       | empty nickname      | 20
3  | helal    | ''                  | 0
4  | john     | NULL                | NULL
```

Now let's see what each query does.

---

## Query 1 — nickname IS NULL

```sql
SELECT *
FROM basics.value_exmaples
WHERE nickname IS NULL;
```

Returns:

```text
1 | NULL | learning PostgreSQL | 10
```

Because only row 1 has `nickname = NULL`.

---

## Query 2 — nickname = ''

```sql
SELECT *
FROM basics.value_exmaples
WHERE nickname = '';
```

Returns:

```text
2 | '' | empty nickname | 20
```

Because row 2 has an empty string.

---

## Query 3 — score = 0

```sql
SELECT *
FROM basics.value_exmaples
WHERE score = 0;
```

Returns:

```text
3 | helal | '' | 0
```

Because `0` is the actual score.

---

## Query 4 — nickname IS NOT NULL

```sql
SELECT *
FROM basics.value_exmaples
WHERE nickname IS NOT NULL;
```

Returns rows:

```text
2 | ''     | empty nickname | 20
3 | helal  | ''             | 0
4 | john   | NULL           | NULL
```

Notice row 2 is included.

Why?

Because:

```text
'' ≠ NULL
```

An empty string is still a value.

---

# 11. NULL in Different Data Types

`NULL` is not a specific data type like:

```text
INTEGER
TEXT
BOOLEAN
```

It represents the absence/unknown state of a value.

Therefore you can have:

```text
TEXT    → NULL
INTEGER → NULL
BOOLEAN → NULL
TIMESTAMP → NULL
```

For example:

```sql
name = NULL
age = NULL
is_active = NULL
created_at = NULL
```

All of these mean that the corresponding value is missing/unknown.

---

# 12. NULL vs Default

Consider:

```sql
score INTEGER DEFAULT 0
```

If you don't provide `score`:

```sql
INSERT INTO users(name)
VALUES ('Helal');
```

PostgreSQL uses the default:

```text
score → 0
```

But if you explicitly provide:

```sql
INSERT INTO users(name, score)
VALUES ('Helal', NULL);
```

then:

```text
score → NULL
```

The `DEFAULT` does not automatically convert an explicitly provided `NULL` into `0`.

This distinction is important.

---

# 13. Practical Backend Example

Imagine a user profile:

```text
nickname
bio
age
```

You might have:

```text
nickname = NULL
```

Meaning:

> User hasn't provided a nickname.

```text
nickname = ''
```

Meaning:

> A nickname value was provided, but it's empty.

```text
age = 0
```

Meaning:

> The actual age is zero.

In real applications, you usually need to decide what each state should mean before storing data.

---

# 14. Combining NULL Conditions

You can combine these conditions with `AND` / `OR`.

Example:

```sql
SELECT *
FROM basics.value_exmaples
WHERE nickname IS NOT NULL
  AND score = 0;
```

This means:

> Return rows where nickname exists AND score is zero.

Another example:

```sql
SELECT *
FROM basics.value_exmaples
WHERE nickname IS NULL
   OR nickname = '';
```

This means:

> Return rows where nickname is either NULL OR an empty string.

These are separate conditions inside the **same query**.

---

# 15. Quick Mental Model

Think of these three states:

```text
NULL
│
└── "I don't have a value"

''
│
└── "I have a string value, but it is empty"

0
│
└── "The numerical value is actually zero"
```

They are completely different.

---

# 16. Quick Recall

```text
NULL
→ Missing / unknown

''
→ Empty string

0
→ Actual numerical zero
```

Use:

```sql
IS NULL
```

to find NULL.

Use:

```sql
IS NOT NULL
```

to find values that aren't NULL.

Use:

```sql
= ''
```

to find empty strings.

Use:

```sql
= 0
```

to find zero.

### Most important rule

```text
NULL      → IS NULL
NOT NULL  → IS NOT NULL
Empty     → = ''
Zero      → = 0
```

---

# Core Syntax

```sql
-- NULL
WHERE column IS NULL;

-- NOT NULL
WHERE column IS NOT NULL;

-- Empty string
WHERE column = '';

-- Zero
WHERE column = 0;
```
