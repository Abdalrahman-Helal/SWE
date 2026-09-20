# Node.js File System — Sync, Callback & Promise APIs

## 1. What is the File System module?

Node.js provides the `fs` module to work with files and folders.

Common operations:

* Create folders
* Write files
* Append to files
* Read files
* Get file information
* Delete files

There are three main styles:

```text
Sync APIs
Callback APIs
Promise APIs
```

---

# 2. Imports

```ts
import path from "node:path";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
```

### `node:path`

Used to build file and folder paths.

```ts
const filePath = path.join(process.cwd(), "file-system", "fs-demo");
```

### `node:fs`

Provides:

* Sync APIs
* Callback APIs

### `node:fs/promises`

Provides Promise-based File System APIs that work with `async/await`.

---

# 3. Creating a folder

```ts
function ensureDemoFolderExists() {
  if (!fs.existsSync(DEMO_FOLDER_PATH)) {
    fs.mkdirSync(DEMO_FOLDER_PATH, { recursive: true });
  }
}
```

## `existsSync()`

Checks if a path exists.

```ts
fs.existsSync(path)
```

Returns:

```text
true  → exists
false → doesn't exist
```

## `mkdirSync()`

Creates a directory.

```ts
fs.mkdirSync(path, { recursive: true });
```

### `recursive: true`

Allows Node.js to create missing parent directories.

Example:

```text
data/users/profiles
```

If `data` and `users` don't exist, `recursive: true` can create them.

---

# 4. Sync APIs

Examples:

```ts
fs.writeFileSync()
fs.appendFileSync()
fs.readFileSync()
fs.statSync()
```

The important idea:

> Sync APIs block execution until the operation finishes.

Example:

```ts
const content = fs.readFileSync(FILE_PATH, "utf-8");

console.log(content);
```

The next line doesn't execute until `readFileSync()` finishes.

### Suitable for

* Small scripts
* Startup scripts
* Build scripts
* Local demos

### Avoid in

* HTTP request handlers
* High-traffic APIs
* Long-running background jobs

Because blocking operations prevent Node.js from moving on to other work while the operation is running.

---

# 5. `runSyncExample()`

```ts
function runSyncExample(): FileResult {
  fs.writeFileSync(
    SYNC_FILE_PATH,
    "Created using sync fs ",
    "utf-8"
  );

  fs.appendFileSync(
    SYNC_FILE_PATH,
    "Appended using sync fs ",
    "utf-8"
  );

  const content = fs.readFileSync(
    SYNC_FILE_PATH,
    "utf-8"
  );

  const stats = fs.statSync(SYNC_FILE_PATH);

  return {
    style: "sync",
    content,
    fileName: path.basename(SYNC_FILE_PATH),
    sizeBytes: stats.size,
  };
}
```

Flow:

```text
write file
   ↓
append content
   ↓
read content
   ↓
get file information
   ↓
return FileResult
```

Because these are Sync APIs, each operation finishes before the next one starts.

---

# 6. `writeFile`

Callback version:

```ts
fs.writeFile(path, data, encoding, callback)
```

Example:

```ts
fs.writeFile(
  FILE_PATH,
  "Hello",
  "utf-8",
  (error) => {
    // runs when writing finishes
  }
);
```

Arguments:

### `path`

The file path.

### `data`

The content to write.

### `encoding`

For example:

```ts
"utf-8"
```

### `callback`

A function Node.js calls after the operation finishes.

For `writeFile`, the callback commonly receives:

```ts
(error)
```

---

# 7. `appendFile`

```ts
fs.appendFile(path, data, encoding, callback)
```

It adds content to an existing file instead of replacing its existing content.

Example:

```ts
fs.appendFile(
  FILE_PATH,
  "More content",
  "utf-8",
  (error) => {
    // operation finished
  }
);
```

---

# 8. What is the callback?

A callback is simply a function passed to another function so it can be executed later.

Example:

```ts
doSomething(() => {
  console.log("Finished");
});
```

The callback doesn't execute just because you wrote it there.

The API decides when to call it.

For `fs`:

```text
fs.appendFile()
      ↓
Node starts the file operation
      ↓
operation finishes
      ↓
Node calls the callback
```

So:

```ts
(error) => {
  console.log("Finished");
}
```

means:

> "When `appendFile` finishes, execute this function."

---

# 9. Error-first callback

Node.js File System callback APIs commonly use this pattern:

```ts
(error, result)
```

For example:

```ts
fs.readFile(
  FILE_PATH,
  "utf-8",
  (error, content) => {
    if (error) {
      console.log(error.message);
      return;
    }

    console.log(content);
  }
);
```

If the operation fails:

```text
callback(error, ...)
```

If it succeeds:

```text
callback(null, content)
```

Therefore:

```ts
if (error) {
  // there is an error
}
```

works because:

```text
null  → falsy
Error → truthy
```

### Important

The callback itself is **NOT only for errors**.

The callback is the function that runs after the operation finishes.

`error` is just information Node passes to it.

---

# 10. `readFile`

Callback version:

```ts
fs.readFile(
  FILE_PATH,
  "utf-8",
  (error, content) => {
    // ...
  }
);
```

Main arguments:

```text
path
encoding
callback
```

Callback:

```ts
(error, content)
```

Why does it have `content`?

Because `readFile` needs to give you the data it read.

Without an encoding such as `"utf-8"`, the returned content is generally a `Buffer`.

With:

```ts
"utf-8"
```

the content is a string.

---

# 11. `stat`

```ts
fs.stat(FILE_PATH, callback)
```

`stat` gives information about the file.

Example:

```ts
fs.stat(FILE_PATH, (error, stats) => {
  if (error) {
    return;
  }

  console.log(stats.size);
});
```

`stats` can provide information such as:

```ts
stats.size
stats.isFile()
stats.isDirectory()
stats.birthtime
stats.mtime
```

Important:

> `stat` does NOT read the file's content.

It gives metadata/information about the file.

---

# 12. Converting Callback APIs to Promises

Our callback example returns:

```ts
Promise<FileResult>
```

Why?

Because we wrapped the callback APIs inside:

```ts
new Promise(...)
```

Example:

```ts
function runCallbackExample(): Promise<FileResult> {
  return new Promise((resolve, reject) => {
    // callback APIs
  });
}
```

The idea:

```text
callback APIs
     ↓
new Promise(...)
     ↓
resolve(...) / reject(...)
     ↓
Promise<FileResult>
     ↓
await
     ↓
FileResult
```

---

# 13. `resolve` and `reject`

```ts
resolve(value);
```

means:

> The Promise succeeded.

```ts
reject(error);
```

means:

> The Promise failed.

If the Promise is:

```ts
Promise<FileResult>
```

then the successful value passed to `resolve()` should be a `FileResult`.

Example:

```ts
resolve({
  style: "callback",
  content,
  fileName: path.basename(FILE_PATH),
  sizeBytes: stats.size,
});
```

---

# 14. Why `return` after `reject()`?

Example:

```ts
if (appendError) {
  reject(appendError);
  return;
}
```

Important:

```ts
reject(appendError);
```

does **NOT** automatically stop the current function.

`return` stops the current callback/function.

So:

```text
reject(error)
    ↓
Promise becomes rejected
    ↓
return
    ↓
stop executing this callback
```

Without `return`, JavaScript can continue executing the remaining code in that callback.

Also remember:

> A Promise can settle only once.

If:

```ts
reject(error);
resolve(value);
```

`reject` wins if it happens first.

The later `resolve` is ignored.

But the JavaScript code still continues unless you use `return`.

---

# 15. Promise APIs

Node.js provides Promise-based File System APIs through:

```ts
import fsPromises from "node:fs/promises";
```

Example:

```ts
await fsPromises.writeFile(...)
await fsPromises.appendFile(...)
await fsPromises.readFile(...)
await fsPromises.stat(...)
```

These APIs return Promises directly.

You don't need to manually create:

```ts
new Promise(...)
```

---

# 16. `runPromiseExample()`

```ts
async function runPromiseExample(): Promise<FileResult> {
  await fsPromises.writeFile(
    PROMISE_FILE_PATH,
    "Created using promise APIs ",
    "utf-8"
  );

  await fsPromises.appendFile(
    PROMISE_FILE_PATH,
    "Appended using promise APIs ",
    "utf-8"
  );

  const content = await fsPromises.readFile(
    PROMISE_FILE_PATH,
    "utf-8"
  );

  const stats = await fsPromises.stat(
    PROMISE_FILE_PATH
  );

  return {
    style: "promises",
    content,
    fileName: path.basename(PROMISE_FILE_PATH),
    sizeBytes: stats.size,
  };
}
```

Flow:

```text
writeFile
   ↓
appendFile
   ↓
readFile
   ↓
stat
   ↓
return FileResult
```

Each `await` waits for that Promise to settle before continuing.

---

# 17. Why `await` is used here

`fsPromises.writeFile()` returns a Promise.

So:

```ts
const result = fsPromises.writeFile(...);
```

gives you a Promise.

With:

```ts
await fsPromises.writeFile(...);
```

you wait for that Promise to finish.

Remember:

```text
Promise API
    ↓
returns Promise
    ↓
can use await
```

---

# 18. Why `runSyncExample()` doesn't need `await`

The functions have different return types:

```ts
function runSyncExample(): FileResult
```

It returns the actual result:

```text
runSyncExample()
      ↓
FileResult
```

But:

```ts
async function runPromiseExample(): Promise<FileResult>
```

returns:

```text
runPromiseExample()
      ↓
Promise<FileResult>
      ↓
await
      ↓
FileResult
```

Therefore:

```ts
const syncResult = runSyncExample();

const promiseResult = await runPromiseExample();
```

---

# 19. The three styles together

## Sync

```ts
const result = fs.readFileSync(FILE_PATH, "utf-8");
```

```text
Call
 ↓
Wait / block
 ↓
Get result
```

## Callback

```ts
fs.readFile(FILE_PATH, "utf-8", (error, data) => {
  // use data here
});
```

```text
Call
 ↓
Node performs operation
 ↓
Callback runs when finished
```

## Promise

```ts
const data = await fsPromises.readFile(
  FILE_PATH,
  "utf-8"
);
```

```text
Call
 ↓
Promise
 ↓
await
 ↓
Get result
```

---

# 20. `main()`

```ts
async function main(): Promise<void> {
  try {
    ensureDemoFolderExists();

    const syncResult = runSyncExample();
    const callbackResult = await runCallbackExample();
    const promiseResult = await runPromiseExample();

    console.log([
      syncResult,
      callbackResult,
      promiseResult
    ]);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "unknown error";

    console.error("file system error", message);
  }
}

main();
```

Notice:

```ts
const syncResult = runSyncExample();
```

No `await` because it returns `FileResult`.

```ts
const callbackResult = await runCallbackExample();
```

`await` because it returns `Promise<FileResult>`.

```ts
const promiseResult = await runPromiseExample();
```

`await` because it returns `Promise<FileResult>`.

---

# 21. `try/catch` with Promises

This:

```ts
try {
  const result = await runPromiseExample();
} catch (error) {
  console.log(error);
}
```

can catch a rejected Promise.

For example, if:

```ts
reject(error);
```

happens inside `runCallbackExample()`, then:

```ts
await runCallbackExample()
```

throws the rejection into the surrounding `try/catch`.

Flow:

```text
fs error
   ↓
reject(error)
   ↓
Promise rejected
   ↓
await
   ↓
catch(error)
```

---

# 22. Important mental model

Don't think:

```text
Callback = Error
```

Think:

```text
Callback = "Run this function when the operation finishes."
```

And for Node.js `fs` callback APIs:

```text
(error, result)
```

is the convention for passing the operation result.

Then:

```text
Callback API
     ↓
callback(error, result)

Promise API
     ↓
Promise<result>
     ↓
await

Sync API
     ↓
result directly
```

---

# 23. Most important things to remember

### `fs`

Used for File System operations.

### Sync

```ts
fs.readFileSync()
```

Returns the result directly, but blocks execution.

### Callback

```ts
fs.readFile(..., callback)
```

Node calls the callback after the operation finishes.

### Promise

```ts
fsPromises.readFile()
```

Returns a Promise.

### `async/await`

`await` works with Promises.

### `Promise<T>`

Means:

> A Promise that eventually gives you a value of type `T` when fulfilled.

Example:

```ts
Promise<FileResult>
```

means:

```text
Promise
   ↓
FileResult
```

### `resolve`

Success:

```ts
resolve(value);
```

### `reject`

Failure:

```ts
reject(error);
```

### `null`

Falsy:

```ts
if (null) {
  // doesn't run
}
```

So in an error-first callback:

```ts
if (error) {
  // error exists
}
```

works because:

```text
null  → false
Error → true
```
