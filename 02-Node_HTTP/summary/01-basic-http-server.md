# Node.js HTTP Server — Fundamentals

## 1. The Big Picture

Node.js can create an HTTP server directly using the built-in `node:http` module.

The basic communication looks like this:

```text
Client (Browser / Postman / Frontend)
              |
              | HTTP Request
              |-------------------->
              |
          Node.js Server
              |
              | HTTP Response
              |<--------------------
              |
Client receives the response
```

The request contains information such as:

* HTTP method
* URL/path
* Headers
* Body

The response contains:

* Status code
* Headers
* Body

---

# 2. Importing the HTTP Module

```ts
import http, {
  IncomingMessage,
  ServerResponse,
} from "node:http";
```

`node:http` is a built-in Node.js module.

You don't need to install it with npm.

It provides the functionality needed to create low-level HTTP servers.

### Important parts

```ts
http.createServer()
```

Creates an HTTP server.

```ts
IncomingMessage
```

Represents the incoming HTTP request.

```ts
ServerResponse
```

Represents the response that the server will send back.

So:

```text
IncomingMessage → Request
ServerResponse  → Response
```

---

# 3. Creating the Server

```ts
const server = http.createServer((req, res) => {
  // request handling logic
});
```

`createServer()` receives a callback.

This callback runs whenever a new HTTP request reaches the server.

```ts
(req, res) => {
  
}
```

Think about it as:

```text
A request arrives
      ↓
Node calls this function
      ↓
(req, res) are provided by Node
```

### Important

The callback is **not executed only once**.

If 10 requests arrive:

```text
Request 1 → callback()
Request 2 → callback()
Request 3 → callback()
...
Request 10 → callback()
```

The callback handles each incoming request.

---

# 4. The `req` Object

```ts
(req: IncomingMessage, res: ServerResponse)
```

`req` means:

> Request

It contains information about what the client sent to the server.

For example, a browser might send something conceptually like:

```http
GET /users HTTP/1.1
Host: localhost:5000
User-Agent: Firefox
Accept: text/html
```

Node.js gives us access to this information through `req`.

Common properties:

```ts
req.method
req.url
req.headers
```

Later, we will also use:

```ts
req.on("data", ...)
req.on("end", ...)
```

to read request bodies.

---

# 5. HTTP Method

```ts
const method = req.method;
```

The HTTP method describes what the client wants to do.

Common methods:

| Method   | Typical Purpose       |
| -------- | --------------------- |
| `GET`    | Read data             |
| `POST`   | Create data           |
| `PUT`    | Replace existing data |
| `PATCH`  | Partially update data |
| `DELETE` | Delete data           |

Example:

```http
GET /users
```

Usually means:

> Give me the users.

While:

```http
POST /users
```

usually means:

> Create a new user.

### Important

The method itself doesn't magically perform the operation.

Your server code decides what to do with it.

For example:

```ts
if (req.method === "GET") {
  // read data
}
```

---

# 6. The URL

```ts
const url = req.url;
```

`req.url` tells us which path the client requested.

Examples:

```text
/users
/products
/orders
/users/10
/products/25
```

If the client requests:

```text
http://localhost:5000/users
```

the value of:

```ts
req.url
```

will normally be:

```text
/users
```

This becomes especially important when we start implementing **routing**.

For example:

```ts
if (method === "GET" && url === "/users") {
  // return users
}
```

Now the server can behave differently depending on the requested endpoint.

---

# 7. Request Headers

HTTP requests can contain headers.

Headers are metadata about the request.

Example:

```http
GET /users HTTP/1.1
Host: localhost:5000
User-Agent: Firefox
Accept: application/json
Content-Type: application/json
```

You can access them through:

```ts
req.headers
```

For example:

```ts
const userAgent = req.headers["user-agent"];
```

This retrieves the `User-Agent` header.

The value might contain information about the browser/client.

### Another example

```ts
const contentType = req.headers["content-type"];
```

This can tell us what type of data the client sent.

For example:

```text
application/json
```

---

# 8. Request Body

The request can also contain a body.

The body is usually used when the client sends data to the server.

For example:

```http
POST /users
Content-Type: application/json

{
  "name": "Abdalrahman",
  "age": 22
}
```

The JSON object is the **request body**.

With the low-level `node:http` module, the body is handled as a stream.

You will commonly see:

```ts
req.on("data", ...)
req.on("end", ...)
```

We don't need to implement that yet.

Just remember:

```text
Request
│
├── method
├── url
├── headers
└── body
```

---

# 9. The `res` Object

`res` means:

> Response

It is used to construct and send the response back to the client.

Think about the difference:

```text
req → information coming INTO the server

res → information going OUT of the server
```

For example:

```ts
res.statusCode = 200;

res.setHeader("Content-Type", "text/plain");

res.end("Hello");
```

This creates a response.

---

# 10. HTTP Status Code

```ts
res.statusCode = 200;
```

The status code tells the client what happened with the request.

Some impor
