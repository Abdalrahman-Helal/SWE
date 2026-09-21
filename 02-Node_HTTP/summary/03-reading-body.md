# Node.js HTTP Server — Reading & Validating Request Body

## 1. Basic Setup

```ts
import http, { IncomingMessage, ServerResponse } from "node:http";

const PORT = 5002;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    // request handling
  }
);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Important

* `req` → incoming HTTP request.
* `res` → outgoing HTTP response.
* `req` contains:

  * HTTP method
  * URL
  * headers
  * request body
* `res` is used to:

  * set status code
  * set headers
  * send response

---

# 2. Reading the URL

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
POST http://localhost:5002/users?id=10
```

Then:

```ts
method   // "POST"
pathName // "/users"
```

`pathname` ignores the query string.

---

# 3. Routing

```ts
if (method === "POST" && pathName === "/users") {
```

This means:

> Only execute this code when the request is a `POST` request to `/users`.

Example:

```text
POST /users   → handled
GET  /users   → not handled
POST /posts   → not handled
```

---

# 4. Request Body Is a Stream

The request body may not arrive as one piece.

It can arrive like:

```text
Request Body
    ↓
chunk 1
chunk 2
chunk 3
...
```

Therefore:

```ts
const chunks: Buffer[] = [];
```

creates an array to store the received chunks.

---

# 5. `data` Event

```ts
req.on("data", (chunk: Buffer) => {
  chunks.push(chunk);
});
```

`req` is a readable stream / EventEmitter.

`"data"` is a standard event emitted by Node when a new piece of data arrives.

Conceptually:

```text
chunk arrives
     ↓
"data" event
     ↓
callback runs
     ↓
chunk.push()
```

Example:

```text
chunk 1 → chunks.push(chunk1)
chunk 2 → chunks.push(chunk2)
chunk 3 → chunks.push(chunk3)
```

---

# 6. `end` Event

```ts
req.on("end", () => {
  // body is completely received
});
```

`"end"` means:

> No more request body data is coming.

Only after `end` can we safely combine all the chunks.

```text
data → data → data → data → end
                       ↓
                 full body ready
```

---

# 7. Combining the Chunks

```ts
const rawBody = Buffer
  .concat(chunks)
  .toString("utf-8");
```

Two steps:

### `Buffer.concat(chunks)`

Combines:

```text
Buffer 1
Buffer 2
Buffer 3
```

into:

```text
One Buffer
```

### `.toString("utf-8")`

Converts the bytes into a JavaScript string.

So:

```text
HTTP body
   ↓
Buffers
   ↓
Buffer.concat()
   ↓
String
   ↓
rawBody
```

Example:

```ts
rawBody
```

might contain:

```json
{"name":"Abdalrahman","email":"test@gmail.com"}
```

---

# 8. Check for Empty Body

```ts
if (!rawBody) {
  res.statusCode = 400;
  res.end("req body is required");
  return;
}
```

If the client sends no body:

```ts
rawBody === ""
```

Then:

```ts
!rawBody
```

is `true`.

### Why 400?

`400 Bad Request` means the client sent an invalid/incomplete request.

The route exists, but the required data is missing.

### Why `return`?

```ts
res.end(...);
return;
```

`res.end()` finishes the response.

`return` stops the current callback so the rest of the code doesn't execute.

---

# 9. Parse JSON

```ts
const body = JSON.parse(rawBody) as CreateUserBody;
```

`rawBody` is currently a **string**.

Example:

```ts
'{"name":"Abdalrahman","email":"test@gmail.com"}'
```

`JSON.parse()` converts the JSON string into a JavaScript object:

```ts
{
  name: "Abdalrahman",
  email: "test@gmail.com"
}
```

Mental model:

```text
JSON string
    ↓
JSON.parse()
    ↓
JavaScript object
```

---

# 10. `as CreateUserBody`

```ts
JSON.parse(rawBody) as CreateUserBody
```

This is a **TypeScript type assertion**.

```ts
type CreateUserBody = {
  name?: string;
  email?: string;
};
```

It tells TypeScript:

> Treat this parsed value as `CreateUserBody`.

### Important

`as` does NOT:

* validate the object
* convert the object
* check that `name` exists
* check that `email` exists

Runtime validation is done separately:

```ts
if (!body.name || !body.email) {
```

---

# 11. Validate Required Fields

```ts
if (!body.name || !body.email) {
  res.statusCode = 400;
  res.end("both name and email are required");
  return;
}
```

Meaning:

> If `name` is missing OR `email` is missing, reject the request.

Examples:

```json
{
  "name": "Abdalrahman",
  "email": "test@gmail.com"
}
```

✅ Valid

```json
{
  "name": "Abdalrahman"
}
```

❌ Missing email

```json
{
  "email": "test@gmail.com"
}
```

❌ Missing name

```json
{}
```

❌ Both missing

---

# 12. Successful Response

```ts
res.statusCode = 201;

res.end(
  `User Created ${body.name} and ${body.email}`
);
```

`201 Created` means the request successfully resulted in creating a resource.

---

# 13. `try/catch`

```ts
req.on("end", () => {
  try {
    // parsing + validation
  } catch {
    res.statusCode = 400;
    res.end("Invalid JSON body");
  }
});
```

The important operation here is:

```ts
JSON.parse(rawBody)
```

Invalid JSON causes `JSON.parse()` to throw an error.

Example:

```json
{"name":"Ahmed"
```

This is invalid JSON.

Therefore:

```text
JSON.parse()
    ↓
throws error
    ↓
catch
    ↓
400 Invalid JSON body
```

---

# 14. Request Stream Error

```ts
req.on("error", () => {
  res.statusCode = 500;
  res.end("Failed to read request body");
});
```

This is different from invalid JSON.

### `try/catch`

Handles problems such as:

```text
Invalid JSON
     ↓
JSON.parse() throws
     ↓
catch
     ↓
400
```

### `req.on("error")`

Handles an error while **reading the request stream itself**:

```text
Request stream
     ↓
I/O / connection / stream error
     ↓
"error" event
     ↓
500
```

---

# 15. Why `return` After Registering Events?

```ts
req.on("data", ...);
req.on("end", ...);
req.on("error", ...);

return;
```

The callbacks are asynchronous event handlers.

Registering them doesn't immediately read the complete body.

We are saying:

> "Node, whenever data/end/error happens, execute these callbacks."

Then `return` exits the current request handler.

Later Node emits the events.

---

# 16. Complete Flow

For:

```text
POST /users
```

with:

```json
{
  "name": "Abdalrahman",
  "email": "test@gmail.com"
}
```

the flow is:

```text
HTTP Request
     ↓
createServer callback
     ↓
Check method + pathname
     ↓
POST /users?
     ↓
Register data/end/error listeners
     ↓
data event
     ↓
receive chunks
     ↓
data event
     ↓
receive more chunks
     ↓
end event
     ↓
Buffer.concat(chunks)
     ↓
.toString("utf-8")
     ↓
rawBody
     ↓
JSON.parse()
     ↓
JavaScript object
     ↓
Validate name + email
     ↓
201 Created
```

---

# 17. Error Flow

### Empty body

```text
empty body
   ↓
!rawBody
   ↓
400
```

### Invalid JSON

```text
rawBody
   ↓
JSON.parse()
   ↓
throws
   ↓
catch
   ↓
400
```

### Missing fields

```text
JSON.parse()
   ↓
object
   ↓
missing name/email
   ↓
400
```

### Request stream error

```text
request stream error
   ↓
"error" event
   ↓
500
```

---

# 18. Status Codes Used

| Status | Meaning               | Used here                          |
| ------ | --------------------- | ---------------------------------- |
| `201`  | Created               | User successfully created          |
| `400`  | Bad Request           | Missing/invalid client data        |
| `500`  | Internal Server Error | Request stream/server-side failure |

---

# 19. Core Mental Model

The most important thing to remember:

```text
req.body
   ↓
comes as a Stream
   ↓
data events
   ↓
Buffer chunks
   ↓
Buffer.concat()
   ↓
String
   ↓
JSON.parse()
   ↓
Object
   ↓
Validation
   ↓
Business logic
   ↓
Response
```

### The 3 request events

```ts
req.on("data", ...)
```

**A chunk arrived.**

```ts
req.on("end", ...)
```

**All chunks arrived.**

```ts
req.on("error", ...)
```

**The request stream encountered an error.**

These event names are standard Node.js events. The callback you provide is your own code.

---

## Key Takeaways

1. **Request body is a stream**, not necessarily one complete object.
2. `"data"` gives you chunks.
3. `"end"` means the complete body has arrived.
4. `Buffer.concat()` combines the chunks.
5. `.toString()` converts bytes to text.
6. `JSON.parse()` converts JSON text → JavaScript object.
7. `as CreateUserBody` only affects TypeScript's type checking; it does not validate data.
8. `if (!body.name || !body.email)` performs basic runtime validation.
9. `try/catch` handles exceptions such as invalid JSON.
10. `req.on("error")` handles errors from the request stream itself.
11. `return` prevents the current callback from continuing after sending a response.
12. `400` = bad client request; `500` = server/stream failure.
