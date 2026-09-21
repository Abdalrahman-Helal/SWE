# Node.js Timers — Cheat Sheet

## 1. What are Timers?

Node.js provides functions that let you run code **later** or **repeatedly**.

The main ones:

```text
setTimeout()   → run once after a delay
setInterval()  → run repeatedly
clearTimeout() → cancel a timeout
clearInterval()→ stop an interval
setImmediate() → run on a later Event Loop phase
```

There is also:

```ts
setTimeout() from "node:timers/promises"
```

which gives you a **Promise-based timer** that works nicely with `async/await`.

---

# 2. The Most Important Concept

Node.js does **NOT stop and wait** when you use a timer.

For example:

```ts
console.log("1");

setTimeout(() => {
  console.log("2");
}, 1000);

console.log("3");
```

Output:

```text
1
3
2
```

Why?

```text
console.log("1")
      ↓
runs immediately

setTimeout()
      ↓
register callback
      ↓
Node continues

console.log("3")
      ↓
runs immediately

1 second passes
      ↓
callback can run
      ↓
console.log("2")
```

### Remember

```text
Timer ≠ "Node waits"

Timer = "Node, run this callback later"
```

This is one of the most important ideas in Node.js.

---

# 3. `setTimeout()`

Runs a callback **once after a minimum delay**.

```ts
setTimeout(() => {
  console.log("Hello");
}, 1000);
```

Meaning:

```text
setTimeout
    ↓
wait at least 1 second
    ↓
run callback once
```

It does **not** run repeatedly.

---

# 4. `clearTimeout()`

Cancels a timeout before it executes.

```ts
const timerId = setTimeout(() => {
  console.log("this message will not run");
}, 2000);

clearTimeout(timerId);
```

Think:

```text
setTimeout()
     ↓
timerId
     ↓
clearTimeout(timerId)
     ↓
❌ callback cancelled
```

### Why do we need `timerId`?

Because `clearTimeout()` needs to know **which timer** you want to cancel.

---

# 5. `setInterval()`

Runs a callback **repeatedly after a fixed delay**.

```ts
let count = 0;

const intervalId = setInterval(() => {
  count++;

  console.log(`tick ${count}`);

  if (count === 3) {
    clearInterval(intervalId);
  }
}, 1000);
```

Sequence:

```text
1 second → tick 1
1 second → tick 2
1 second → tick 3
              ↓
       clearInterval()
              ↓
           STOP
```

Unlike `setTimeout()`:

```text
setTimeout()
    ↓
runs once
```

while:

```text
setInterval()
    ↓
runs repeatedly
    ↓
until stopped
```

---

# 6. `clearInterval()`

Stops an active interval.

```ts
clearInterval(intervalId);
```

Without it, the interval continues running.

Example:

```ts
const intervalId = setInterval(() => {
  console.log("running...");
}, 1000);

// later
clearInterval(intervalId);
```

---

# 7. `setImmediate()`

`setImmediate()` schedules a callback to run **later through the Event Loop**.

```ts
setImmediate(() => {
  console.log("setImmediate callback");
});

console.log("synchronous code");
```

Output:

```text
synchronous code
setImmediate callback
```

Why?

Because normal synchronous code runs first.

```text
setImmediate()
      ↓
callback scheduled

console.log()
      ↓
runs immediately

Event Loop
      ↓
setImmediate callback
```

### Important

`setImmediate()` does **not mean "execute immediately"**.

It means roughly:

> Run this callback in the Event Loop's check phase.

---

# 8. `setTimeout(0)` vs `setImmediate()`

Both schedule code for later.

```ts
setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});
```

From **top-level code**, don't rely on which one runs first.

The order can vary.

But inside an **I/O callback**, `setImmediate()` runs before `setTimeout(..., 0)`.

### Remember

```text
setTimeout(0)
→ timer

setImmediate()
→ check phase
```

---

# 9. Promise-Based Timer

Node.js also provides timers that return Promises.

```ts
import { setTimeout as sleep } from "node:timers/promises";
```

Then:

```ts
await sleep(1500);
```

means:

> Wait for 1.5 seconds before continuing this async function.

Example:

```ts
async function example(): Promise<void> {
  console.log("start");

  await sleep(1500);

  console.log("after 1.5 seconds");
}
```

Sequence:

```text
start
  ↓
await sleep(1500)
  ↓
function pauses here
  ↓
1.5 seconds
  ↓
Promise resolves
  ↓
continue function
  ↓
after 1.5 seconds
```

### Important difference

Normal `setTimeout()`:

```ts
setTimeout(() => {
  // callback
}, 1500);
```

Promise timer:

```ts
await sleep(1500);
```

The second one is especially convenient with `async/await`.

---

# 10. Your Complete Example

```ts
import { setTimeout as sleep } from "node:timers/promises";

function runSetTimeOutExample(): void {
  console.log("1. setTimeout example started");

  setTimeout(() => {
    console.log("2. this runs after 1 second");
  }, 1000);

  console.log("3. this runs immediately. node doesn't wait");
}

function runClearTimeoutExample(): void {
  const timerId = setTimeout(() => {
    console.log("this message will not run");
  }, 2000);

  clearTimeout(timerId);

  console.log("4. clearTimeout cancelled the 2 second timer");
}

function runSetIntervalExample(): void {
  let count = 0;

  const intervalId = setInterval(() => {
    count++;

    console.log(`5. setInterval tick ${count}`);

    if (count === 3) {
      clearInterval(intervalId);
      console.log("6. setInterval stopped");
    }
  }, 1000);
}

function runSetImmediateExample(): void {
  setImmediate(() => {
    console.log("7. setImmediate callback");
  });

  console.log("8. synchronous code after setImmediate");
}

async function runPromiseTimerExample(): Promise<void> {
  console.log("9. waiting for promise based timer");

  await sleep(1500);

  console.log("10. promise based timer finishes after 1.5 seconds");
}

function runTimerDemo(): void {
  runSetTimeOutExample();
  runClearTimeoutExample();
  runSetIntervalExample();
  runSetImmediateExample();
}

runTimerDemo();

runPromiseTimerExample().catch((error: unknown) => {
  console.error("timer based demo failed", error);
});
```

---

# 11. Understanding Your Code's Sequence

The first thing Node does is execute the **synchronous code**.

```text
runTimerDemo()
      ↓
runSetTimeOutExample()
      ↓
prints 1
      ↓
registers setTimeout
      ↓
prints 3
```

So:

```text
1
3
```

Then:

```text
runClearTimeoutExample()
```

The 2-second timer is created and immediately cancelled:

```text
4
```

So its callback **never runs**.

Then:

```text
runSetIntervalExample()
```

The interval is registered.

Then:

```text
runSetImmediateExample()
```

`setImmediate()` is registered, but:

```ts
console.log("8. synchronous code after setImmediate");
```

runs immediately.

So:

```text
8
```

comes before `7`.

Then:

```text
runPromiseTimerExample()
```

prints:

```text
9
```

and reaches:

```ts
await sleep(1500);
```

The function pauses there and gives control back to Node.

---

# 12. Overall Timeline

The important thing is that these timers are **not executed in the order you wrote them**.

Conceptually:

```text
Synchronous code
      ↓
1
3
4
8
9
      ↓
Event Loop handles scheduled work
      ↓
setImmediate → 7
      ↓
~1 second
      ↓
setTimeout → 2
      ↓
setInterval → 5. tick 1
      ↓
~1 second
      ↓
setInterval → 5. tick 2
      ↓
promise timer finishes → 10
      ↓
~1 second
      ↓
setInterval → 5. tick 3
      ↓
clearInterval()
      ↓
STOP
```

The exact ordering of callbacks around the same time can depend on the Event Loop, so don't memorize an exact output sequence for timers that become ready around the same time.

---

# 13. The Main Difference

```text
setTimeout()
    ↓
Run ONCE after a delay
```

```text
setInterval()
    ↓
Run REPEATEDLY
    ↓
clearInterval() → stop it
```

```text
clearTimeout()
    ↓
Cancel a timeout
```

```text
setImmediate()
    ↓
Run later in the Event Loop
```

```text
await sleep()
    ↓
Pause this async function
    ↓
continue after delay
```

---

# Quick Interview Revision

**Q: Does `setTimeout()` block Node.js?**

No. Node registers the timer and continues executing other code.

**Q: Does `setTimeout(fn, 0)` execute immediately?**

No. It schedules the callback to run later when the timer is eligible and the Event Loop gets to it.

**Q: What's the difference between `setTimeout()` and `setInterval()`?**

```text
setTimeout  → once
setInterval → repeatedly
```

**Q: How do you cancel a timeout?**

```ts
clearTimeout(timerId);
```

**Q: How do you stop an interval?**

```ts
clearInterval(intervalId);
```

**Q: Does `setImmediate()` execute immediately?**

No. It schedules the callback for the Event Loop's **check phase**.

**Q: Why use `await sleep()`?**

It gives you a Promise-based timer that works naturally with `async/await`.

### Mental Model

```text
setTimeout()       → later, once
setInterval()      → later, repeatedly
clearTimeout()     → cancel timeout
clearInterval()    → stop interval
setImmediate()     → later, check phase
await sleep(ms)    → pause async function for ms
```
