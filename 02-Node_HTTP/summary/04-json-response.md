# Node.js HTTP API — JSON Responses & Generics

## 1. Imports & Server Setup

```ts
import http, { IncomingMessage, ServerResponse } from "node:http";

const PORT = 5003;
```

* `http` → Node.js HTTP module.
* `IncomingMessage` → type of the incoming request (`req`).
* `ServerResponse` → type of the outgoing response (`res`).

---

# 2. User Type

```ts
type User = {
  id: number;
  name: string;
  email: string;
};
```

Defines the structure of a user.

Example:

```ts
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com"
};
```

TypeScript will make sure the object follows the `User` structure.

---

# 3. Generic API Response

```ts
type ApiResponse<T> = {
  sucess: boolean;
  message: string;
  data?: T;
  error?: string;
};
```

`T` is a **generic type parameter**.

It means:

> `ApiResponse` can contain different types of `data`.

### Example

```ts
ApiResponse<User>
```

means:

```ts
data?: User;
```

While:

```ts
ApiResponse<User[]>
```

means:

```ts
data?: User[];
```

And:

```ts
ApiResponse<string[]>
```

means:

```ts
data?: string[];
```

### Mental model

```text
ApiResponse<T>
       ↓
   T = actual data type
       ↓
ApiResponse<User>
       ↓
data?: User
```

---

# 4. Optional Properties

```ts
data?: T;
error?: string;
```

The `?` means the property is optional.

Therefore this is valid:

```ts
{
  sucess: true,
  message: "Success",
  data: users
}
```

And this is also valid:

```ts
{
  sucess: false,
  message: "Something went wrong",
  error: "User not found"
}
```

A successful response doesn't necessarily need `error`, and an error response doesn't necessarily need `data`.

---

# 5. Users Array

```ts
const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com"
  }
];
```

`User[]` means:

> An array containing only `User` objects.

This is currently acting as an **in-memory database**.

It disappears when the server restarts.

---

# 6. Reusable `sendJson()` Function

```ts
function sendJson<T>(
  res: ServerResponse,
  statusCode: number,
  body: ApiResponse<T>,
): void {
  res.statusCode = statusCode;

  res.setHeader("Content-Type", "application/json");

  res.end(JSON.stringify(body));
}
```

This function prevents repeating the same response code in every route.

Instead of:

```ts
res.statusCode = 200;
res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify(...));
```

every time, we simply do:

```ts
sendJson(res, 200, {...});
```

---

# 7. Why Is `sendJson()` Generic?

```ts
function sendJson<T>(
  ...
  body: ApiResponse<T>
)
```

Because different endpoints can return different data.

For example:

```ts
sendJson<User>(res, 200, {
  sucess: true,
  message: "User fetched",
  data: user
});
```

Here:

```text
T = User
```

Another route:

```ts
sendJson<User[]>(res, 200, {
  sucess: true,
  message: "Users fetched",
  data: users
});
```

Here:

```text
T = User[]
```

So the function is reusable for different response data types.

---

# 8. JSON Response

```ts
res.setHeader("Content-Type", "application/json");
```

Tells the client:

> The response body is JSON.

Then:

```ts
res.end(JSON.stringify(body));
```

converts the JavaScript object into a JSON string and sends it.

Mental model:

```text
JavaScript Object
       ↓
JSON.stringify()
       ↓
JSON string
       ↓
HTTP Response
```

Example object:

```ts
{
  sucess: true,
  message: "server is running"
}
```

becomes:

```json
{
  "sucess": true,
  "message": "server is running"
}
```

---

# 9. Creating the Server

```ts
const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
```

For every incoming HTTP request, Node calls this callback.

```text
Client
   ↓
HTTP Request
   ↓
createServer callback
   ↓
req + res
```

---

# 10. Getting Method & Path

```ts
const method = req.method ?? "GET";

const requestUrl = new URL(
  req.url ?? "/",
  `http://${req.headers.host}`
);

const pathName = requestUrl.pathname;
```

Example:

```text
GET http://localhost:5003/users
```

Results:

```ts
method   // "GET"
pathName // "/users"
```

---

# 11. Root Route

```ts
if (method === "GET" && pathName === "/") {
```

Only handles:

```text
GET /
```

Then:

```ts
sendJson(res, 200, {
  sucess: true,
  message: "server is running",
  data: {
    routes: ["GET/users"],
  },
});
```

The response contains:

```json
{
  "sucess": true,
  "message": "server is running",
  "data": {
    "routes": ["GET/users"]
  }
}
```

Notice TypeScript can infer:

```text
T = { routes: string[] }
```

You don't need to explicitly write the generic here.

---

# 12. Get All Users

```ts
if (method === "GET" && pathName === "/users") {
  sendJson(res, 200, {
    sucess: true,
    message: "user fetched successfully",
    data: users
  });

  return;
}
```

Here:

```ts
data: users
```

and:

```ts
users: User[]
```

So TypeScript can infer:

```text
T = User[]
```

Therefore this becomes conceptually:

```ts
ApiResponse<User[]>
```

---

# 13. Why `return`?

```ts
sendJson(...);
return;
```

`sendJson()` calls:

```ts
res.end(...)
```

which finishes the HTTP response.

The `return` prevents execution from continuing to the fallback route.

Without it, the code could reach:

```ts
sendJson(res, 404, ...)
```

after already sending the successful response.

---

# 14. Fallback 404 Route

```ts
sendJson<null>(res, 404, {
  sucess: false,
  message: "Route not found",
  error: `${method} and ${pathName} is not exists`
});
```

If no previous route matched, this is executed.

Example:

```text
GET /products
```

Since `/products` isn't implemented:

```text
404
```

Response:

```json
{
  "sucess": false,
  "message": "Route not found",
  "error": "GET and /products is not exists"
}
```

---

# 15. Why `sendJson<null>`?

Here you're explicitly saying:

```ts
T = null
```

So:

```ts
ApiResponse<null>
```

means:

```ts
data?: null;
```

There is no `data` in this error response, so the generic isn't particularly important here.

You could also structure the API response type differently later so error responses don't need this.

---

# 16. Overall Request Flow

```text
HTTP Request
     ↓
createServer()
     ↓
Get method + pathname
     ↓
 ┌───────────────┐
 │ Match route?  │
 └───────┬───────┘
         ↓
   ┌─────┴─────┐
   ↓           ↓
 GET /      GET /users
   ↓           ↓
sendJson    sendJson
   ↓           ↓
  200         200
   │           │
   └─────┬─────┘
         ↓
       return

If no route matches:
         ↓
       404
         ↓
     sendJson()
```

---

# 17. The Big Backend Pattern

This code introduces an important pattern you'll use constantly with Express, Fastify, NestJS, etc.:

```text
Request
   ↓
Routing
   ↓
Business Logic
   ↓
Response
```

And your response has a consistent structure:

### Success

```json
{
  "sucess": true,
  "message": "Users fetched successfully",
  "data": [...]
}
```

### Error

```json
{
  "sucess": false,
  "message": "Route not found",
  "error": "..."
}
```

This consistency makes APIs easier for frontend clients to consume.

---

# Key Takeaways

### `ApiResponse<T>`

Generic response type:

```ts
ApiResponse<User>
ApiResponse<User[]>
ApiResponse<string[]>
```

### `sendJson<T>()`

Reusable function for sending JSON:

```ts
sendJson(res, 200, {
  sucess: true,
  message: "Success",
  data: users
});
```

TypeScript can usually infer `T` automatically.

### `JSON.stringify()`

```text
JavaScript object → JSON string
```

### `Content-Type`

```ts
"application/json"
```

tells the client that the response contains JSON.

### Routing

```ts
method === "GET" && pathName === "/users"
```

matches a specific HTTP route.

### `return`

Stops the current request handler after sending the response.

### `404`

Used when no implemented route matches the request.

> **Note:** `sucess` is misspelled. In a real API, use `success`.
