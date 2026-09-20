# Node.js URL & URLSearchParams

## 1. Why do we use `URL`?

When working with APIs and HTTP requests, you'll often need to:

* Parse a URL into its parts.
* Read query parameters.
* Add/update/remove query parameters.
* Build URLs dynamically.

Node.js provides the built-in `URL` and `URLSearchParams` APIs for this.

---

# 2. Creating a URL Object

```ts
const apiUrl = new URL(
  "https://api.acedevhub.com/user?page=2&limit=10&sort=latest"
);
```

`new URL()` converts a URL string into a **URL object** that lets you easily access and modify its parts.

Example URL:

```text
https://api.acedevhub.com/user?page=2&limit=10&sort=latest
```

### Main parts

```text
https://api.acedevhub.com/user?page=2&limit=10&sort=latest
│      │                   │    └───────────────────────────┐
│      │                   │                                │
│      │                   └── pathname                     │
│      └── hostname                                        │
└── protocol                                                │
                                                           │
                                                   query parameters
```

---

# 3. Useful URL Properties

```ts
console.log(apiUrl.href);
console.log(apiUrl.protocol);
console.log(apiUrl.hostname);
console.log(apiUrl.pathname);
console.log(apiUrl.search);
```

| Property   | Example                              | Meaning             |
| ---------- | ------------------------------------ | ------------------- |
| `href`     | `https://api.acedevhub.com/user?...` | Complete URL        |
| `protocol` | `https:`                             | HTTP/HTTPS protocol |
| `hostname` | `api.acedevhub.com`                  | Domain/host         |
| `pathname` | `/user`                              | Path                |
| `search`   | `?page=2&limit=10`                   | Entire query string |

### Example

```ts
console.log(apiUrl.href);
// https://api.acedevhub.com/user?page=2&limit=10&sort=latest

console.log(apiUrl.protocol);
// https:

console.log(apiUrl.hostname);
// api.acedevhub.com

console.log(apiUrl.pathname);
// /user

console.log(apiUrl.search);
// ?page=2&limit=10&sort=latest
```

---

# 4. Query Parameters

Query parameters are the values after `?`.

```text
?page=2&limit=10&sort=latest
```

Here we have:

```text
page  = 2
limit = 10
sort  = latest
```

They are commonly used in APIs for things like:

```text
/users?page=2
/products?category=phones
/users?sort=name
/posts?limit=10
```

---

# 5. `searchParams`

`apiUrl.searchParams` gives you a `URLSearchParams` object for working with the query parameters.

```ts
const page = apiUrl.searchParams.get("page");
const limit = apiUrl.searchParams.get("limit");
const sort = apiUrl.searchParams.get("sort");
```

Result:

```text
page  → "2"
limit → "10"
sort  → "latest"
```

### Important

`get()` returns a **string or `null`**.

```ts
const page = apiUrl.searchParams.get("page");
// string | null
```

It does **not** automatically return a number.

If you need a number:

```ts
const page = Number(apiUrl.searchParams.get("page"));
```

---

# 6. Updating Query Parameters

Use `.set()`:

```ts
apiUrl.searchParams.set("page", "10");
apiUrl.searchParams.set("limit", "20");
```

The URL is automatically updated:

```ts
console.log(apiUrl.href);
```

Result:

```text
https://api.acedevhub.com/user?page=10&limit=20&sort=latest
```

### `set()` does two things

If the parameter already exists:

```ts
params.set("page", "10");
```

→ **updates** it.

If it doesn't exist:

```ts
params.set("search", "Node");
```

→ **adds** it.

---

# 7. Creating `URLSearchParams` from an Object

You can create query parameters without having a complete URL:

```ts
const queryParams = new URLSearchParams({
  search: "Node JS",
  page: "1",
  limit: "5",
});
```

Convert them into a query string:

```ts
console.log(queryParams.toString());
```

Result:

```text
search=Node+JS&page=1&limit=5
```

Notice:

```text
"Node JS"
    ↓
"Node+JS"
```

This is **URL encoding**.

---

# 8. Useful `URLSearchParams` Methods

### `get()`

Read a parameter:

```ts
params.get("page");
```

---

### `set()`

Add or update a parameter:

```ts
params.set("page", "10");
```

---

### `delete()`

Remove a parameter:

```ts
params.delete("page");
```

---

### `has()`

Check whether a parameter exists:

```ts
params.has("page");
```

Returns:

```text
true / false
```

---

### `toString()`

Convert parameters into a query string:

```ts
params.toString();
```

Example:

```text
page=2&limit=10
```

---

# 9. `URL.searchParams` vs `URLSearchParams`

### Existing URL

Use:

```ts
const url = new URL("https://example.com/users?page=2");

url.searchParams.get("page");
```

Here:

```text
URL
 ↓
searchParams
 ↓
get / set / delete / has
```

### Creating query parameters

Use:

```ts
const params = new URLSearchParams({
  page: "2",
  limit: "10",
});
```

Here you are creating the query parameters independently.

---

# 10. Practical Backend Example

Imagine your API receives:

```text
/users?page=2&limit=10
```

You can parse the URL:

```ts
const url = new URL(
  "https://api.example.com/users?page=2&limit=10"
);

const page = Number(url.searchParams.get("page"));
const limit = Number(url.searchParams.get("limit"));

console.log(page);
console.log(limit);
```

Now your backend can use:

```text
page  → 2
limit → 10
```

For example, these values could later be used for **pagination**.

---

# 11. Quick Mental Model

Think of `URL` as a tool for breaking a URL into pieces:

```text
new URL(...)
      ↓
┌─────────────────────────┐
│ protocol                │
│ hostname                │
│ pathname                │
│ search                  │
│ searchParams            │
└─────────────────────────┘
                 ↓
        Query parameters
                 ↓
      get / set / delete / has
```

And:

```text
new URLSearchParams(...)
          ↓
Create/manage query parameters
          ↓
      .toString()
          ↓
page=2&limit=10
```

---

# 12. Key Takeaways

```text
new URL(string)
    → creates a URL object

url.href
    → complete URL

url.protocol
    → https:

url.hostname
    → api.example.com

url.pathname
    → /users

url.search
    → ?page=2&limit=10

url.searchParams
    → work with individual query parameters

searchParams.get()
    → read

searchParams.set()
    → add/update

searchParams.delete()
    → remove

searchParams.has()
    → check existence

searchParams.toString()
    → convert params to query string
```

### Most important backend pattern

```ts
const url = new URL(requestUrl);

const page = url.searchParams.get("page");
const limit = url.searchParams.get("limit");
```

**Mental model:**

> `URL` handles the whole URL, while `URLSearchParams` handles the query parameters.
