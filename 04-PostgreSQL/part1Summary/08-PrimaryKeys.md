# PostgreSQL — Primary Key

## Primary Key

A **Primary Key** is a column used to **uniquely identify each row** in a table.

```sql
id SERIAL PRIMARY KEY
```

This means:

* `id` → identifies the row.
* `SERIAL` → automatically generates a new number.
* `PRIMARY KEY` → every `id` must be **unique** and **NOT NULL**.

### Example

```sql
CREATE TABLE basics.sales (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

When we insert:

```sql
INSERT INTO basics.sales (title, price) VALUES
  ('sale 1', 200),
  ('sale 2', 500);
```

PostgreSQL automatically generates:

```text
id | title  | price
---+--------+------
1  | sale 1 | 200
2  | sale 2 | 500
```

So we can use:

```sql
SELECT * FROM basics.sales WHERE id = 2;
```

to get **one specific row**.

---

## Primary Key Prevents Duplicates

This will fail:

```sql
INSERT INTO basics.sales (id, title, price)
VALUES (1, 'duplicate id', 200);
```

Because `id = 1` already exists.

The `PRIMARY KEY` constraint prevents two rows from having the same ID.

### Mental Model

Think of the Primary Key as the **unique ID card** of each row:

```text
sale 1 → ID 1
sale 2 → ID 2
sale 3 → ID 3
```

Each row has its own unique identifier.

---

## Important Rules

A Primary Key:

* Must be **UNIQUE**
* Cannot be **NULL**
* Identifies each row uniquely
* A table normally has **one Primary Key constraint**
* The Primary Key can consist of one column or multiple columns (composite key)

### Quick Recall

```text
PRIMARY KEY
     ↓
Unique identifier for each row
     ↓
UNIQUE + NOT NULL
```

In backend applications, the Primary Key is commonly used to find, update, or delete a specific record:

```sql
SELECT * FROM users WHERE id = 10;

UPDATE users
SET name = 'John'
WHERE id = 10;

DELETE FROM users
WHERE id = 10;
```
