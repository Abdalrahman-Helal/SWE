# PostgreSQL — UUID & JSONB

This section introduces two important PostgreSQL concepts:

* `UUID` — Universally Unique Identifier
* `JSONB` — PostgreSQL's binary JSON data type

These are especially useful in backend applications, APIs, event logging, metadata, and distributed systems.

---

# 1. UUID

## What is UUID?

`UUID` stands for:

> Universally Unique Identifier

It is a **128-bit identifier** used to uniquely identify data.

Instead of using a simple sequential ID:

```text
1
2
3
4
5
```

we can use UUIDs:

```text
550e8400-e29b-41d4-a716-446655440000
7f3a8f2e-9b41-4f5c-8d32-2e5b7c91a123
```

A UUID is much larger than an integer and is designed to make collisions extremely unlikely.

---

## Why use UUID instead of INTEGER?

A traditional database ID might look like:

```text
1
2
3
4
5
```

This has a few characteristics:

* Sequential
* Easy to generate
* Easy to read
* Easy to guess

For example:

```text
/users/1
/users/2
/users/3
```

Someone can easily guess that `/users/4` might exist.

With UUIDs:

```text
/users/550e8400-e29b-41d4-a716-446655440000
```

the ID is not sequential or easily guessable.

### Important

UUIDs are **not a replacement for authentication or authorization**.

Using UUIDs can make IDs harder to guess, but you still need proper authorization:

```text
Authentication
+
Authorization
```

---

# 2. UUID in PostgreSQL

PostgreSQL provides a `UUID` data type.

Example:

```sql
CREATE TABLE users(
    id UUID PRIMARY KEY
);
```

Now the `id` column expects a UUID.

You can insert a UUID manually:

```sql
INSERT INTO users(id)
VALUES ('550e8400-e29b-41d4-a716-446655440000');
```

But manually generating UUIDs isn't convenient.

That's where `gen_random_uuid()` comes in.

---

# 3. gen_random_uuid()

```sql
gen_random_uuid()
```

is a PostgreSQL function that generates a random UUID.

Example:

```sql
SELECT gen_random_uuid();
```

You will get something similar to:

```text
c4a760a8-3c5e-4a8e-9a5b-8f2d6e123456
```

Every call generates another UUID.

---

# 4. UUID + DEFAULT

In our table:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

There are several concepts here:

```text
id
│
├── UUID
│
├── PRIMARY KEY
│
└── DEFAULT gen_random_uuid()
```

The important new part is:

```sql
DEFAULT gen_random_uuid()
```

It means:

> If the INSERT does not provide an `id`, PostgreSQL automatically generates one.

Therefore, instead of:

```sql
INSERT INTO basics.app_events
(id, event_name)
VALUES
('550e8400-e29b-41d4-a716-446655440000', 'sign_up');
```

we can simply write:

```sql
INSERT INTO basics.app_events
(event_name)
VALUES
('sign_up');
```

PostgreSQL generates the ID automatically.

---

# 5. UUID Mental Model

Think about it like this:

```text
Application
     │
     │ INSERT event
     ▼
PostgreSQL
     │
     │ id was not provided
     ▼
gen_random_uuid()
     │
     ▼
Generate UUID
     │
     ▼
Store row
```

So:

```sql
id UUID DEFAULT gen_random_uuid()
```

means:

> "This column stores UUIDs, and PostgreSQL should generate one automatically when I don't provide it."

---

# 6. JSON

Before understanding `JSONB`, understand JSON.

JSON stands for:

> JavaScript Object Notation

Example:

```json
{
  "browser": "chrome",
  "version": 120,
  "mobile": true
}
```

JSON represents structured data using:

```text
key → value
```

Examples:

```json
{
  "browser": "chrome"
}
```

```json
{
  "user": "Helal"
}
```

```json
{
  "browser": "chrome",
  "version": 120,
  "mobile": true
}
```

A JSON object can contain:

* strings
* numbers
* booleans
* arrays
* objects
* null

Example:

```json
{
  "user": "Helal",
  "age": 22,
  "active": true,
  "skills": ["C", "Python", "SQL"],
  "address": {
    "city": "Mansoura"
  }
}
```

---

# 7. What is JSONB?

PostgreSQL provides a `JSONB` data type.

```sql
metadata JSONB
```

`JSONB` means PostgreSQL stores JSON data in a **binary representation**.

The `B` stands for:

> Binary

It is designed to make JSON data more efficient to work with inside PostgreSQL.

For example:

```sql
metadata JSONB
```

can store:

```json
{
  "browser": "chrome"
}
```

or:

```json
{
  "user": "Helal"
}
```

or:

```json
{
  "browser": "chrome",
  "version": 120,
  "mobile": true
}
```

---

# 8. Why do we need JSONB?

Normally, relational databases encourage us to define columns explicitly.

For example:

```sql
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    age INTEGER
);
```

Every piece of data has its own column.

But sometimes we have **flexible data**.

For example, imagine an application event system.

One event might contain:

```json
{
  "browser": "chrome"
}
```

Another event might contain:

```json
{
  "user": "Helal"
}
```

Another event might contain:

```json
{
  "product_id": 15,
  "price": 100,
  "currency": "USD"
}
```

Creating separate columns for every possible metadata field would be inconvenient.

Instead, we can use:

```sql
metadata JSONB
```

and store different JSON structures in the same column.

---

# 9. JSONB in Event Systems

Our table is:

```sql
CREATE TABLE basics.app_events(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);
```

Conceptually:

```text
app_events
│
├── id
│   └── UUID
│
├── event_name
│   └── TEXT
│
├── metadata
│   └── JSONB
│
└── created_at
    └── TIMESTAMP
```

Example rows:

```text
event_name    metadata
--------------------------------
sign_up       {"browser":"chrome"}
sign_in       {"user":"Helal"}
```

This is a very common pattern for:

* application events
* logs
* analytics
* audit data
* API metadata
* flexible configuration
* event tracking

---

# 10. JSON vs JSONB

PostgreSQL has both:

```text
JSON
JSONB
```

They are related, but not identical.

## JSON

`JSON` stores the JSON text representation.

## JSONB

`JSONB` stores a binary/decomposed representation optimized for processing.

In practice, `JSONB` is commonly preferred when you need to:

* query JSON contents
* search inside JSON
* use JSON operators
* create indexes on JSON data

Example:

```sql
metadata JSONB
```

For many backend use cases, `JSONB` is the practical choice.

---

# 11. Important JSONB Characteristic

JSONB is not simply "JSON stored as text."

PostgreSQL parses the JSON and stores it in a format optimized for database operations.

This allows PostgreSQL to efficiently perform operations such as:

```sql
metadata ->> 'browser'
```

and:

```sql
metadata ? 'browser'
```

---

# 12. '{}'::jsonb

Our table contains:

```sql
metadata JSONB DEFAULT '{}'::jsonb
```

There are two new ideas here:

```text
{}
::
```

---

## `{}`

In JSON, `{}` represents an:

> Empty JSON Object

Example:

```json
{}
```

It means:

```text
Object
└── contains no keys
```

It is different from:

```text
NULL
```

`NULL` means:

> There is no value.

While:

```json
{}
```

means:

> There is a JSON object, but it currently has no keys.

---

# 13. :: Type Casting

This:

```sql
'{}'::jsonb
```

uses PostgreSQL's **type cast operator**:

```sql
::
```

It tells PostgreSQL:

> Treat this value as this data type.

For example:

```sql
'123'::integer
```

means:

```text
Treat the string '123' as an INTEGER.
```

Another example:

```sql
'true'::boolean
```

means:

```text
Treat 'true' as BOOLEAN.
```

Our example:

```sql
'{}'::jsonb
```

means:

```text
Treat '{}' as JSONB.
```

---

# 14. Why do we need ::jsonb here?

The column is:

```sql
metadata JSONB
```

and we want its default value to be an empty JSON object:

```json
{}
```

So we explicitly cast it:

```sql
DEFAULT '{}'::jsonb
```

Conceptually:

```text
'{}'
 ↓
JSON object
 ↓
cast to JSONB
 ↓
use as DEFAULT
```

---

# 15. Inserting JSONB

Our INSERT:

```sql
INSERT INTO basics.app_events
    (event_name, metadata)
VALUES
(
    'sign_up',
    '{"browser": "chrome"}'
),
(
    'sign_in',
    '{"user": "Helal"}'
);
```

The `metadata` values are JSON objects.

First row:

```json
{
  "browser": "chrome"
}
```

Second row:

```json
{
  "user": "Helal"
}
```

Notice something important:

The structure of `metadata` does not have to be identical for every row.

```text
sign_up
└── browser

sign_in
└── user
```

This is one of the main reasons JSONB is useful.

---

# 16. JSONB Operators

PostgreSQL provides operators for working with JSON/JSONB.

Our example introduces two important ones:

```text
->>
?
```

---

# 17. ->> Operator

This:

```sql
metadata ->> 'browser'
```

means:

> Get the value of the `browser` key from the JSON object and return it as TEXT.

Suppose:

```json
{
  "browser": "chrome"
}
```

Then:

```sql
metadata ->> 'browser'
```

returns:

```text
chrome
```

---

# 18. -> vs ->>

PostgreSQL has two operators that look very similar:

```text
->
->>
```

The important difference:

### `->`

Returns JSON/JSONB.

### `->>`

Returns TEXT.

Example:

```sql
metadata -> 'browser'
```

Result conceptually:

```json
"chrome"
```

While:

```sql
metadata ->> 'browser'
```

returns:

```text
chrome
```

### Easy way to remember

```text
->   → JSON/JSONB
->>  → TEXT
```

The extra `>` can help you remember that you're extracting the value as text.

---

# 19. Example of ->>

Given:

```json
{
  "browser": "chrome",
  "version": 120
}
```

This:

```sql
metadata ->> 'browser'
```

returns:

```text
chrome
```

This:

```sql
metadata ->> 'version'
```

returns:

```text
120
```

Notice that even though `version` is a JSON number, `->>` returns it as TEXT.

---

# 20. ? Operator

The second important operator is:

```sql
metadata ? 'browser'
```

This asks:

> Does this JSONB object contain a key named `browser`?

Example:

```json
{
  "browser": "chrome"
}
```

Result:

```text
TRUE
```

Because `browser` exists.

But:

```json
{
  "user": "Helal"
}
```

returns:

```text
FALSE
```

because there is no `browser` key.

---

# 21. Using ? with WHERE

Our query:

```sql
SELECT 
  event_name,
  metadata ->> 'browser' AS browser
FROM basics.app_events
WHERE metadata ? 'browser';
```

Let's break down the new parts.

First:

```sql
WHERE metadata ? 'browser'
```

means:

```text
Only rows whose metadata contains
the "browser" key.
```

Then:

```sql
metadata ->> 'browser'
```

extracts its value.

So the result could look like:

```text
event_name    browser
----------------------
sign_up       chrome
```

The `sign_in` row is excluded because:

```json
{
  "user": "Helal"
}
```

doesn't contain:

```text
browser
```

---

# 22. Why use ? before ->>?

Consider:

```sql
metadata ->> 'browser'
```

If the key doesn't exist, PostgreSQL can return:

```text
NULL
```

That's not necessarily an error.

But when we only want rows that actually contain the key, we can explicitly filter them:

```sql
WHERE metadata ? 'browser'
```

Then extract the value:

```sql
metadata ->> 'browser'
```

Conceptually:

```text
1. Does "browser" exist?
          ↓
       YES
          ↓
2. Extract its value
          ↓
       "chrome"
```

---

# 23. JSONB vs Normal Columns

Suppose we have:

```sql
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name TEXT,
    browser TEXT,
    age INTEGER
);
```

This is highly structured.

Every field has:

* a defined column
* a defined data type
* a defined schema

This is good when the data structure is stable and important to the application.

---

With JSONB:

```sql
CREATE TABLE events(
    id UUID,
    event_name TEXT,
    metadata JSONB
);
```

The metadata can vary:

```json
{"browser": "chrome"}
```

```json
{"user": "Helal"}
```

```json
{"product_id": 10, "price": 200}
```

This provides flexibility.

---

# 24. Don't Put Everything in JSONB

JSONB is powerful, but you should not automatically put all application data into JSONB.

For example, important user data is usually better represented as normal columns:

```sql
users(
    id,
    name,
    email,
    created_at
)
```

instead of:

```sql
users(
    metadata JSONB
)
```

containing:

```json
{
  "name": "Helal",
  "email": "example@email.com",
  "created_at": "..."
}
```

Why?

Normal relational columns provide:

* stronger structure
* clearer schema
* easier constraints
* easier relationships
* easier querying
* better data integrity

JSONB is most useful when the data is naturally flexible or semi-structured.

---

# 25. A Good Backend Example

Imagine an analytics system.

You want to record events:

```text
sign_up
sign_in
purchase
logout
page_view
```

Different events need different information.

### sign_up

```json
{
  "browser": "chrome",
  "device": "desktop"
}
```

### sign_in

```json
{
  "user": "Helal",
  "method": "google"
}
```

### purchase

```json
{
  "product_id": 25,
  "price": 499.99,
  "currency": "USD"
}
```

Instead of creating a table with dozens of nullable columns:

```text
browser
device
method
product_id
price
currency
...
```

we can have:

```text
event_name
metadata JSONB
```

and allow each event type to have its own metadata.

---

# 26. Complete Example

```sql
DROP TABLE IF EXISTS basics.app_events;

CREATE TABLE basics.app_events(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_name TEXT NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.app_events
    (event_name, metadata)
VALUES
(
    'sign_up',
    '{"browser": "chrome"}'
),
(
    'sign_in',
    '{"user": "Helal"}'
);

SELECT * 
FROM basics.app_events;

SELECT 
    event_name,
    metadata ->> 'browser' AS browser
FROM basics.app_events
WHERE metadata ? 'browser';
```

---

# 27. What Each New Part Does

```sql
id UUID
```

Stores a UUID.

```sql
DEFAULT gen_random_uuid()
```

Automatically generates a UUID when no ID is provided.

```sql
metadata JSONB
```

Stores flexible JSON data.

```sql
'{}'::jsonb
```

Creates an empty JSON object and explicitly casts it to JSONB.

```sql
metadata ->> 'browser'
```

Extracts the `browser` value as TEXT.

```sql
metadata ? 'browser'
```

Checks whether the `browser` key exists.

---

# 28. Quick Mental Model

Think of a JSONB column as a flexible object stored inside a relational table:

```text
Table
│
├── id
│   └── UUID
│
├── event_name
│   └── TEXT
│
└── metadata
    └── JSONB
        │
        ├── browser → "chrome"
        ├── user → "Helal"
        └── other dynamic data
```

Then:

```text
metadata ->> 'browser'
        ↓
   "chrome"
        ↓
      TEXT
```

And:

```text
metadata ? 'browser'
        ↓
   Does the key exist?
        ↓
     TRUE / FALSE
```

---

# 29. Quick Recall

| Concept             | Meaning                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `UUID`              | 128-bit unique identifier                                               |
| `gen_random_uuid()` | Generates a random UUID                                                 |
| `JSON`              | JSON stored as JSON text representation                                 |
| `JSONB`             | Binary/decomposed JSON representation optimized for database operations |
| `{}`                | Empty JSON object                                                       |
| `::`                | PostgreSQL type cast                                                    |
| `'{}'::jsonb`       | Empty JSON object cast to JSONB                                         |
| `->`                | Extract JSON/JSONB                                                      |
| `->>`               | Extract value as TEXT                                                   |
| `?`                 | Check whether a JSONB key exists                                        |

---

# 30. Core Syntax

### UUID

```sql
id UUID DEFAULT gen_random_uuid()
```

### JSONB

```sql
metadata JSONB
```

### JSONB default

```sql
metadata JSONB DEFAULT '{}'::jsonb
```

### Extract JSON value as TEXT

```sql
metadata ->> 'key'
```

### Check whether key exists

```sql
metadata ? 'key'
```

### Combine them

```sql
SELECT
    event_name,
    metadata ->> 'browser' AS browser
FROM basics.app_events
WHERE metadata ? 'browser';
```

---

# Key Takeaways

1. `UUID` gives you large, globally unique-style identifiers instead of sequential integers.
2. `gen_random_uuid()` lets PostgreSQL generate UUIDs automatically.
3. `JSONB` allows a PostgreSQL column to store flexible JSON data.
4. `JSONB` is especially useful for metadata, events, logs, and semi-structured data.
5. `{}` is an empty JSON object, while `NULL` means no value.
6. `::` performs a PostgreSQL type cast.
7. `->` extracts JSON/JSONB.
8. `->>` extracts a JSON value as TEXT.
9. `?` checks whether a JSONB object contains a key.
10. JSONB gives flexibility, but important structured application data should usually remain in normal relational columns.
11. UUIDs and JSONB are particularly common concepts when working with PostgreSQL from backend applications.
