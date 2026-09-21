# Node.js HTTP Server — Basic Routing

## 1. Imports

```ts
import http, {
  IncomingMessage,
  ServerResponse
} from 'node:http';
```

* `http` → Node.js built-in HTTP module.
* `IncomingMessage` → TypeScript type for the incoming request.
* `ServerResponse` → TypeScript type for the response.

> `createServer` and `path` are not needed in this example.

---

## 2. Create the HTTP Server

```ts
const server = http.createServer((req, res) => {
  // handle request
});
```

`createServer()` receives a callback that runs **every time a request arrives**.

Think:

```text
Client / Postman
      ↓
HTTP Request
      ↓
createServer callback
      ↓
(req, res)
```

---

## 3. HTTP Method

```ts
const method = req.method ?? "GET";
```

`req.method` tells you what the client wants to do:

```text
GET     → retrieve data
POST    → create data
PUT     → replace/update data
PATCH   → partially update data
DELETE  → delete data
```

The `?? "GET"` means:

> If `req.method` is `null` or `undefined`, use `"GET"`.

---

## 4. Parse the URL

```ts
const requestUrl = new URL(
  req.url ?? "/",
  `http://${req.headers.host}`
);
```

For:

```text
http://localhost:5000/users?id=1
```

You can get:

```ts
requestUrl.pathname
// "/users"

requestUrl.search
// "?id=1"

requestUrl.searchParams.get("id")
// "1"
```

### Why use `URL`?

Instead of manually splitting:

```text
/users?id=1
```

the `URL` class separates the URL parts for you.

---

## 5. Get the Path

```ts
const pathName = requestUrl.pathname;
```

Examples:

```text
/users       → /users
/users?id=1  → /users
/health      → /health
```

Important:

```text
pathname ≠ query parameters
```

---

## 6. Set Response Headers

```ts
res.setHeader('Content-Type', 'text/plain');
```

This tells the client:

> The response body is plain text.

For JSON APIs, you'll commonly use:

```ts
res.setHeader('Content-Type', 'application/json');
```

---

# 7. Basic Routing

You can manually match:

```text
HTTP Method + Path
```

### GET `/health`

```ts
if (method === 'GET' && pathName === '/health') {
  res.statusCode = 200;
  res.end('Server is healthy');
  return;
}
```

The route is:

```text
GET /health
```

Response:

```text
200 OK
Server is healthy
```

---

### POST `/users`

```ts
if (method === 'POST' && pathName === '/users') {
  res.statusCode = 201;
  res.end('User created successfully');
  return;
}
```

The route is:

```text
POST /users
```

`201 Created` is commonly used when a resource was successfully created.

---

# 8. Default 404 Response

If none of the routes matched:

```ts
res.statusCode = 404;
res.end('Not Found');
```

So:

```text
GET /unknown
       ↓
No matching route
       ↓
404 Not Found
```

---

# 9. Why `return`?

Example:

```ts
if (method === 'GET' && pathName === '/health') {
  res.statusCode = 200;
  res.end('Server is healthy');
  return;
}
```

`res.end()` sends/finishes the response, but `return` is still useful because it stops your callback from continuing into the remaining routing logic.

Mental model:

```text
Match route
   ↓
Send response
   ↓
return
   ↓
Stop processing this request
```

---

# 10. Start the Server

```ts
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

The server starts listening for requests on:

```text
http://localhost:5000
```

---

# 11. Testing with Postman

### Health check

```http
GET http://localhost:5000/health
```

Expected:

```text
200
Server is healthy
```

### Create user

```http
POST http://localhost:5000/users
```

Expected:

```text
201
User created successfully
```

### Unknown route

```http
GET http://localhost:5000/users
```

Expected:

```text
404
Not Found
```

---

# 12. The Request Flow

```text
Postman
   │
   │ GET /health
   ▼
Node HTTP Server
   │
   ├── req.method → GET
   │
   ├── req.url → /health
   │
   ├── URL → pathname = /health
   │
   ▼
Route matching
   │
   ├── GET /health ✓
   │
   ▼
res.statusCode = 200
res.end("Server is healthy")
   │
   ▼
Postman receives response
```

---

# Key Takeaways

Remember these:

```ts
req.method
```

→ HTTP method.

```ts
req.url
```

→ Raw URL/path + query string.

```ts
new URL(...)
```

→ Parse the URL properly.

```ts
requestUrl.pathname
```

→ Get the path without query parameters.

```ts
requestUrl.searchParams
```

→ Work with query parameters.

```ts
res.statusCode
```

→ Set HTTP status code.

```ts
res.setHeader(...)
```

→ Set response headers.

```ts
res.end(...)
```

→ Send/finalize the response.

```ts
server.listen(...)
```

→ Start listening for requests.

---

## Core Mental Model

For basic Node.js HTTP routing, think:

```text
Request
   ↓
method + URL
   ↓
parse URL
   ↓
match route
   ↓
status code + headers
   ↓
response body
   ↓
res.end()
```

This is the foundation that frameworks like **Express** later make easier.
