# Callback vs Promise vs async/await

## 1. User Type

```ts
type User = {
  id: number;
  name: string;
  role: "user" | "super-admin";
};
```

`User` is a TypeScript **type alias** that describes the shape of a user.

---

## 2. Users Array

```ts
const users: User[] = [
  {
    id: 1,
    name: "helal",
    role: "user",
  },
  {
    id: 2,
    name: "John",
    role: "user",
  },
  {
    id: 3,
    name: "roman",
    role: "user",
  },
];
```

`User[]` means:

> An array where every element must be a `User`.

---

# 3. Callback

## What is a Callback?

A **callback** is a function passed as an argument to another function.

```ts
function doSomething(callback) {
  // ...
}
```

The function passed to `doSomething()` is called a **callback function**.

### Classic Node.js Callback Pattern

A common Node.js pattern is:

```ts
callback(error, result);
```

The convention is:

```text
First argument  → error
Second argument → result
```

### Success

```ts
callback(null, result);
```

### Error

```ts
callback(error);
```

---

# 4. Callback Example

```ts
function findUserWithCallback(
  userId: number,
  callback: (error: Error | null, user?: User) => void,
): void {
  setTimeout(() => {
    // API calling
    const user = users.find(
      (currentUser) => currentUser.id === userId
    );

    if (!user) {
      callback(
        new Error(`user with id ${userId} was not found`)
      );
      return;
    }

    callback(null, user);
  }, 500);
}
```

## Understanding the Callback Type

```ts
callback: (error: Error | null, user?: User) => void
```

This means:

> `callback` must be a function that accepts these parameters.

```text
error → Error | null
user  → User | undefined
```

And returns:

```text
void
```

### Important

This:

```ts
callback: (error: Error | null, user?: User) => void
```

does **not** create the callback.

It only describes the **type/shape** of the callback.

The actual callback is provided later:

```ts
findUserWithCallback(3, (error, user) => {
  // actual callback
});
```

---

# 5. Calling the Callback

```ts
findUserWithCallback(3, (error, user) => {
  if (error) {
    console.log("callback error", error.message);
    return;
  }

  console.log(
    "callback result",
    user?.id,
    user?.name,
    user?.role
  );
});
```

Here:

```ts
(error, user) => {
  // ...
}
```

is the **actual callback function**.

You are basically telling `findUserWithCallback`:

> "When you finish the operation, call this function."

---

# 6. Callback Flow

```text
findUserWithCallback(3, callback)
              ↓
       Start async operation
              ↓
          Find user
              ↓
       ┌──────┴──────┐
       ↓             ↓
    Not found       Found
       ↓             ↓
 callback(error)  callback(null, user)
       ↓             ↓
     Error          Success
```

---

# 7. The Two `user` Variables

These are **not the same variable**:

```ts
const user = users.find(...);
```

and:

```ts
(error, user) => {
  // ...
}
```

They have the same name, but they are different variables.

The important part is:

```ts
callback(null, user);
```

The `user` here is the local variable:

```ts
const user = users.find(...);
```

Its value is passed into the callback.

Then the callback receives that value:

```ts
(error, user) => {
  // user receives the value
}
```

Think of it like:

```text
const user
    ↓
callback(null, user)
    ↓
(error, user) => ...
             ↑
       receives the value
```

So:

> Same value, different variable/parameter.

---

# 8. `.find()`

This:

```ts
const user = users.find(
  (currentUser) => currentUser.id === userId
);
```

searches the `users` array.

For example:

```ts
userId = 3
```

The search is basically:

```text
User 1 → 1 === 3 → false
User 2 → 2 === 3 → false
User 3 → 3 === 3 → true
```

So `.find()` returns:

```ts
{
  id: 3,
  name: "roman",
  role: "user"
}
```

If no user matches, `.find()` returns:

```ts
undefined
```

That's why we check:

```ts
if (!user) {
  // user not found
}
```

---

# 9. Promise

A **Promise** represents the future result of an asynchronous operation.

Instead of passing a callback directly, the function returns a `Promise`.

```ts
function findUserWithPromise(
  userId: number
): Promise<User> {

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const user = users.find(
        (currentUser) => currentUser.id === userId
      );

      if (!user) {
        reject(
          new Error(
            `user with ID: ${userId} data was not found`
          )
        );
        return;
      }

      resolve(user);

    }, 1000);
  });
}
```

---

# 10. `resolve()` and `reject()`

A Promise has two main outcomes:

```text
                 Promise
                    │
             ┌──────┴──────┐
             ↓             ↓
         resolve         reject
             ↓             ↓
          Success         Error
```

## `resolve()`

```ts
resolve(user);
```

Means:

> The operation succeeded. Here is the result.

## `reject()`

```ts
reject(error);
```

Means:

> The operation failed. Here is the error.

---

# 11. Promise States

A Promise starts as:

```text
Pending
```

Then it becomes either:

```text
Pending
   ↓
 ┌─┴─────────┐
 ↓           ↓
Fulfilled   Rejected
```

### Pending

The operation is still running.

### Fulfilled

The operation succeeded.

### Rejected

The operation failed.

---

# 12. `.then()` and `.catch()`

```ts
findUserWithPromise(10)
  .then((user) => {
    console.log(
      "promise result",
      user?.id,
      user?.name,
      user?.role
    );
  })
  .catch((error: Error) => {
    console.log(
      "promise error",
      error.message
    );
  });
```

The relationship is:

```text
resolve(user)
     ↓
  .then(user => ...)
```

And:

```text
reject(error)
     ↓
 .catch(error => ...)
```

---

# 13. Promise Flow

```text
findUserWithPromise(10)
          ↓
       Promise
          ↓
       Pending
          ↓
     ┌────┴────┐
     ↓         ↓
  resolve    reject
     ↓         ↓
  .then()   .catch()
```

---

# 14. Why `return` After `reject()`?

Use:

```ts
if (!user) {
  reject(new Error("User not found"));
  return;
}

resolve(user);
```

Why?

Because:

```ts
reject(error);
```

does not automatically stop the
