# Node.js Event Loop — Quick Summary

## 1. The Main Idea

Node.js has a single main JavaScript thread. The **Event Loop** coordinates callbacks, while libuv's **Thread Pool** handles certain operations in the background.

The goal of this example is to understand which code blocks the main thread and which code can run asynchronously.

## 2. Who Executes First, and Why?

### Step 1: Synchronous code

```js
console.log("Hello from the top level code");
```

This runs immediately because JavaScript executes synchronous code before moving on to callbacks.

### Step 2: Schedule timers and immediate callbacks

```js
setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));
```

Neither callback runs immediately. Their order at the top level is **not guaranteed**.

### Step 3: Wait for file I/O

```js
fs.readFile("test-file.txt", () => {
  // ...
});
```

Node.js continues executing the top-level code while the file is being read. When the read finishes, its callback can execute.

### Step 4: Inside the I/O callback

```js
process.nextTick(() => console.log("Process.nextTick()"));

crypto.pbkdf2Sync("password", "salt", 10000, 1024, "sha512");

console.log(Date.now() - start, "password encrypted");
```

The order is important:

1. `pbkdf2Sync()` runs and **blocks the main thread** until hashing finishes.
2. The elapsed time is printed.
3. The I/O callback finishes.
4. `process.nextTick()` runs before the Event Loop continues to its next phase.

**Why doesn't `process.nextTick()` run immediately?** Because it cannot interrupt the currently executing JavaScript callback.

### Step 5: `setImmediate()` versus `setTimeout()`

Inside the I/O callback:

```js
setTimeout(() => console.log("Timer 2 finished"), 0);
setImmediate(() => console.log("Immediate 2 finished"));
```

Typically, `Immediate 2` runs before `Timer 2` because `setImmediate()` is processed in the Check phase following I/O, while the timer must become eligible and wait for a suitable Timers phase.

`Timer 3` has a 3-second delay, so it normally runs later.

### Step 6: Asynchronous hashing

```js
crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
  console.log(Date.now() - start, "password encrypted");
});
```

The hashing runs in libuv's Thread Pool. The main thread can continue doing other work, and each callback runs when its hash finishes and the Event Loop can process it.

Because there are three hashing tasks and four Thread Pool workers, all three can generally run concurrently if workers are available.

## 3. Expected Order — Simplified

The overall order is not completely fixed, but the main principles are:

1. **Top-level synchronous code:** `Hello from the top level code`
2. **Eligible top-level callbacks:** `Timer 1` and `Immediate 1` — their relative order is not guaranteed.
3. **I/O callback:** `I/O finished`, then the separator.
4. **Synchronous hashing:** `pbkdf2Sync()` blocks until complete, then prints its elapsed time.
5. **`process.nextTick()`:** Runs after the I/O callback finishes.
6. **`Immediate 2` and `Timer 2`:** Typically Immediate first in this I/O context.
7. **Asynchronous hash callbacks:** Run when their operations finish and the Event Loop can process them.
8. **`Timer 3`:** Runs after its 3-second delay, when eligible.

The exact order of later callbacks depends on timing and the Node.js runtime.

## 4. Remember These Rules

| API                  | Key idea                                                                             |
| -------------------- | ------------------------------------------------------------------------------------ |
| Synchronous code     | Runs immediately and blocks until complete.                                          |
| `process.nextTick()` | Runs after the current operation, before the Event Loop continues to its next phase. |
| `setTimeout()`       | Runs when its delay has elapsed and the Event Loop can process it.                   |
| `setImmediate()`     | Runs in the Check phase.                                                             |
| `pbkdf2Sync()`       | Hashes on the main thread and blocks it.                                             |
| `pbkdf2()`           | Uses the Thread Pool asynchronously; its callback runs on the main thread.           |

**Mental model:** Synchronous code first, then callbacks according to their scheduling rules. The Thread Pool does background work, but JavaScript callbacks still run on the main thread.
