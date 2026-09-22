تمام، هنا مش محتاجين تفاصيل كتير لأن الـ concepts دي بسيطة، فهخلي الـ MD **straightforward + practical**.

# PostgreSQL — Basic Constraints

Constraints are rules that PostgreSQL applies to table data to prevent invalid values.

Main constraints in this example:

* `NOT NULL`
* `UNIQUE`
* `DEFAULT`
* `CHECK`

---

## 1. NOT NULL

```sql
full_name TEXT NOT NULL
```

Means:

> This column cannot contain `NULL`.

Valid:

```sql
INSERT INTO accounts (full_name, email)
VALUES ('John Doe', 'john@example.com');
```

Invalid:

```sql
INSERT INTO accounts (full_name, email)
VALUES (NULL, 'john@example.com');
```

PostgreSQL rejects the row.

---

## 2. UNIQUE

```sql
email TEXT UNIQUE
```

Means:

> Every value in this column must be unique.

Example:

```text
john@example.com
ahmed@example.com
```

Valid.

But:

```text
john@example.com
john@example.com
```

Invalid.

In our example:

```sql
email TEXT UNIQUE NOT NULL
```

means:

* `NOT NULL` → email is required
* `UNIQUE` → no duplicate emails

So this will fail:

```sql
INSERT INTO basics.accounts (full_name, email, age)
VALUES ('duplicate email user', 'john.doe@example.com', 25);
```

because the email already exists.

---

## 3. DEFAULT

```sql
is_active BOOLEAN DEFAULT TRUE
```

Means:

> If no value is provided, PostgreSQL automatically uses `TRUE`.

Example:

```sql
INSERT INTO basics.accounts (full_name, email, age)
VALUES ('John Doe', 'john@example.com', 25);
```

We didn't provide `is_active`.

PostgreSQL automatically stores:

```text
is_active → TRUE
```

Same idea:

```sql
create_at TIMESTAMP DEFAULT NOW()
```

If `create_at` is not provided:

```text
create_at → current timestamp
```

---

## 4. CHECK

```sql
age INTEGER CHECK (age >= 18)
```

Means:

> The value of `age` must satisfy `age >= 18`.

Valid:

```text
18
25
40
```

Invalid:

```text
16
15
10
```

So this fails:

```sql
INSERT INTO basics.accounts (full_name, email, age)
VALUES ('underage user', 'underage@gmail.com', 16);
```

because:

```text
16 >= 18 → FALSE
```

---

# Complete Example

```sql
DROP TABLE IF EXISTS basics.accounts;

CREATE TABLE basics.accounts (
    id SERIAL PRIMARY KEY,

    full_name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    age INTEGER CHECK (age >= 18),

    create_at TIMESTAMP DEFAULT NOW()
);
```

---

# Quick Recall

| Constraint    | Purpose                        |
| ------------- | ------------------------------ |
| `NOT NULL`    | Value cannot be `NULL`         |
| `UNIQUE`      | Prevent duplicate values       |
| `DEFAULT`     | Automatically provides a value |
| `CHECK`       | Value must satisfy a condition |
| `PRIMARY KEY` | Unique identifier for each row |

### Easy mental model

```text
NOT NULL → Required
UNIQUE   → No duplicates
DEFAULT  → Automatic value
CHECK    → Must satisfy a rule
```

These constraints are important in backend development because they let the **database protect data integrity**, even if the application accidentally sends invalid data.
