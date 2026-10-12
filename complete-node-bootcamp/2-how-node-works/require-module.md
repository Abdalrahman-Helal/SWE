# Node.js Modules: `module.exports`, `exports`, and Module Caching

## 1. `module.exports` — Exporting a Class or Function

In `test-module-1.js`:

```js
module.exports = class {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
};
```

In the main file:

```js
const C = require("./test-module-1.js");

const calc = new C();

console.log(calc.add(2, 5)); // 7
```

### How it works

- `module.exports` determines what a module returns when another file imports it using `require()`.
- Here, the module exports a class.
- `require()` returns that class, and `new C()` creates an instance of it.

**Mental model:** `module.exports` defines the public value that a module exposes to other files.

---

## 2. `exports` — Exporting Multiple Functions

In `test-module-2.js`:

```js
exports.add = (a, b) => a + b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;
```

In the main file:

```js
const { add, multiply, divide } = require("./test-module-2.js");

console.log(add(2, 5)); // 7
console.log(multiply(5, 2)); // 10
console.log(divide(5, 2)); // 2.5
```

### How it works

- `exports` initially references the same object as `module.exports`.
- Adding properties to `exports` adds them to the exported object.
- `require()` returns that object.
- **Destructuring** lets us extract specific functions directly.

### Important Difference

```js
exports.add = (a, b) => a + b; // Works
```

But:

```js
exports = (a, b) => a + b; // Does NOT replace the exported value
```

Why?

`exports` is initially a reference to `module.exports`. Reassigning `exports` does not change `module.exports`.

To replace the exported value completely, use:

```js
module.exports = (a, b) => a + b;
```

### Quick Comparison

| `module.exports`                                     | `exports`                                               |
| ---------------------------------------------------- | ------------------------------------------------------- |
| Can export a class, function, object, or other value | Convenient for adding properties to the exported object |
| Can replace the exported value completely            | Reassigning it does not replace `module.exports`        |
| Useful when exporting one main value                 | Useful when exporting multiple functions or properties  |

---

## 3. Module Caching — Why Does the Module Run Only Once?

In `test-module-3.js`:

```js
console.log("Hello from the module");

module.exports = () => {
  console.log("Log this beautiful text");
};
```

In the main file:

```js
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
```

### Output

```text
Hello from the module
Log this beautiful text
Log this beautiful text
Log this beautiful text
```

### How it works

**First `require()`:**

1. Node.js loads the module.
2. The module's top-level code executes, printing `Hello from the module`.
3. Node.js caches the loaded module and its exports.
4. The exported function is returned and invoked with `()`.

**Second and third `require()` calls:**

1. Node.js retrieves the cached module instead of executing its top-level code again.
2. The exported function is returned.
3. The trailing `()` invokes the function again.

### Remember the Difference

```js
require("./test-module-3");
```

Loads or retrieves the module.

```js
require("./test-module-3")();
```

Loads or retrieves the module, then calls the exported function.

**Key idea:** Module caching prevents the same CommonJS module from being evaluated repeatedly under normal conditions, but you can still call its exported function multiple times.

---

## 4. `arguments` and `module.wrapper`

Jonas also demonstrates these expressions:

```js
console.log(arguments);
console.log(require("module").wrapper);
```

These help explain how Node.js handles CommonJS modules internally.

### `arguments`

Inside a CommonJS module's wrapper function, `arguments` contains the arguments passed to that function.

The wrapper receives values corresponding to:

- `exports`
- `require`
- `module`
- `__filename`
- `__dirname`

### `module.wrapper`

```js
console.log(require("module").wrapper);
```

This shows the wrapper structure Node.js uses for CommonJS modules.

These details are useful for understanding what happens under the hood, but you do not need to memorize them yet.

---

## 5. CommonJS vs. ES Modules (ESM)

CommonJS uses:

```js
const fs = require("fs");

module.exports = myFunction;
```

ES Modules use:

```js
import fs from "node:fs";

export default myFunction;
```

Named exports in ESM:

```js
export const add = (a, b) => a + b;
```

Importing named exports:

```js
import { add } from "./math.js";
```

### Is CommonJS outdated?

No. **CommonJS is not deprecated** and remains widely used in existing Node.js projects and libraries.

ES Modules are the modern JavaScript module standard and are commonly used in new projects. Learn both, because you will encounter both styles in real-world codebases.

---

## Final Summary

| Concept          | Meaning                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `module.exports` | Defines the value a CommonJS module exports                                                 |
| `exports`        | A convenient reference for adding properties to `module.exports`                            |
| `require()`      | Loads or retrieves a CommonJS module                                                        |
| Destructuring    | Extracts properties from an object                                                          |
| Module caching   | Allows Node.js to reuse a loaded module without evaluating it again under normal conditions |
| `arguments`      | Contains arguments passed to the CommonJS wrapper function                                  |
| `module.wrapper` | Reveals the wrapper structure used for CommonJS modules                                     |
| ESM              | Uses `import` and `export` instead of `require()` and `module.exports`                      |

### The Most Important Mental Model

1. **Export:** Decide what a file exposes using `module.exports` or `exports`.
2. **Import:** Retrieve that value using `require()`.
3. **Cache:** Node.js normally evaluates a CommonJS module once and reuses its cached exports.
4. **Execute:** If the exported value is a function, calling it is a separate action from importing it.
