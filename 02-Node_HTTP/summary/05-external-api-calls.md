# Node.js Backend — External API Calls

## 1. What Are External API Calls?

A backend often needs to communicate with another server.

Example:

```ts
const API_URL = "https://jsonplaceholder.typicode.com/users/1";

const response = await fetch(API_URL);
```

Flow:

```text
Your Node.js Backend
        │
        │ HTTP GET
        ▼
External API
        │
        │ JSON response
        ▼
Your Backend
        │
        ▼
Process / Transform / Return data
```

---

# 2. Types for External Data

The external API returns this structure:

```ts
type PlaceHolderUser = {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
};
```

Notice that `company` is an object:

```json
{
  "company": {
    "name": "Romaguera-Crona"
  }
}
```

We define our own structure:

```ts
type PublicUser = {
  id: number;
  name: string;
  email: string;
  company: string;
};
```

Here `company` is just a string.

### Why have two types?

Because the external API's data structure does not have to be the same as the structure your backend wants to use or return.

---

# 3. Transforming the Data

```ts
function tranformUser(rawData: PlaceHolderUser): PublicUser {
  return {
    id: rawData.id,
    name: rawData.name,
    email: rawData.email,
    company: rawData.company.name
  };
}
```

The function converts:

```text
PlaceHolderUser
      │
      │ transformUser()
      ▼
PublicUser
```

Example:

```text
External:
company = { name: "Romaguera-Crona" }

             ↓

Our application:
company = "Romaguera-Crona"
```

This pattern is very common in backend development.

External API → **transform** → your application's format.

---

# 4. The Main Async Function

```ts
async function fetchExternalUser(): Promise<void> {
```

`async` means the function can use `await`.

`Promise<void>` means:

> This function returns a Promise, and when it finishes successfully, it doesn't return a value.

---

# 5. AbortController + signal

Before starting the request:

```ts
const controller = new AbortController();
```

This creates a controller that can cancel the request.

We then create a timeout:

```ts
const timeOut = setTimeout(() => {
  controller.abort();
}, 5000);
```

After 5 seconds:

```ts
controller.abort();
```

is called.

To connect the controller to `fetch()`:

```ts
const response = await fetch(API_URL, {
  method: "GET",
  signal: controller.signal
});
```

### What is `signal`?

`controller.signal` is an `AbortSignal`.

It is basically the **connection between the controller and the operation**.

```text
AbortController
      │
      │ signal
      ▼
    fetch()
```

When:

```ts
controller.abort();
```

happens, the signal tells `fetch()` that the request has been aborted.

So:

```text
controller.abort()
        ↓
signal becomes aborted
        ↓
fetch detects cancellation
        ↓
fetch rejects
        ↓
catch()
```

You don't call `abort()` on the signal:

```ts
controller.abort();        // ✅
controller.signal.abort(); // ❌
```

---

# 6. Making the HTTP Request

```ts
const response = await fetch(API_URL, {
  method: "GET",
  signal: controller.signal
});
```

There are three important things here:

### `fetch()`

Makes the HTTP request.

### `await`

Waits for the Promise to settle.

### `response`

Contains information about the HTTP response.

For example:

```ts
response.status
response.ok
response.headers
response.json()
```

---

# 7. Checking HTTP Errors

```ts
if (!response.ok) {
  console.error(
    `upstream api failed with http ${response.status}`
  );
  return;
}
```

Important:

**`fetch()` does not throw an error just because the server returns 404 or 500.**

For example:

```text
GET /users/1
       ↓
HTTP 200
       ↓
response.ok === true
```

But:

```text
GET /something
       ↓
HTTP 404
       ↓
response.ok === false
```

So we manually check:

```ts
if (!response.ok)
```

And `response.status` tells us the exact HTTP status:

```text
200 → OK
404 → Not Found
500 → Server Error
```

---

# 8. Reading the JSON Body

After checking the status:

```ts
const rawUser =
  (await response.json()) as PlaceHolderUser;
```

`response.json()` reads the response body and parses it as JSON.

It is asynchronous, so:

```ts
await response.json()
```

### `as PlaceHolderUser`

This tells TypeScript:

> "I expect this JSON data to have the `PlaceHolderUser` structure."

```ts
as PlaceHolderUser
```

⚠️ This is **not runtime validation**.

If the server sends incorrect data, TypeScript won't magically detect it at runtime.

---

# 9. Transforming the Result

Now we have:

```ts
const rawUser = ...
```

which represents the external API's structure.

We transform it:

```ts
const user = tranformUser(rawUser);
```

Now:

```text
API JSON
   ↓
PlaceHolderUser
   ↓
transformUser()
   ↓
PublicUser
```

Then:

```ts
console.log(user);
```

prints our transformed object.

---

# 10. Error Handling with `try/catch`

The request is inside:

```ts
try {
  // request
} catch (error) {
  // handle errors
}
```

This is important because network operations can fail.

Possible problems include:

```text
Network failure
Connection refused
DNS error
Request aborted
Other runtime error
```

If `fetch()` rejects, execution jumps to:

```ts
catch (error)
```

---

# 11. Handling Timeout / Abort

Your code checks:

```ts
if (
  error instanceof Error &&
  error.name === "AbortError"
) {
  console.error(
    "Request failed because upstream API took too long"
  );
  return;
}
```

Why?

Because when `controller.abort()` cancels the fetch, the Promise rejects with an `AbortError`.

So we can distinguish:

```text
Request aborted
      ↓
AbortError
      ↓
"Request timed out"
```

from other errors.

---

# 12. Handling Other Errors

If it wasn't an `AbortError`:

```ts
const message =
  error instanceof Error
    ? error.message
    : "Unknown error";
```

Then:

```ts
console.error(
  `Request failed with error: ${message}`
);
```

### Why `instanceof Error`?

Because the value caught by:

```ts
catch (error)
```

is not guaranteed to be an `Error` object.

So we safely check it first.

---

# 13. `finally` — Cleanup

At the end:

```ts
finally {
  clearTimeout(timeOut);
}
```

`finally` runs whether the request:

```text
succeeds
   ↓
finally

OR

fails
   ↓
finally

OR

gets aborted
   ↓
finally
```

We use:

```ts
clearTimeout(timeOut);
```

because if the API responds after 1 second, we don't want the 5-second timer to remain active.

---

# 14. Complete Request Flow

The whole function works like this:

```text
fetchExternalUser()
        │
        ▼
Create AbortController
        │
        ▼
Start 5-second timeout
        │
        ▼
fetch(API_URL)
        │
        ▼
Did request succeed?
        │
        ├── Network/Abort Error ──→ catch
        │
        ▼
Check response.ok
        │
        ├── false ──→ log HTTP error → return
        │
        ▼
response.json()
        │
        ▼
PlaceHolderUser
        │
        ▼
transformUser()
        │
        ▼
PublicUser
        │
        ▼
console.log(user)
        │
        ▼
finally
        │
        ▼
clearTimeout()
```

---

# 15. Expected Successful Output

For:

```ts
https://jsonplaceholder.typicode.com/users/1
```

the transformed output is approximately:

```text
{
  id: 1,
  name: 'Leanne Graham',
  email: 'Sincere@april.biz',
  company: 'Romaguera-Crona'
}
```

---

# 16. What Happens in Different Scenarios?

### Scenario 1 — Everything works

```text
fetch()
  ↓
HTTP 200
  ↓
response.json()
  ↓
transformUser()
  ↓
console.log()
  ↓
finally
```

### Scenario 2 — API returns 404/500

```text
fetch()
  ↓
HTTP 404/500
  ↓
response.ok === false
  ↓
console.error()
  ↓
return
  ↓
finally
```

### Scenario 3 — API takes more than 5 seconds

```text
fetch()
  ↓
waiting...
  ↓
5 seconds
  ↓
controller.abort()
  ↓
fetch rejects
  ↓
catch()
  ↓
AbortError
  ↓
finally
```

### Scenario 4 — Network failure

```text
fetch()
  ↓
network error
  ↓
catch()
  ↓
error message
  ↓
finally
```

---

# 17. Key Backend Takeaways

Remember these concepts:

| Concept            | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `fetch()`          | Make an HTTP request                                 |
| `await`            | Wait for the Promise                                 |
| `response.ok`      | Check if HTTP status is successful                   |
| `response.status`  | Get HTTP status code                                 |
| `response.json()`  | Read/parse JSON response                             |
| `as Type`          | Tell TypeScript what type you expect                 |
| `AbortController`  | Control cancellation                                 |
| `signal`           | Connect cancellation to `fetch()`                    |
| `try/catch`        | Handle rejected operations/errors                    |
| `finally`          | Always perform cleanup                               |
| `clearTimeout()`   | Remove the timeout after the request finishes        |
| Transform function | Convert external data into your application's format |

## The Backend Mental Model

```text
Call external API
       ↓
Protect against timeout
       ↓
Check HTTP status
       ↓
Read response
       ↓
Transform data
       ↓
Use/return data
       ↓
Handle errors
       ↓
Cleanup
```
