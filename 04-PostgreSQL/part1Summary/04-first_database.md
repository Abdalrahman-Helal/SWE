# PostgreSQL — Data Types & INSERT Cheat Sheet

## 1. Creating the Table

```sql
DROP TABLE IF EXISTS basics.products_basic;

CREATE TABLE basics.products_basic(
  id SERIAL PRIMARY KEY,

  name VARCHAR(100) NOT NULL,

  description TEXT,

  stock INTEGER DEFAULT 0,

  total_views BIGINT DEFAULT 0,

  price NUMERIC(10, 2),

  is_active BOOLEAN DEFAULT TRUE
);
````

The table represents products:

```text
basics.products_basic

id | name | description | stock | total_views | price | is_active
```

---

# 2. VARCHAR

`VARCHAR(n)` stores string/text data with a maximum length.

```sql
name VARCHAR(100)
```

This means:

```text
name → String
      ↓
maximum 100 characters
```

Example:

```text
'Laptop'       ✅
'Gaming Mouse' ✅
```

A value longer than 100 characters is not allowed.

### VARCHAR vs TEXT

```text
VARCHAR(100)
    ↓
String with a maximum length

TEXT
    ↓
String without a specified maximum length
```

Use `VARCHAR(n)` when you specifically want to enforce a maximum length.

---

# 3. BIGINT

`BIGINT` stores whole numbers larger than `INTEGER`.

```sql
total_views BIGINT DEFAULT 0
```

Useful for values that can become very large:

```text
views
likes
downloads
counters
```

### INTEGER vs BIGINT

```text
INTEGER
   ↓
Normal-sized whole numbers

BIGINT
   ↓
Much larger whole numbers
```

PostgreSQL `BIGINT` can store values up to about **9 quintillion**.

---

# 4. NUMERIC

`NUMERIC` is used for exact decimal numbers.

```sql
price NUMERIC(10, 2)
```

The syntax is:

```text
NUMERIC(precision, scale)
```

### Precision

Total number of digits.

```text
NUMERIC(10, 2)
          ↑
     10 total digits
```

### Scale

Number of digits after the decimal point.

```text
NUMERIC(10, 2)
             ↑
        2 decimal digits
```

Example:

```text
2455.65
^^^^ ^^
  │   │
  │   └── 2 decimal digits
  └────── total digits = 6
```

`NUMERIC(10, 2)` can store values such as:

```text
99.99
2455.65
99999999.99
```

Commonly used for:

```text
price
money
salary
tax
percentage
```

---

# 5. BOOLEAN

`BOOLEAN` stores one of two values:

```text
TRUE
FALSE
```

Example:

```sql
is_active BOOLEAN DEFAULT TRUE
```

Example data:

```text
product1 → TRUE
product2 → FALSE
product3 → TRUE
```

Useful for yes/no states:

```text
is_active
is_verified
is_deleted
is_available
```

---

# 6. DEFAULT

A `DEFAULT` value is automatically used when no value is provided.

Examples:

```sql
stock INTEGER DEFAULT 0

total_views BIGINT DEFAULT 0

is_active BOOLEAN DEFAULT TRUE
```

If you insert:

```sql
INSERT INTO basics.products_basic (name)
VALUES ('product1');
```

PostgreSQL can automatically use:

```text
stock       → 0
total_views → 0
is_active   → TRUE
```

---

# 7. INSERT — Insert Data

`INSERT INTO` adds new rows to a table.

### Basic Syntax

```sql
INSERT INTO table_name
  (column1, column2, column3)
VALUES
  (value1, value2, value3);
```

Example:

```sql
INSERT INTO basics.products_basic
    (name, description, stock, total_views, price, is_active)
VALUES
  (
    'product1',
    'products desc',
    100,
    1200,
    2455.65,
    TRUE
  );
```

The values match the columns by position:

```text
name        → 'product1'
description → 'products desc'
stock       → 100
total_views → 1200
price       → 2455.65
is_active   → TRUE
```

---

# 8. INSERT Multiple Rows

You can insert multiple rows using one `INSERT` statement.

```sql
INSERT INTO basics.products_basic
    (name, description, stock, total_views, price, is_active)
VALUES
  (
    'product1',
    'products desc',
    100,
    1200,
    2455.65,
    TRUE
  ),
  (
    'product2',
    'products desc',
    100,
    1200,
    2455.65,
    FALSE
  ),
  (
    'product3',
    'products desc',
    100,
    1200,
    2455.65,
    TRUE
  );
```

Each `(...)` represents one row:

```text
(...) → row 1
(...) → row 2
(...) → row 3
```

This is usually better than running three separate `INSERT` statements when you already have multiple rows to insert.

---

# 9. SERIAL + INSERT

Notice that `id` is NOT included in the `INSERT`:

```sql
INSERT INTO basics.products_basic
    (name, description, stock, total_views, price, is_active)
VALUES
    (...);
```

Why?

Because:

```sql
id SERIAL PRIMARY KEY
```

automatically generates the ID.

Result:

```text
id | name
---|---------
1  | product1
2  | product2
3  | product3
```

---

# 10. SELECT — Read Data

### Select Everything

```sql
SELECT * FROM basics.products_basic;
```

* `SELECT` → retrieve data.
* `*` → all columns.
* `FROM` → specifies the table.

---

# 11. SELECT Specific Columns

You don't always need all columns.

```sql
SELECT id, name, price, is_active
FROM basics.products_basic;
```

Only these columns are returned:

```text
id
name
price
is_active
```

Instead of:

```sql
SELECT *
```

you can specify exactly what you need.

---

# 12. WHERE — Filter Rows

`WHERE` filters the rows returned by a query.

Example:

```sql
SELECT id, name, price, is_active
FROM basics.products_basic
WHERE is_active;
```

This means:

> Return only products where `is_active` is `TRUE`.

Result:

```text
id | name     | price   | is_active
---+----------+---------+----------
1  | product1 | 2455.65 | true
3  | product3 | 2455.65 | true
```

`product2` is not returned because:

```text
product2 → is_active = FALSE
```

---

# 13. WHERE with BOOLEAN

For a `BOOLEAN` column, you can write:

```sql
WHERE is_active
```

instead of:

```sql
WHERE is_active = TRUE
```

Both mean the same thing:

```sql
WHERE is_active;

WHERE is_active = TRUE;
```

For `FALSE`:

```sql
WHERE NOT is_active;
```

or:

```sql
WHERE is_active = FALSE;
```

---

# 14. Complete Example

```sql
DROP TABLE IF EXISTS basics.products_basic;

CREATE TABLE basics.products_basic(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  stock INTEGER DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  price NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO basics.products_basic
    (name, description, stock, total_views, price, is_active)
VALUES
  ('product1', 'products desc', 100, 1200, 2455.65, TRUE),
  ('product2', 'products desc', 100, 1200, 2455.65, FALSE),
  ('product3', 'products desc', 100, 1200, 2455.65, TRUE);

SELECT * FROM basics.products_basic;

SELECT id, name, price, is_active
FROM basics.products_basic
WHERE is_active;
```

---

# 15. Quick Mental Model

```text
CREATE TABLE
    ↓
Define the structure
    ↓
Columns + Data Types + Constraints
    ↓
INSERT
    ↓
Add Rows
    ↓
SELECT
    ↓
Read Rows
    ↓
WHERE
    ↓
Filter Rows
```

---

# 16. Quick Recall

```text
VARCHAR(n)
    → String with maximum n characters

TEXT
    → Text/string data

INTEGER
    → Whole number

BIGINT
    → Larger whole number

NUMERIC(10,2)
    → Exact decimal number
    → 10 total digits
    → 2 digits after decimal

BOOLEAN
    → TRUE / FALSE

DEFAULT
    → Automatic value when none is provided

INSERT INTO
    → Add rows

VALUES
    → Values being inserted

SELECT
    → Read data

*
    → All columns

WHERE
    → Filter rows

SERIAL
    → Auto-generated integer ID
```

# Core Syntax to Remember

```sql
-- Create
CREATE TABLE schema.table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT TRUE
);

-- Insert one row
INSERT INTO schema.table (name, price, is_active)
VALUES ('product1', 99.99, TRUE);

-- Insert multiple rows
INSERT INTO schema.table (name, price, is_active)
VALUES
  ('product1', 99.99, TRUE),
  ('product2', 49.99, FALSE);

-- Read all columns
SELECT * FROM schema.table;

-- Read specific columns + filter
SELECT id, name, price
FROM schema.table
WHERE is_active;
```
