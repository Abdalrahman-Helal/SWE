# Express.js — Backend Setup & Core Concepts

> **Goal:** Learn Express.js as a Backend Developer, not just memorize syntax.
>
> Focus on: **how things work, why we use them, real projects, debugging, interviews, and production practices.**

---

# 1. Big Picture

Express.js is a Node.js framework used to build:

* REST APIs
* Backend servers
* Web applications
* Authentication systems
* APIs connected to databases

The basic backend flow:

```text
Client
   ↓
HTTP Request
   ↓
Express
   ↓
Middleware
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Database
   ↓
Response
```

The important thing is understanding what happens to a request from beginning to end.

---

# 2. Project Structure

A practical Express project can look like:

```text
FinalProject/
│
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── lib/
│   │   └── logger.ts
│   │
│   ├── routes/
│   │   ├── index.ts
│   │   ├── healthRoute.ts
│   │   ├── userRoute.ts
│   │   └── authRoute.ts
│   │
│   ├── controllers/
│   │   └── userController.ts
│   │
│   ├── services/
│   │   └── userService.ts
│   │
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   └── auth.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── dist/
├── .env
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Why separate files?

This is **Separation of Concerns**.

Each part has a specific responsibility:

```text
routes       → Which URL should handle the request?

controllers  → Handle HTTP request/response

services     → Business logic

database     → Data access

middlewares  → Logic that runs during the request pipeline

config       → Application configuration

lib          → Reusable infrastructure utilities

app.ts       → Configure Express

server.ts    → Start the server
```

The goal is not to create folders for the sake of folders.

The goal is to keep responsibilities separated so the application remains easy to understand and maintain.

---

# 3. Setup

```bash
npm init -y

npx tsc --init

npm install express dotenv cors pino

npm install -D typescript tsx @types/node @types/express @types/cors pino-pretty
```

Useful scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

Run development server:

```bash
npm run dev
```

Build TypeScript:

```bash
npm run build
```

Run production build:

```bash
npm start
```

Mental model:

```text
dev   → develop
build → compile TypeScript
start → run compiled JavaScript
```

---

# 4. TypeScript + ESM

For this project:

```json
{
  "type": "module"
}
```

And TypeScript:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "es2022",

    "types": ["node"],

    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,

    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Use ESM imports:

```ts
import express from "express";
```

For local imports with NodeNext:

```ts
import { env } from "./config/env.js";
```

Important idea:

```text
package.json
     +
tsconfig.json
     +
import/export syntax
     ↓
must agree about the module system
```

---

# 5. Environment Variables

Use `.env` for configuration that can change between environments:

```env
PORT=4000
NODE_ENV=development
LOG_LEVEL=debug
```

Load them:

```ts
import dotenv from "dotenv";

dotenv.config();
```

Then:

```ts
process.env.PORT
```

A clean approach is to centralize configuration:

```ts
import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),

  isProduction:
    (process.env.NODE_ENV ?? "development") === "production",

  nodeEnv:
    process.env.NODE_ENV ?? "development",

  logLevel:
    process.env.LOG_LEVEL ?? "info",
} as const;
```

Mental model:

```text
.env
 ↓
dotenv.config()
 ↓
process.env
 ↓
env object
 ↓
rest of application
```

Why centralize it?

Instead of:

```ts
process.env.PORT
process.env.NODE_ENV
process.env.LOG_LEVEL
```

everywhere, the application uses:

```ts
env.port
env.nodeEnv
env.logLevel
```

This makes configuration easier to manage and test.

---

# 6. Express App

`app.ts` is responsible for configuring Express.

```ts
import express from "express";
import cors from "cors";

import { apiRouter } from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  app.use(notFound);

  app.use(errorHandler);

  return app;
}
```

The important concept:

```ts
const app = express();
```

creates the Express application.

Then:

```ts
app.use(...)
```

registers middleware.

---

# 7. Middleware

Middleware is one of the most important Express concepts.

A middleware is a function that runs during the request/response lifecycle.

Conceptually:

```text
Request
   ↓
Middleware 1
   ↓
Middleware 2
   ↓
Route
   ↓
Response
```

Example:

```ts
app.use(express.json());
```

This middleware parses JSON request bodies.

Another example:

```ts
app.use(cors());
```

This handles CORS-related HTTP behavior.

A middleware can:

1. Modify the request
2. Modify the response
3. End the request
4. Pass control to the next middleware
5. Pass an error to the error handler

---

# 8. Request Body

## JSON

For:

```http
POST /users
Content-Type: application/json
```

Body:

```json
{
  "name": "Ahmed",
  "age": 22
}
```

Use:

```ts
app.use(express.json());
```

Then:

```ts
req.body
```

contains:

```ts
{
  name: "Ahmed",
  age: 22
}
```

---

## URL Encoded

For traditional HTML forms:

```http
Content-Type: application/x-www-form-urlencoded
```

Example:

```text
name=Ahmed&age=22
```

Use:

```ts
app.use(express.urlencoded({ extended: true }));
```

Then:

```ts
req.body
```

contains the parsed values.

For most modern REST APIs, JSON is much more common.

---

# 9. CORS

CORS means:

```text
Cross-Origin Resource Sharing
```

Imagine:

```text
Frontend
http://localhost:3000

Backend
http://localhost:4000
```

Different ports mean different origins.

The browser applies security rules when JavaScript on one origin tries to access another origin.

Enable CORS:

```ts
app.use(cors());
```

You can restrict the allowed origin:

```ts
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
```

Important:

```text
CORS ≠ Authentication
CORS ≠ Authorization
```

CORS controls which browser origins are allowed to access the API.

Authentication determines **who you are**.

Authorization determines **what you are allowed to do**.

---

# 10. Routing

A route connects an HTTP method + URL to a handler.

Example:

```ts
healthRouter.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Health route is working",
  });
});
```

This means:

```text
GET /health
```

calls this handler.

Common HTTP methods:

```text
GET     → retrieve data
POST    → create data
PUT     → replace/update data
PATCH   → partially update data
DELETE  → delete data
```

---

# 11. Router

Instead of putting every route inside `app.ts`, use Express routers.

```ts
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Health route is working",
  });
});
```

Then combine routers:

```ts
import { Router } from "express";
import { healthRouter } from "./healthRoute.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
```

Then mount the main router:

```ts
app.use("/api", apiRouter);
```

So:

```text
app.use("/api", apiRouter)
             +
healthRouter.get("/health")
             ↓
GET /api/health
```

This is called **route composition**.

---

# 12. Route Parameters

Used when a value is part of the resource URL.

Example:

```http
GET /users/42
```

Route:

```ts
router.get("/users/:id", (req, res) => {
  console.log(req.params.id);
});
```

Result:

```ts
req.params.id
// "42"
```

Mental model:

```text
/users/:id
        ↑
      dynamic value
```

---

# 13. Query Parameters

Used for filtering, searching, sorting, pagination, etc.

Example:

```http
GET /users?page=2&limit=10
```

Access:

```ts
req.query.page
req.query.limit
```

Typical use:

```text
GET /products?category=phones
GET /users?page=2&limit=20
GET /posts?search=node
GET /products?sort=price
```

Mental model:

```text
Route Params
/users/42
    ↓
req.params

Query Params
/users?page=2
    ↓
req.query

Body
POST /users
{ "name": "Ahmed" }
    ↓
req.body
```

This distinction is very important for interviews.

---

# 14. notFound Middleware

If no route matches the request, we return `404`.

```ts
import type { Request, Response } from "express";

export function notFound(
  _req: Request,
  res: Response
): void {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}
```

Order matters.

It should come **after the routes**:

```ts
app.use("/api", apiRouter);

app.use(notFound);
```

Flow:

```text
Request
   ↓
Routes
   ↓
Did a route match?
   ├── YES → Route handles request
   │
   └── NO
        ↓
      notFound
        ↓
       404
```

---

# 15. Error Handling

Errors are different from unknown routes.

An unknown route:

```text
No matching endpoint
        ↓
       404
```

An application error:

```text
Route exists
   ↓
Something fails
   ↓
Error Handler
   ↓
500
```

Error middleware has a special signature:

```ts
(err, req, res, next)
```

Example:

```ts
import {
  Request,
  Response,
  type NextFunction,
} from "express";

import { logger } from "../lib/logger.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({ err }, "Unhandled error");

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
```

Important:

```ts
err
```

is the error that reached the error middleware.

---

# 16. How Does Express Know an Error Happened?

A middleware can pass an error using:

```ts
next(new Error("Something went wrong"));
```

Express then moves to the error-handling middleware.

Conceptually:

```text
Route
  ↓
Error occurs
  ↓
next(error)
  ↓
Express
  ↓
errorHandler(err, req, res, next)
```

Code can also throw:

```ts
throw new Error("Database connection failed");
```

The important concept is that the error must enter Express's error-handling flow.

---

# 17. 404 vs 500

This is an important interview distinction.

### 404

The requested resource/route was not found.

Example:

```http
GET /api/does-not-exist
```

Response:

```json
{
  "success": false,
  "message": "Route not found"
}
```

### 500

The server encountered an unexpected error.

Example:

```text
GET /api/users
       ↓
Database fails
       ↓
500 Internal Server Error
```

Current simple error handler:

```ts
res.status(500)
```

means every unhandled error becomes `500`.

Later, production applications usually introduce custom application errors:

```ts
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
  }
}
```

Then:

```ts
throw new AppError("User not found", 404);
```

The error handler can use:

```ts
err.statusCode
```

This allows different errors to return different HTTP status codes.

---

# 18. Logging

Use a proper logger instead of relying only on:

```ts
console.log()
```

Pino:

```ts
import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.logLevel,

  ...(env.isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }),
});
```

Mental model:

```text
Application
    ↓
Pino
    ↓
Development → pretty logs
Production  → structured logs
```

Useful levels:

```text
debug
info
warn
error
fatal
```

Example:

```ts
logger.info("Server started");

logger.warn("User attempted invalid action");

logger.error({ err }, "Database error");
```

Important production idea:

**Logs are for developers/operations, not for the API client.**

For example:

```text
Server log:
DatabaseError: connection timeout...
stack trace...

Client response:
{
  "success": false,
  "message": "Internal server error"
}
```

Don't expose sensitive internal details to clients.

---

# 19. app.ts vs server.ts

This separation is important.

## app.ts

Creates and configures Express:

```ts
export function createApp() {
  const app = express();

  // middleware
  // routes
  // error handling

  return app;
}
```

## server.ts

Starts the actual server:

```ts
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

const app = createApp();

app.listen(env.port, () => {
  logger.info(
    `Server is running on port http://localhost:${env.port}`
  );
});
```

Mental model:

```text
app.ts
→ Build the application

server.ts
→ Start the application
```

Analogy:

```text
app.ts    → تجهيز العربية
server.ts → تشغيل العربية
```

This separation also makes testing easier because you can import the app without automatically starting a network server.

---

# 20. Complete Request Flow

For:

```http
GET /api/health
```

The request flows approximately like:

```text
Client
  ↓
server.ts
  ↓
Express app
  ↓
cors()
  ↓
express.json()
  ↓
express.urlencoded()
  ↓
/api
  ↓
apiRouter
  ↓
healthRouter
  ↓
GET /health
  ↓
Response
```

Response:

```json
{
  "success": true,
  "message": "Health route is working"
}
```

For an unknown route:

```text
Request
  ↓
Middleware
  ↓
Routes
  ↓
No match
  ↓
notFound
  ↓
404
```

For an actual application error:

```text
Request
  ↓
Middleware / Route / Controller
  ↓
Error
  ↓
errorHandler
  ├── logger.error()
  └── 500 response
```

---

# 21. Architecture We Will Build Toward

As the project grows:

```text
Client
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository / Data Access
   ↓
PostgreSQL
```

### Route

Defines the endpoint.

```text
POST /users
```

### Controller

Handles HTTP concerns:

```text
req
res
params
query
body
status codes
```

### Service

Contains business logic.

Example:

```text
Can this user perform this action?
Does this email already exist?
How should the data be processed?
```

### Repository / Data Access

Handles database operations.

```text
SELECT
INSERT
UPDATE
DELETE
```

The main goal is:

```text
HTTP logic
    ≠
Business logic
    ≠
Database logic
```

Keeping these separate makes the application easier to test, maintain, and extend.

---

# 22. Important HTTP Concepts to Master

You should understand these very well:

## Request

Contains things such as:

```text
Method
URL
Headers
Params
Query
Body
```

## Response

Contains:

```text
Status Code
Headers
Body
```

Example:

```http
POST /users
Content-Type: application/json
```

Body:

```json
{
  "name": "Ahmed"
}
```

Response:

```http
201 Created
Content-Type: application/json
```

```json
{
  "id": 1,
  "name": "Ahmed"
}
```

---

# 23. Status Codes

Know the important ones:

```text
200 OK
201 Created
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Content

500 Internal Server Error
```

Important interview distinction:

```text
401 → Authentication problem
403 → Authorization problem
```

Example:

```text
401
"I don't know who you are."

403
"I know who you are, but you're not allowed to do this."
```

---

# 24. REST API Basics

A REST-style API generally models resources.

Example:

```text
/users
/posts
/products
/orders
```

Instead of:

```text
/getUsers
/createUser
/deleteUser
```

Use HTTP methods:

```text
GET    /users
POST   /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

Example:

```text
GET /users
        → get users

GET /users/42
        → get user 42

POST /users
        → create user

PATCH /users/42
        → update user 42

DELETE /users/42
        → delete user 42
```

---

# 25. Authentication vs Authorization

These are extremely important.

## Authentication

**Who are you?**

Example:

```text
Login
Email + Password
       ↓
Verify identity
       ↓
JWT / Session
```

## Authorization

**What are you allowed to do?**

Example:

```text
User
  ↓
Can read own profile

Admin
  ↓
Can delete users
```

Mental model:

```text
Authentication
→ Identity

Authorization
→ Permissions
```

---

# 26. Validation

Never trust incoming client data.

Bad:

```ts
const user = req.body;
```

and immediately inserting it into the database.

Instead:

```text
Request
   ↓
Validation
   ↓
Valid?
 ├── NO  → 400/422
 │
 └── YES
       ↓
    Controller
       ↓
     Service
       ↓
    Database
```

Typical validation:

```text
email → valid email?
password → minimum length?
age → valid number?
name → required?
```

Libraries such as Zod can be used later for schema validation.

---

# 27. Security Concepts

For a real Backend Developer, understand:

```text
SQL Injection
XSS
CSRF
CORS
Password Hashing
JWT
Sessions
Rate Limiting
Input Validation
HTTP Security Headers
Secrets Management
```

Especially:

**Never store passwords as plain text.**

Use password hashing such as:

```text
bcrypt
argon2
```

And always validate user input before processing it.

---

# 28. Node.js Concepts You Must Connect to Express

Express sits on top of Node.js.

You should understand:

```text
Node.js
   ↓
HTTP Server
   ↓
Express
```

Express does not replace Node.js.

It makes building HTTP applications easier.

Important Node concepts:

```text
Event Loop
Async/Await
Promises
Non-blocking I/O
Streams
HTTP
Modules
Environment Variables
Error Handling
Process
```

A common interview question:

> Why is Node.js good for I/O-heavy applications?

Because Node uses an event-driven, non-blocking I/O model, allowing it to handle many I/O operations without blocking the main JavaScript execution thread.

---

# 29. Database Connection

Eventually:

```text
Express
   ↓
Controller
   ↓
Service
   ↓
PostgreSQL
```

For example:

```text
POST /users
    ↓
Controller
    ↓
userService.createUser()
    ↓
INSERT INTO users ...
    ↓
PostgreSQL
    ↓
created user
    ↓
201 Created
```

This is where your PostgreSQL knowledge becomes directly useful.

---

# 30. Transactions

Very important backend/database concept.

Suppose creating an order requires:

```text
1. Create order
2. Decrease product stock
3. Create order items
```

If step 1 succeeds but step 2 fails, you may end up with inconsistent data.

A transaction provides:

```text
BEGIN
  ↓
Operation 1
  ↓
Operation 2
  ↓
Operation 3
  ↓
COMMIT
```

If something fails:

```text
ROLLBACK
```

Mental model:

```text
All operations succeed
→ COMMIT

Something fails
→ ROLLBACK
```

---

# 31. Indexes

Indexes improve database lookup performance.

Example:

```sql
CREATE INDEX idx_users_email
ON users(email);
```

Instead of scanning the entire table, PostgreSQL can use the index to find matching rows more efficiently.

But indexes have a cost:

```text
Faster reads
+
Extra storage
+
Slower writes
```

This is an important database trade-off.

---

# 32. Debugging Mindset

When something doesn't work, don't randomly change configuration.

Ask:

```text
1. What exactly failed?

2. Is the request reaching the server?

3. Which middleware runs?

4. Which route matches?

5. What is inside req.params?

6. What is inside req.query?

7. What is inside req.body?

8. Did the controller run?

9. Did the service run?

10. Did the database query run?

11. What error was thrown?

12. What status code should be returned?
```

Think in terms of the request flow.

---

# 33. Commands Cheat Sheet

## Create project

```bash
npm init -y
```

## TypeScript

```bash
npx tsc --init
```

## Install dependencies

```bash
npm install express dotenv cors pino
```

## Install development dependencies

```bash
npm install -D typescript tsx @types/node @types/express @types/cors pino-pretty
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Type-check without generating files

```bash
npx tsc --noEmit
```

---

# 34. Interview Questions to Be Able to Answer

Before moving forward, you should be able to explain these without memorizing definitions:

### Express

* What is Express?
* Why use Express instead of Node's raw HTTP module?
* What is middleware?
* How does `app.use()` work conceptually?
* What is an Express Router?
* How does routing work?
* What is the difference between `req.params`, `req.query`, and `req.body`?
* What is `express.json()`?
* What is CORS?
* What is the difference between 404 and 500?
* How does Express error handling work?
* Why does error middleware have four parameters?
* Why should `errorHandler` come after routes?

### HTTP

* What is HTTP?
* Difference between GET, POST, PUT, PATCH, DELETE?
* What are HTTP status codes?
* Difference between 401 and 403?
* Difference between 400 and 422?
* What are HTTP headers?
* What is Content-Type?
* What is REST?

### Node.js

* What is Node.js?
* What is the Event Loop?
* What does non-blocking I/O mean?
* Why can Node handle many concurrent I/O operations?
* Difference between synchronous and asynchronous code?
* What are Promises?
* What is async/await?

### Backend Architecture

* Why separate routes/controllers/services?
* What is Separation of Concerns?
* What is business logic?
* Why shouldn't controllers contain all the application logic?
* What is dependency between layers?

### Database

* What is a primary key?
* What is a foreign key?
* What is an index?
* What is a transaction?
* What is normalization?
* What is SQL injection?
* Why use parameterized queries?

### Security

* Authentication vs Authorization?
* What is password hashing?
* What is JWT?
* What is a session?
* What is CORS?
* Why validate input?
* Why shouldn't errors expose internal details?

---

# 35. The Most Important Mental Model

Don't memorize Express APIs individually.

Understand this:

```text
                 HTTP Request
                       ↓
                  Express App
                       ↓
                  Middleware
                       ↓
                    Router
                       ↓
                  Controller
                       ↓
                   Service
                       ↓
              Database / External API
                       ↓
                  Controller
                       ↓
                  HTTP Response
```

And remember the two special paths:

```text
No matching route
       ↓
     404
```

```text
Unexpected application error
       ↓
  Error Handler
       ↓
     500
```

---

# 36. Learning Priority

Focus on these in this order:

```text
1. HTTP fundamentals
2. Express request/response
3. Middleware
4. Routing
5. Params / Query / Body
6. Error handling
7. Controllers
8. Services / Business Logic
9. Validation
10. PostgreSQL integration
11. Authentication
12. Authorization
13. Security
14. Testing
15. Logging
16. Docker
17. Deployment
18. Basic System Design
```

The goal is not to memorize every Express function.

The goal is to be able to look at a backend problem and understand:

```text
What is happening?
        ↓
Why is it happening?
        ↓
Where should the logic live?
        ↓
How should the API behave?
        ↓
How should errors be handled?
        ↓
How should the database be used?
        ↓
How would I explain this in an interview?
```

That is the mindset we will use throughout the Backend/Express part of the project.
