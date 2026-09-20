Here’s a concise Node.js Markdown cheat sheet based on your example, with the important concepts and execution flow included.

# Node.js EventEmitter

`EventEmitter` is a Node.js mechanism used to create and handle **events**.

The basic idea:

```text
Something happens
      ↓
  emit event
      ↓
Listeners receive the event
      ↓
Each listener performs an action
```

Example:

```text
User registered
      ↓
emit("user:registered")
      ↓
 ┌───────────────────────┐
 │ Welcome email listener│
 │ Log listener          │
 │ Other service listener│
 └───────────────────────┘
```

---

## 1. Import EventEmitter

```ts
import EventEmitter from "node:events";

const appEvents = new EventEmitter();
```

`EventEmitter` is built into Node.js, so no package installation is required.

`appEvents` is an EventEmitter instance that we can use to:

* register listeners
* emit events
* remove listeners

---

## 2. `.on()` — Register a Listener

```ts
appEvents.on("user:registered", (user) => {
  console.log(`Welcome ${user.email}`);
});
```

`.on()` means:

> "Whenever this event happens, run this function."

The listener stays registered and can run **every time** the event is emitted.

Example:

```ts
appEvents.on("login", () => {
  console.log("User logged in");
});

appEvents.emit("login");
appEvents.emit("login");
```

Output:

```text
User logged in
User logged in
```

---

## 3. `.once()` — Listen One Time

```ts
appEvents.once("app.started", () => {
  console.log("App started");
});
```

`.once()` registers a listener that runs **only the first time** the event is emitted.

```ts
appEvents.emit("app.started");
appEvents.emit("app.started");
```

Output:

```text
App started
```

The listener is automatically removed after the first execution.

### `.on()` vs `.once()`

```text
.on()      → runs every time
.once()    → runs only once
```

---

## 4. `.emit()` — Trigger an Event

```ts
appEvents.emit("user:registered", user);
```

`.emit()` means:

> "This event just happened."

You can also send data with the event.

```ts
appEvents.emit("user:registered", user);
```

The data becomes an argument of the listener:

```ts
appEvents.on("user:registered", (user) => {
  console.log(user.email);
});
```

So mentally:

```text
emit("user:registered", user)
              ↓
              ↓
listener receives user
              ↓
(user) => { ... }
```

---

# 5. Event Payloads with TypeScript

You can define the shape of the data sent with an event:

```ts
type UserRegisterPayload = {
  id: number;
  email: string;
};
```

Then:

```ts
appEvents.on(
  "user:registered",
  (user: UserRegisterPayload) => {
    console.log(user.email);
  }
);
```

This tells TypeScript that `user` must contain:

```ts
{
  id: number;
  email: string;
}
```

---

# 6. Multiple Listeners

Multiple listeners can listen to the same event:

```ts
appEvents.on("user:registered", (user) => {
  console.log(`Welcome email sent to ${user.email}`);
});

appEvents.on("user:registered", (user) => {
  console.log(`User ${user.id} registered`);
});
```

When:

```ts
appEvents.emit("user:registered", user);
```

both listeners execute.

Conceptually:

```text
emit("user:registered")
          ↓
     ┌────┴────┐
     ↓         ↓
 Listener 1  Listener 2
     ↓         ↓
 Email       Logging
```

This is useful because the registration function doesn't need to know about every action that should happen after registration.

---

# 7. Your `registerUser()` Example

```ts
function registerUser(): void {
  const user = {
    id: 1,
    email: "helal@gmail.com"
  };

  console.log("user saved");

  appEvents.emit("user:registered", user);

  console.log("register user: event listeners completed");
}
```

When `registerUser()` runs:

### Step 1

The user object is created:

```ts
const user = {
  id: 1,
  email: "helal@gmail.com"
};
```

### Step 2

```ts
console.log("user saved");
```

Output:

```text
user saved
```

### Step 3

```ts
appEvents.emit("user:registered", user);
```

Node.js finds all listeners registered for `"user:registered"`.

You have two:

```ts
appEvents.on("user:registered", ...);
appEvents.on("user:registered", ...);
```

So both execute.

### Step 4

After the listeners finish:

```ts
console.log("register user: event listeners completed");
```

Output is approximately:

```text
user saved
email listener: welcome email sent to this user helal@gmail.com
log listener: user 1 and email is helal@gmail.com
register user: event listeners completed
```

---

# 8. Important: EventEmitter Listeners Are Synchronous

This is an important Node.js detail.

Consider:

```ts
appEvents.on("test", () => {
  console.log("listener");
});

console.log("before");

appEvents.emit("test");

console.log("after");
```

Output:

```text
before
listener
after
```

`emit()` calls the listeners **synchronously**.

So don't automatically think:

```text
emit()
  ↓
background task
```

Instead, think:

```text
emit()
  ↓
call registered listeners now
  ↓
continue after listeners finish
```

Unless the listener itself starts asynchronous work.

---

# 9. Event Names

Event names are usually strings:

```ts
"user:registered"
"app.started"
"order:created"
"user:deleted"
```

The naming convention is up to your application.

These are just names used to identify different events.

```ts
appEvents.emit("user:registered");
appEvents.emit("order:created");
appEvents.emit("payment:completed");
```

Listeners only respond to the event they registered for.

---

# 10. Complete Example

```ts
import EventEmitter from "node:events";

const appEvents = new EventEmitter();

type UserRegisterPayload = {
  id: number;
  email: string;
};

// Listener 1
appEvents.on(
  "user:registered",
  (user: UserRegisterPayload) => {
    console.log(
      `email listener: welcome email sent to this user ${user.email}`
    );
  }
);

// Listener 2
appEvents.on(
  "user:registered",
  (user: UserRegisterPayload) => {
    console.log(
      `log listener: user ${user.id} and email is ${user.email}`
    );
  }
);

// Runs only once
appEvents.once("app.started", () => {
  console.log("once listener: app started");
});

function registerUser(): void {
  const user = {
    id: 1,
    email: "helal@gmail.com"
  };

  console.log("user saved");

  appEvents.emit("user:registered", user);

  console.log("register user: event listeners completed");
}

appEvents.emit("app.started");
appEvents.emit("app.started");

registerUser();
```

Output:

```text
once listener: app started
user saved
email listener: welcome email sent to this user helal@gmail.com
log listener: user 1 and email is helal@gmail.com
register user: event listeners completed
```

---

# Mental Model

Think of an EventEmitter as a **notification system**.

```text
                 EventEmitter
                      │
            emit("user:registered")
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
      Listener 1  Listener 2  Listener 3
          ↓           ↓           ↓
       Email        Logging    Analytics
```

The code that emits the event doesn't need to directly call each action.

Instead:

```ts
appEvents.emit("user:registered", user);
```

says:

> "A user was registered."

Anything interested in that event can listen to it.

---

# Key Things to Remember

| Method    | Purpose                                  |
| --------- | ---------------------------------------- |
| `.on()`   | Register a listener that runs every time |
| `.once()` | Register a listener that runs only once  |
| `.emit()` | Trigger an event                         |
| `.off()`  | Remove a listener                        |

### Most important concept

```ts
appEvents.on("event", listener);
```

means:

**"When `event` happens, run `listener`."**

```ts
appEvents.emit("event", data);
```

means:

**"The `event` happened, and here's some data."**

And remember:

> **EventEmitter itself doesn't make your code asynchronous. `emit()` calls listeners synchronously unless those listeners start asynchronous work.**
