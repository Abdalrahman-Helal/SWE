````md
# PostgreSQL — Creating Tables & Reading Data Cheat Sheet

## 1. Database Structure

```text
PostgreSQL Server
└── Database
    └── Schema
        └── Table
            ├── Columns
            └── Rows
````

* **Database** → Contains the application data.
* **Schema** → Organizes tables inside a database.
* **Table** → Stores data about one type of entity.
* **Column** → Defines what kind of data is stored.
* **Row** → One complete record.

Example:

```text
basics.students

id | name  | email           | age
---|-------|-----------------|----
1  | Ahmed | ahmed@gmail.com | 22
2  | Ali   | ali@gmail.com   | 25
```

---

# 2. CREATE TABLE

### Basic Syntax

```sql
CREATE TABLE schema_name.table_name (
  column_name DATA_TYPE CONSTRAINT,
  column_name DATA_TYPE CONSTRAINT
);
```

Example:

```sql
CREATE TABLE basics.students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER CHECK (age >= 18),
  created_at TIMESTAMP DEFAULT NOW()
);
```

`basics.students` means:

```text
schema     table
   ↓         ↓
basics.students
```

---

# 3. DROP TABLE

```sql
DROP TABLE IF EXISTS basics.students;
```

### What it does

Deletes the entire table, including its data.

### `IF EXISTS`

Prevents PostgreSQL from throwing an error if the table doesn't exist.

```sql
DROP TABLE IF EXISTS students;
```

With `IF EXISTS`:

```text
No error if students doesn't exist
```

### ⚠️ Important

Useful during learning/development:

```text
DROP → CREATE → test → DROP → CREATE
```

Dangerous in production because the table and its data are deleted.

---

# 4. Columns

A column is defined using:

```text
column_name + data_type + constraints
```

Example:

```sql
name TEXT NOT NULL
```

* `name` → column name
* `TEXT` → data type
* `NOT NULL` → constraint

---

# 5. Common Data Types

| Data Type   | Purpose               | Example               |
| ----------- | --------------------- | --------------------- |
| `INTEGER`   | Whole numbers         | `22`                  |
| `BIGINT`    | Large whole numbers   | `1000000000`          |
| `TEXT`      | Strings/text          | `'Ahmed'`             |
| `BOOLEAN`   | True/False            | `TRUE`                |
| `DATE`      | Date only             | `2026-09-22`          |
| `TIMESTAMP` | Date + time           | `2026-09-22 12:30:00` |
| `DECIMAL`   | Exact decimal numbers | `99.99`               |

Example:

```sql
age INTEGER
name TEXT
is_active BOOLEAN
birth_date DATE
created_at TIMESTAMP
price DECIMAL
```

---

# 6. PRIMARY KEY

A **Primary Key** uniquely identifies every row in a table.

```sql
id SERIAL PRIMARY KEY
```

Example:

```text
id | name
---|------
1  | Ahmed
2  | Ali
3  | Omar
```

Each row has a different `id`.

### Important

A Primary Key:

* Must be unique.
* Cannot be `NULL`.
* Identifies a specific row.
* A table normally has one Primary Key.

Think:

```text
Primary Key = ID card of the row
```

---

# 7. SERIAL

`SERIAL` is commonly used for auto-incrementing integer IDs.

```sql
id SERIAL
```

PostgreSQL automatically generates values:

```text
1
2
3
4
5
...
```

Usually used with:

```sql
id SERIAL PRIMARY KEY
```

So when inserting a student:

```sql
INSERT INTO basics.students (name, email, age)
VALUES ('Ahmed', 'ahmed@gmail.com', 22);
```

You don't need to provide `id`.

PostgreSQL generates it automatically.

### Note

`SERIAL` is PostgreSQL-specific and is an older/common style.

Modern PostgreSQL also supports:

```sql
GENERATED ALWAYS AS IDENTITY
```

For now, understanding `SERIAL` is enough.

---

# 8. NOT NULL

Means the column **must have a value**.

```sql
name TEXT NOT NULL
```

Valid:

```text
name = 'Ahmed'
```

Invalid:

```text
name = NULL
```

Useful for required fields:

```sql
name TEXT NOT NULL
email TEXT NOT NULL
```

Think:

```text
NOT NULL = Required
```

---

# 9. UNIQUE

Prevents duplicate values.

```sql
email TEXT UNIQUE
```

Example:

```text
Ahmed → ahmed@gmail.com
Ali   → ali@gmail.com
```

This would fail:

```text
Omar → ahmed@gmail.com
```

because `ahmed@gmail.com` already exists.

Common backend use cases:

```sql
email TEXT UNIQUE
username TEXT UNIQUE
phone TEXT UNIQUE
```

Think:

```text
UNIQUE = No duplicates
```

---

# 10. CHECK

Ensures that a value satisfies a condition.

```sql
age INTEGER CHECK (age >= 18)
```

Valid:

```text
age = 18
age = 25
age = 40
```

Invalid:

```text
age = 15
age = 10
```

Other examples:

```sql
price DECIMAL CHECK (price >= 0)

age INTEGER CHECK (age >= 18)

quantity INTEGER CHECK (quantity > 0)
```

Think:

```text
CHECK = Rule / Condition
```

---

# 11. DEFAULT

Provides a value automatically when the user doesn't provide one.

```sql
created_at TIMESTAMP DEFAULT NOW()
```

Example:

```sql
INSERT INTO basics.students (name, email, age)
VALUES ('Ahmed', 'ahmed@gmail.com', 22);
```

We didn't provide `created_at`.

PostgreSQL automatically sets:

```text
created_at → current date and time
```

Common examples:

```sql
created_at TIMESTAMP DEFAULT NOW()

is_active BOOLEAN DEFAULT TRUE

quantity INTEGER DEFAULT 1
```

Think:

```text
DEFAULT = Automatic value
```

---

# 12. TIMESTAMP + NOW()

### TIMESTAMP

Stores:

```text
Date + Time
```

Example:

```text
2026-09-22 12:30:45
```

### NOW()

Returns the current date and time.

```sql
DEFAULT NOW()
```

So:

```sql
created_at TIMESTAMP DEFAULT NOW()
```

means:

> If `created_at` isn't provided, use the current date and time.

---

# 13. SELECT — Read Data

`SELECT` is used to retrieve data from a table.

### Select All Columns

```sql
SELECT * FROM basics.students;
```

* `SELECT` → retrieves data.
* `*` → all columns.
* `FROM` → specifies the source.
* `basics.students` → `students` table inside the `basics` schema.

Example result:

```text
id | name  | email           | age | created_at
---+-------+-----------------+-----+-------------------
1  | Ahmed | ahmed@gmail.com | 22  | 2026-09-22 ...
2  | Ali   | ali@gmail.com   | 25  | 2026-09-22 ...
```

### Select Specific Columns

Instead of `*`, specify the columns you need:

```sql
SELECT name, email
FROM basics.students;
```

Result:

```text
name  | email
------+-----------------
Ahmed | ahmed@gmail.com
Ali   | ali@gmail.com
```

### Quick Recall

```text
SELECT * FROM table;
   ↓          ↓
all columns  source table
```

> `SELECT *` is useful for learning and checking data.
> In real backend applications, selecting only the columns you need is often preferred.

---

# 14. Full Example

```sql
DROP TABLE IF EXISTS basics.students;

CREATE TABLE basics.students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER CHECK (age >= 18),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Column Breakdown

| Column       | Type        | Constraint           | Meaning                            |
| ------------ | ----------- | -------------------- | ---------------------------------- |
| `id`         | `SERIAL`    | `PRIMARY KEY`        | Auto-generated unique ID           |
| `name`       | `TEXT`      | `NOT NULL`           | Required name                      |
| `email`      | `TEXT`      | `NOT NULL`, `UNIQUE` | Required + no duplicates           |
| `age`        | `INTEGER`   | `CHECK`              | Must be `18+`                      |
| `created_at` | `TIMESTAMP` | `DEFAULT`            | Automatically stores creation time |

---

# 15. Constraints

A **Constraint** is a rule that controls what data can be stored.

Common constraints:

```text
PRIMARY KEY → uniquely identifies a row
NOT NULL    → value is required
UNIQUE      → duplicates are not allowed
CHECK       → value must satisfy a condition
DEFAULT     → automatic value
```

Example:

```sql
email TEXT NOT NULL UNIQUE
```

This combines two constraints:

```text
NOT NULL → email is required
UNIQUE   → email cannot be duplicated
```

---

# 16. Constraints Protect Your Data

Constraints make the database enforce your rules.

For example:

```sql
age INTEGER CHECK (age >= 18)
```

Even if your backend accidentally sends:

```text
age = 12
```

PostgreSQL rejects it.

This helps maintain **data integrity**.

---

# 17. Backend Example

Imagine a Node.js application for users.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Data flow:

```text
Node.js
   ↓
SQL INSERT
   ↓
PostgreSQL
   ↓
users table
```

PostgreSQL enforces:

```text
id          → unique
name        → required
email       → required + unique
password    → required
created_at  → automatic
```

---

# 18. Quick Mental Model

When creating a table, think:

```text
TABLE
  ↓
What information do I need?
  ↓
COLUMN
  ↓
What type of value?
  ↓
DATA TYPE
  ↓
What rules should this value follow?
  ↓
CONSTRAINT
```

Example:

```text
email
  ↓
TEXT
  ↓
required + no duplicates
  ↓
NOT NULL + UNIQUE
```

---

# 19. Cheat Sheet — One Look

```text
CREATE TABLE
    ↓
Create a new table

DROP TABLE
    ↓
Delete a table

SELECT
    ↓
Read/retrieve data

PRIMARY KEY
    ↓
Unique identifier for each row

SERIAL
    ↓
Auto-incrementing integer

NOT NULL
    ↓
Required value

UNIQUE
    ↓
No duplicate values

CHECK
    ↓
Value must satisfy a condition

DEFAULT
    ↓
Automatic value if none is provided

TEXT
    ↓
String/text

INTEGER
    ↓
Whole number

BOOLEAN
    ↓
TRUE / FALSE

DATE
    ↓
Date

TIMESTAMP
    ↓
Date + time

NOW()
    ↓
Current date + time
```

# Core Syntax to Remember

```sql
CREATE TABLE schema.table (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER CHECK (age >= 18),
  created_at TIMESTAMP DEFAULT NOW()
);

SELECT * FROM schema.table;

SELECT column1, column2
FROM schema.table;
```

