# Node.js `os` Module — Cheat Sheet

## 1. What is `os`?

`os` is a **built-in Node.js module** that provides information about the operating system and the computer running your Node.js application.

```ts
import * as os from "node:os";
```

Common uses:

* Get operating system information
* Get CPU information
* Get CPU count
* Get memory information
* Get user's home directory
* Get temporary directory
* Detect the platform/architecture

---

# 2. `os.platform()`

Returns the operating system **platform**.

```ts
console.log(os.platform());
```

Example:

```text
win32
```

On Linux:

```text
linux
```

On macOS:

```text
darwin
```

### Common values

```text
Windows → win32
Linux   → linux
macOS   → darwin
```

### Remember

```text
os.platform()
      ↓
Operating system platform
```

---

# 3. `os.arch()`

Returns the CPU **architecture** that Node.js is running on.

```ts
console.log(os.arch());
```

Example:

```text
x64
```

Common values:

```text
x64
arm64
arm
ia32
```

For example:

```text
x64   → 64-bit x86
arm64 → 64-bit ARM
```

### Remember

```text
os.arch()
    ↓
CPU architecture
```

---

# 4. `os.type()`

Returns the operating system name.

```ts
console.log(os.type());
```

Example on Windows:

```text
Windows_NT
```

Example on Linux:

```text
Linux
```

Example on macOS:

```text
Darwin
```

### Difference between `platform()` and `type()`

```ts
os.platform();
os.type();
```

Think:

```text
platform() → platform identifier
type()     → OS name/type
```

Example:

```text
platform → win32
type     → Windows_NT
```

---

# 5. `os.release()`

Returns the operating system's **release/version information**.

```ts
console.log(os.release());
```

Example:

```text
10.0.26100
```

The exact output depends on the operating system.

### Remember

```text
os.release()
      ↓
OS release/version information
```

---

# 6. `os.homedir()`

Returns the current user's **home directory**.

```ts
console.log(os.homedir());
```

Example:

```text
C:\Users\Abdalrahman
```

On Linux it might look like:

```text
/home/abdalrahman
```

### Common uses

Useful when your application needs to access files relative to the user's home directory.

### Remember

```text
os.homedir()
      ↓
User's home directory
```

---

# 7. `os.tmpdir()`

Returns the operating system's **temporary directory**.

```ts
console.log(os.tmpdir());
```

Example on Windows:

```text
C:\Users\Abdalrahman\AppData\Local\Temp
```

Example on Linux:

```text
/tmp
```

Temporary files can be stored there when appropriate.

### Remember

```text
os.tmpdir()
     ↓
Temporary directory
```

---

# 8. `os.cpus()`

Returns information about the CPUs/CPU cores available to Node.js.

```ts
const cpus = os.cpus();

console.log(cpus);
```

It returns an **array of CPU information objects**.

For example, conceptually:

```ts
[
  {
    model: "...",
    speed: 3600,
    times: {
      user: ...,
      nice: ...,
      sys: ...,
      idle: ...,
      irq: ...
    }
  },
  ...
]
```

So:

```ts
cpus.length
```

gives you the number of CPU entries.

Example:

```text
16
```

This commonly corresponds to the number of **logical processors** Node reports.

---

# 9. `cpus.length`

```ts
const cpus = os.cpus();

console.log(cpus.length);
```

If:

```text
cpus.length = 16
```

then Node.js returned information for 16 logical processors.

### Important

Don't automatically assume this means **16 physical CPU cores**.

A CPU can have:

```text
Physical cores
      ↓
Hyper-threading / SMT
      ↓
Logical processors
```

So `os.cpus().length` is best thought of as the number of logical CPUs Node reports.

---

# 10. CPU `model`

Each CPU object contains a `model` property.

```ts
console.log(cpus[0]?.model);
```

Example:

```text
13th Gen Intel(R) Core(TM) i7-13700H
```

It tells you the CPU model/name reported by the operating system.

---

# 11. CPU `speed`

Each CPU object also has a `speed` property.

```ts
console.log(cpus[0]?.speed);
```

Example:

```text
3600
```

The value is typically expressed in **MHz**.

So:

```text
3600 MHz
≈
3.6 GHz
```

### Remember

```text
cpus[0].speed
       ↓
CPU speed in MHz
```

---

# 12. CPU `times`

Each CPU object contains a `times` object.

```ts
console.log(cpus[0]?.times);
```

It contains CPU time statistics such as:

```ts
{
  user: ...,
  nice: ...,
  sys: ...,
  idle: ...,
  irq: ...
}
```

These values represent how much time the CPU has spent in different states.

For example:

```text
user → user processes
sys  → system/kernel processes
idle → CPU doing nothing
irq  → handling interrupts
```

You normally won't need to use these for basic Node.js backend development.

### Remember

```text
cpus()[0].times
       ↓
CPU time statistics
```

---

# 13. Checking `cpus.length`

Your code uses:

```ts
if (cpus.length > 0) {
  console.log(
    "first CPU model",
    cpus[0]?.model,
    cpus[0].speed,
    cpus[0].times
  );
}
```

The purpose of:

```ts
cpus.length > 0
```

is to make sure the array contains at least one CPU entry before accessing it.

Think:

```text
cpus
 ↓
Is array empty?
 ↓
No → safely access cpus[0]
```

The `?.` is **optional chaining**:

```ts
cpus[0]?.model
```

It means:

> If `cpus[0]` exists, get `.model`; otherwise return `undefined`.

---

# 14. `os.totalmem()`

Returns the **total system memory (RAM)** in bytes.

```ts
console.log(os.totalmem());
```

Example:

```text
17179869184
```

This represents:

```text
16 GB
```

approximately.

### Important

The value is returned in **bytes**.

```text
os.totalmem()
      ↓
RAM in bytes
```

---

# 15. `os.freemem()`

Returns the amount of **currently free memory** in bytes.

```ts
console.log(os.freemem());
```

Example:

```text
4294967296
```

Approximately:

```text
4 GB free
```

Again, the value is in **bytes**.

### Remember

```text
os.totalmem() → total RAM
os.freemem()  → currently free RAM
```

---

# 16. Converting Bytes to GB

Because `totalmem()` and `freemem()` return bytes, you may want to convert them.

```ts
const totalMemory = os.totalmem();
const freeMemory = os.freemem();

const totalGB = totalMemory / 1024 ** 3;
const freeGB = freeMemory / 1024 ** 3;

console.log("Total RAM:", totalGB, "GB");
console.log("Free RAM:", freeGB, "GB");
```

The idea is:

```text
bytes
  ↓
÷ 1024
  ↓
KB
  ↓
÷ 1024
  ↓
MB
  ↓
÷ 1024
  ↓
GB
```

---

# 17. Complete Example

Your example combines the most important `os` functions:

```ts
import * as os from "node:os";

function runOsDemo(): void {
  console.log("platform", os.platform());
  console.log("architecture", os.arch());
  console.log("os type", os.type());
  console.log("os release", os.release());

  console.log("home dir", os.homedir());
  console.log("temp dir", os.tmpdir());

  const cpus = os.cpus();

  console.log("CPU count", cpus.length);

  if (cpus.length > 0) {
    console.log("first CPU model", cpus[0]?.model);
    console.log("first CPU speed", cpus[0]?.speed);
    console.log("first CPU times", cpus[0]?.times);
  }

  console.log("total memory", os.totalmem());
  console.log("free memory", os.freemem());
}

runOsDemo();
```

---

# 18. Important `os` Functions

| Function        | What it gives you      |
| --------------- | ---------------------- |
| `os.platform()` | Platform identifier    |
| `os.arch()`     | CPU architecture       |
| `os.type()`     | OS type/name           |
| `os.release()`  | OS release information |
| `os.homedir()`  | User's home directory  |
| `os.tmpdir()`   | Temporary directory    |
| `os.cpus()`     | CPU information array  |
| `os.totalmem()` | Total RAM in bytes     |
| `os.freemem()`  | Free RAM in bytes      |

---

# 19. Important Mental Model

Remember the `os` module by categories:

### Operating System

```text
platform()
type()
release()
```

### CPU

```text
arch()
cpus()
```

### Directories

```text
homedir()
tmpdir()
```

### Memory

```text
totalmem()
freemem()
```

---

# 20. Small Practical Example

You can use `os` to print a small system information report:

```ts
console.log("OS:", os.type());
console.log("Platform:", os.platform());
console.log("Architecture:", os.arch());

console.log("CPU count:", os.cpus().length);

console.log(
  "RAM:",
  (os.totalmem() / 1024 ** 3).toFixed(2),
  "GB"
);

console.log(
  "Free RAM:",
  (os.freemem() / 1024 ** 3).toFixed(2),
  "GB"
);
```

This kind of information can be useful for:

* System monitoring
* Debugging
* CLI tools
* Server diagnostics
* Performance information

---

## Quick Interview Revision

**Q: What is the `os` module?**

A: A built-in Node.js module that provides information about the operating system and the machine running Node.js.

**Q: What does `os.platform()` return?**

A: The platform identifier, such as `win32`, `linux`, or `darwin`.

**Q: What does `os.arch()` return?**

A: The CPU architecture, such as `x64` or `arm64`.

**Q: What does `os.homedir()` return?**

A: The current user's home directory.

**Q: What does `os.tmpdir()` return?**

A: The operating system's temporary directory.

**Q: What does `os.cpus()` return?**

A: An array containing information about the logical CPUs available to Node.js.

**Q: How do you get the number of logical CPUs?**

A:

```ts
os.cpus().length
```

**Q: What does `os.totalmem()` return?**

A: Total system RAM in **bytes**.

**Q: What does `os.freemem()` return?**

A: Currently free system RAM in **bytes**.

**Q: What's the difference between `platform()` and `type()`?**

A:

```text
platform() → platform identifier
type()     → OS type/name
```

Example:

```text
platform → win32
type     → Windows_NT
```
